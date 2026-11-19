<?php

namespace App\Modules\Auth\Infrastructure;

use App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel;
use App\Modules\Admin\System\LevelPengguna\Infrastructure\LevelPenggunaModel;
use App\Modules\Auth\Contracts\UserRepository;
use Illuminate\Support\Facades\Hash;

/**
 * Hanya memakai tabel `pengguna` dan `level_pengguna` dari migrasi yang sudah ada.
 */
final class EloquentUserRepository implements UserRepository
{
    public function findByEmail(string $email): ?PenggunaModel
    {
        return PenggunaModel::query()
            ->with('levelPengguna')
            ->where('email', $email)
            ->first();
    }

    public function createWithRole(array $data, string $roleSlug): PenggunaModel
    {
        $role = LevelPenggunaModel::query()
            ->firstOrCreate(
                ['slug' => $roleSlug],
                ['name' => LevelPenggunaModel::daftar()[$roleSlug] ?? ucfirst($roleSlug)]
            );

        $user = PenggunaModel::create([
            'level_pengguna_id' => $role->id,
            'nama_lengkap' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'telepon' => $data['telepon'] ?? null,
            'alamat' => $data['alamat'] ?? null,
            'foto_profil' => $data['foto_profil'] ?? null,
            'is_aktif' => true,
        ]);

        return $user->load('levelPengguna');
    }
}
