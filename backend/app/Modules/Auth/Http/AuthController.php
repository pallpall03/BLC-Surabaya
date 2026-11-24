<?php

namespace App\Modules\Auth\Http;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Application\LoginUser;
use App\Modules\Auth\Application\LogoutUser;
use App\Modules\Auth\Application\RegisterPengguna;
use App\Modules\Auth\Exceptions\LoginAuthenticationException;
use App\Modules\Auth\Http\Requests\LoginRequest;
use App\Modules\Auth\Http\Requests\RegisterPenggunaRequest;
use App\Modules\Auth\Http\Resources\AuthUserResource;
use App\\Modules\\Role;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

final class AuthController extends Controller
{
    /** POST /api/v1/auth/login — semua role, pakai NIK atau username. */
    public function login(LoginRequest $request, LoginUser $useCase): JsonResponse
    {
        $loginIdentifier = $request->validated('login_identifier');
        $kunci = $loginIdentifier.'|'.$request->ip();

        // Rate limit umum (30/menit) sudah di route middleware
        // Logika captcha & lockout di-handle di LoginUser use case

        try {
            $hasil = $useCase->handle(
                $loginIdentifier,
                $request->validated('password'),
                $request->validated('captcha'),
                $request->validated('captcha_key')
            );
        } catch (LoginAuthenticationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'captcha_required' => $e->captchaRequired,
                'captcha_key' => $e->captchaKey,
                'captcha_question' => $e->captchaQuestion,
            ], $e->getCode() ?: 401);
        } catch (AuthenticationException $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 401);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }

        return response()->json([
            'token' => $hasil['token'],
            'token_type' => 'Bearer',
            'expires_in' => $hasil['expires_in'],
            'user' => new AuthUserResource($hasil['user']),
            'captcha_required' => $hasil['captcha_required'] ?? false,
            'captcha_key' => $hasil['captcha_key'] ?? null,
            'captcha_question' => $hasil['captcha_question'] ?? null,

    \$allowedRoles = ['peserta', 'pengunjung'];
    \$user = \$hasil['user'];
    if (!in_array(\$user->role->slug, \$allowedRoles)) {
        throw new AuthenticationException('Akses tidak diizinkan', 401);
    }        ]);
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

    /** GET /api/v1/auth/captcha — generate new captcha */
    public function captcha(LoginUser $useCase): JsonResponse
    {
        $captcha = $useCase->generateCaptcha();
        return response()->json([
            'key' => $captcha['key'],
            'question' => $captcha['question'],
        ]);
    }
}
