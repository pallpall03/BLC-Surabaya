<?php

namespace App\Modules\Auth\Infrastructure;

use App\Models\Role;
use App\Models\User;
use App\Modules\Auth\Contracts\UserRepository;

/**
 * Memakai tabel `users` dan `roles` (kolom users.role_id) dari migrasi yang ada.
 */
final class EloquentUserRepository implements UserRepository
{
    public function findByLogin(string $login): ?User
    {
        $login = trim($login);

        return User::query()
            ->with('role')
            ->where('nik', $login)
            ->orWhereRaw('lower(username) = ?', [mb_strtolower($login)])
            ->first();
    }

    public function findByEmail(string $email): ?User
    {
        return User::query()
            ->with('role')
            ->whereRaw('lower(email) = ?', [mb_strtolower(trim($email))])
            ->first();
    }

    public function createWithRole(array $data, string $roleSlug): User
    {
        $role = Role::query()->firstOrCreate(
            ['slug' => $roleSlug],
            ['name' => Role::daftar()[$roleSlug] ?? ucfirst($roleSlug)],
        );

        // password berupa teks biasa: di-hash otomatis oleh cast 'hashed' pada model User.
        $user = User::create([
            'name' => $data['name'],
            'nik' => $data['nik'],
            'email' => mb_strtolower(trim($data['email'])),
            'password' => $data['password'],
            'role_id' => $role->id,
        ]);

        return $user->load('role');
    }
}
