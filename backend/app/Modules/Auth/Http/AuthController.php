<?php

namespace App\Modules\Auth\Http;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Application\LoginUser;
use App\Modules\Auth\Application\LogoutUser;
use App\Modules\Auth\Application\RegisterPengguna;
use App\Modules\Auth\Http\Requests\LoginRequest;
use App\Modules\Auth\Http\Requests\RegisterPenggunaRequest;
use App\Modules\Auth\Http\Resources\AuthUserResource;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

final class AuthController extends Controller
{
    private const MAX_PERCOBAAN = 5;

    private const JEDA_DETIK = 60;

    /** POST /api/v1/auth/register — khusus peserta (role selalu peserta). */
    public function register(RegisterPenggunaRequest $request, RegisterPengguna $useCase): JsonResponse
    {
        try {
            $hasil = $useCase->handle($request->safe()->only(['name', 'email', 'password']));
        } catch (UniqueConstraintViolationException) {
            // Dua pendaftaran dengan email sama pada saat bersamaan: lolos validasi, kalah di constraint DB.
            throw ValidationException::withMessages(['email' => 'Email sudah terdaftar.']);
        }

        return response()->json([
            'token' => $hasil['token'],
            'token_type' => 'Bearer',
            'expires_in' => $hasil['expires_in'],
            'user' => new AuthUserResource($hasil['user']),
        ], 201);
    }

    /** POST /api/v1/auth/login — semua role. */
    public function login(LoginRequest $request, LoginUser $useCase): JsonResponse
    {
        $email = $request->validated('email');
        $kunci = $email.'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($kunci, self::MAX_PERCOBAAN)) {
            $tunggu = RateLimiter::availableIn($kunci);

            return response()->json([
                'message' => 'Terlalu banyak percobaan login. Coba lagi nanti.',
                'retry_after' => $tunggu,
            ], 429)->header('Retry-After', (string) $tunggu);
        }

        try {
            $hasil = $useCase->handle($email, $request->validated('password'));
        } catch (AuthenticationException $e) {
            RateLimiter::hit($kunci, self::JEDA_DETIK);

            return response()->json(['message' => $e->getMessage()], 401);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }

        RateLimiter::clear($kunci);

        return response()->json([
            'token' => $hasil['token'],
            'token_type' => 'Bearer',
            'expires_in' => $hasil['expires_in'],
            'user' => new AuthUserResource($hasil['user']),
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
