<?php

namespace App\Modules\Auth\Application;

use App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel;
use App\Modules\Auth\Contracts\UserRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
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
     * @return array{user: PenggunaModel, token: string}
     *
     * @throws AuthenticationException
     * @throws AuthorizationException
     */
    public function handle(string $email, string $password): array
    {
        $user = $this->users->findByEmail($email);

        if ($user === null || ! Hash::check($password, $user->password)) {
            throw new AuthenticationException('Email atau password salah.');
        }

        if ($user->levelPengguna === null) {
            throw new AuthorizationException('Akun ini belum memiliki role. Hubungi admin.');
        }

        // Generate JWT token
        $token = JWTAuth::fromUser($user);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
