<?php

namespace App\Modules\Auth\Application;

use App\Modules\Admin\System\LevelPengguna\Infrastructure\LevelPenggunaModel;
use App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel;
use App\Modules\Auth\Contracts\UserRepository;

/**
 * Pendaftaran akun pengguna (calon peserta). Role SELALU pengguna dan ditentukan di sini,
 * tidak pernah dibaca dari request (mencegah orang mendaftar sebagai admin).
 */
final class RegisterPengguna
{
    public function __construct(private readonly UserRepository $users)
    {
    }

    /**
     * @param  array{name: string, email: string, password: string, telepon?: string, alamat?: string, foto_profil?: string}  $data
     * @return array{user: PenggunaModel, token: string}
     */
    public function handle(array $data, string $roleSlug = LevelPenggunaModel::PENGGUNA): array
    {
        $user = $this->users->createWithRole($data, $roleSlug);

        return [
            'user' => $user,
            'token' => $user->createToken('auth')->plainTextToken,
        ];
    }
}
