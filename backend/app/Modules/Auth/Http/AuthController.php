<?php

namespace App\Modules\Auth\Http;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Application\BukaKunciAkun;
use App\Modules\Auth\Application\Exceptions\LoginDitolak;
use App\Modules\Auth\Application\LoginUser;
use App\Modules\Auth\Application\LogoutUser;
use App\Modules\Auth\Application\RegisterPengguna;
use App\Modules\Auth\Contracts\CaptchaService;
use App\Modules\Auth\Http\Requests\LoginRequest;
use App\Modules\Auth\Http\Requests\RegisterPenggunaRequest;
use App\Modules\Auth\Http\Resources\AuthUserResource;
use App\Shared\Support\DashboardAccess;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;

final class AuthController extends Controller
{
    /** POST /api/v1/auth/register — khusus peserta (role selalu peserta). */
    public function register(RegisterPenggunaRequest $request, RegisterPengguna $useCase): JsonResponse
    {
        try {
            $hasil = $useCase->handle($request->safe()->only(['name', 'nik', 'email', 'password']));
        } catch (UniqueConstraintViolationException) {
            // Dua pendaftaran dengan email atau NIK sama pada saat bersamaan: lolos validasi, kalah di constraint DB.
            throw ValidationException::withMessages(['email' => 'Email atau NIK sudah terdaftar.']);
        }

        return $this->responsLogin($hasil, 201);
    }

    /** GET /api/v1/auth/captcha — captcha baru; frontend memuat ulang tiap `refresh_in` detik. */
    public function captcha(CaptchaService $captcha): JsonResponse
    {
        $baru = $captcha->buat();

        return response()->json([
            'captcha_id' => $baru['id'],
            'image' => $baru['image'],
            'refresh_in' => $baru['refresh_in'],
        ])->header('Cache-Control', 'no-store');
    }

    /** POST /api/v1/auth/login — semua role, memakai NIK, username, atau email. */
    public function login(LoginRequest $request, LoginUser $useCase): JsonResponse
    {
        try {
            $hasil = $useCase->handle(
                $request->validated('login'),
                $request->validated('password'),
                $request->validated('captcha_id'),
                $request->validated('captcha'),
            );
        } catch (LoginDitolak $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'captcha_required' => $e->captchaWajib,
                'locked' => $e->terkunci,
                'attempts_left' => $e->sisaPercobaan,
            ], $e->status)->header('Cache-Control', 'no-store');
        }

        return $this->responsLogin($hasil);
    }

    /** POST /api/v1/auth/refresh — tukar token yang masih dalam jendela refresh dengan token baru. */
    public function refresh(): JsonResponse
    {
        $guard = Auth::guard('api');

        try {
            $token = $guard->refresh();
            // Token lama langsung masuk blacklist, jadi user harus dibaca dari token baru.
            $user = $guard->setToken($token)->user();
        } catch (JWTException) {
            $token = null;
            $user = null;
        }

        if ($token === null || $user === null) {
            return response()->json([
                'message' => 'Sesi berakhir. Silakan login kembali.',
                'redirect_to' => '/login',
            ], 401)->header('Cache-Control', 'no-store')->withCookie(DashboardAccess::forgetCookie());
        }

        if (! $user->aktif()) {
            return response()->json([
                'message' => 'Akun tidak aktif. Hubungi admin.',
                'redirect_to' => '/login',
            ], 403)->header('Cache-Control', 'no-store')->withCookie(DashboardAccess::forgetCookie());
        }

        // Token hasil refresh berumur JWT_REFRESH_TTL, bukan JWT_TTL: ambil dari claim exp
        // supaya expires_in dan umur cookie tidak lebih pendek dari tokennya.
        $kedaluwarsa = $guard->payload()->get('exp');
        $detikBerlaku = $kedaluwarsa === null ? 0 : max(0, (int) $kedaluwarsa - now()->getTimestamp());

        return $this->responsLogin([
            'token' => $token,
            'expires_in' => $detikBerlaku,
            'user' => $user,
        ]);
    }

    /** POST /api/v1/administrator/akun/{id}/buka-kunci — hanya role superadmin. */
    public function bukaKunci(Request $request, int $id, BukaKunciAkun $useCase): JsonResponse
    {
        $user = $useCase->handle($id, $request->user()?->getKey());

        return response()->json([
            'message' => 'Akun berhasil dibuka.',
            'user' => new AuthUserResource($user),
        ])->header('Cache-Control', 'no-store');
    }

    /** POST /api/v1/auth/logout */
    public function logout(Request $request, LogoutUser $useCase): JsonResponse
    {
        try {
            $useCase->handle();
        } catch (JWTException) {
            // Token sudah kedaluwarsa/dicabut: tetap bersihkan cookie dan balas sukses.
        }

        return response()->json(['message' => 'Berhasil logout.'])
            ->header('Cache-Control', 'no-store')
            ->withCookie(DashboardAccess::forgetCookie());
    }

    /** GET /api/v1/auth/akses-dashboard[/{role}] — keputusan akhir akses dan redirect role. */
    public function aksesDashboard(Request $request, ?string $role = null): JsonResponse
    {
        if ($role === null) {
            $path = $request->query('path');
            $role = is_string($path) ? DashboardAccess::roleForPath($path) : null;
        }

        if ($role === null) {
            return response()->json([
                'message' => 'Dashboard tidak tersedia.',
            ], 404)->header('Cache-Control', 'no-store');
        }

        if (! $request->user()->hasRole($role)) {
            return response()->json([
                'message' => 'Role akun tidak sesuai dengan dashboard ini. Silakan login ulang.',
                'redirect_to' => '/login',
            ], 403)->header('Cache-Control', 'no-store');
        }

        return response()->json([
            'allowed' => true,
            'redirect_to' => DashboardAccess::url($request->user()),
            'user' => new AuthUserResource($request->user()->loadMissing('role')),
        ])->header('Cache-Control', 'no-store');
    }

    /** GET /api/v1/auth/me */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new AuthUserResource($request->user()->loadMissing('role')),
        ])->header('Cache-Control', 'no-store');
    }

    /** @param array{token: string, expires_in: int, user: \App\Models\User} $hasil */
    private function responsLogin(array $hasil, int $status = 200): JsonResponse
    {
        $response = response()->json([
            'token' => $hasil['token'],
            'token_type' => 'Bearer',
            'expires_in' => $hasil['expires_in'],
            'dashboard_url' => DashboardAccess::url($hasil['user']),
            'user' => new AuthUserResource($hasil['user']),
        ], $status)->header('Cache-Control', 'no-store');

        return $response->withCookie(DashboardAccess::cookie($hasil['token'], $hasil['expires_in']));
    }
}
