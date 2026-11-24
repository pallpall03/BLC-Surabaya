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
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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

        return response()->json([
            'token' => $hasil['token'],
            'token_type' => 'Bearer',
            'expires_in' => $hasil['expires_in'],
            'user' => new AuthUserResource($hasil['user']),
        ], 201);
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

    /** POST /api/v1/auth/login — semua role, memakai NIK. */
    public function login(LoginRequest $request, LoginUser $useCase): JsonResponse
    {
        try {
            $hasil = $useCase->handle(
                $request->validated('nik'),
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
            ], $e->status);
        }

        return response()->json([
            'token' => $hasil['token'],
            'token_type' => 'Bearer',
            'expires_in' => $hasil['expires_in'],
            'user' => new AuthUserResource($hasil['user']),
        ]);
    }

    /** POST /api/v1/administrator/akun/{id}/buka-kunci — hanya path administrator (role superadmin). */
    public function bukaKunci(int $id, BukaKunciAkun $useCase): JsonResponse
    {
        $user = $useCase->handle($id);

        return response()->json([
            'message' => 'Akun berhasil dibuka.',
            'user' => new AuthUserResource($user),
        ]);
    }

    /** POST /api/v1/auth/logout */
    public function logout(Request $request, LogoutUser $useCase): JsonResponse
    {
        $useCase->handle();

        return response()->json(['message' => 'Berhasil logout.']);
    }

    /** GET /api/v1/auth/me */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new AuthUserResource($request->user()->loadMissing('role')),
        ]);
    }
}
