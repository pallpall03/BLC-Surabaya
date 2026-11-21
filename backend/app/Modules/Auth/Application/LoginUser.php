<?php

namespace App\Modules\Auth\Application;

use App\Models\User;
use App\Modules\Auth\Contracts\UserRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Login untuk semua role (satu pintu). Pesan gagal sengaja sama untuk
 * "email tidak ada" dan "password salah" supaya akun tidak bisa ditebak.
 *
 * Catatan: integrasi SSO Kantorku dan captcha belum ada (menunggu spesifikasi API).
 */
final class LoginUser
{
    public function __construct(private readonly UserRepository $users)
    {
    }

    /**
     * @return array{user: User, token: string, expires_in: int}
     *
     * @throws AuthenticationException
     * @throws AuthorizationException
     */
    public function handle(string $email, string $password): array
    {
        $user = $this->users->findByEmail($email);

        if ($user === null) {
            // Tetap menghitung hash supaya waktu responsnya setara dengan "password salah":
            // email yang terdaftar tidak bisa ditebak dari kecepatan respons.
            Hash::make($password);

            throw new AuthenticationException('Email atau password salah.');
        }

        if (! Hash::check($password, $user->password)) {
            throw new AuthenticationException('Email atau password salah.');
        }

        if ($user->role === null) {
            throw new AuthorizationException('Akun ini belum memiliki role. Hubungi admin.');
        }

        return [
            'user' => $user,
            'token' => JWTAuth::fromUser($user),
            'expires_in' => self::detikBerlaku(),
        ];
    }

    /** Masa berlaku token dalam detik (dari JWT_TTL di .env, satuan menit). */
    public static function detikBerlaku(): int
    {
        return JWTAuth::factory()->getTTL() * 60;
    }
}
