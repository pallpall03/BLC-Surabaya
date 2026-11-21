<?php

namespace App\Modules\Auth\Application;

use App\Models\Role;
use App\Models\User;
use App\Modules\Auth\Contracts\UserRepository;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Pendaftaran akun peserta. Role SELALU peserta dan ditentukan di sini,
 * tidak pernah dibaca dari request (mencegah orang mendaftar sebagai admin).
 * Role lain (instruktur, koordinator, dst.) dibuat lewat alur admin, bukan register publik.
 */
final class RegisterPengguna
{
    public function __construct(private readonly UserRepository $users)
    {
    }

    /**
     * @param  array{name: string, email: string, password: string}  $data
     * @return array{user: User, token: string, expires_in: int}
     */
    public function handle(array $data, string $roleSlug = Role::PESERTA): array
    {
        $user = $this->users->createWithRole($data, $roleSlug);

        return [
            'user' => $user,
            'token' => JWTAuth::fromUser($user),
            'expires_in' => LoginUser::detikBerlaku(),
        ];
    }
}
