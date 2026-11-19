<?php

namespace App\Modules\Admin\System\Pengguna\Infrastructure;

use App\Models\Role;
use App\Modules\Admin\System\Pengguna\Contracts\PenggunaRepository;
use App\Modules\Admin\System\Pengguna\Domain\Pengguna;
use App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel;
use Illuminate\Support\Facades\Hash;

/**
 * Implementasi Repository untuk Pengguna menggunakan Eloquent (tabel users).
 */
final class EloquentPenggunaRepository implements PenggunaRepository
{
    public function all(): array
    {
        return PenggunaModel::with('role')->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = PenggunaModel::with('role')->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
            $data['plain_password'] = $data['password'];
        }
        if (!isset($data['username']) && isset($data['email'])) {
            $data['username'] = $data['email'];
        }
        if (!isset($data['name']) && isset($data['nama_lengkap'])) {
            $data['name'] = $data['nama_lengkap'];
        }
        if (!isset($data['tipe']) && isset($data['role_id'])) {
            $role = Role::find($data['role_id']);
            if ($role) {
                $data['tipe'] = $role->slug;
            }
        }
        if (!isset($data['status'])) {
            $data['status'] = 'aktif';
        }
        if (!isset($data['is_aktif'])) {
            $data['is_aktif'] = true;
        }
        $model = PenggunaModel::create($data);
        return $this->toDomain($model->fresh()->load('role'));
    }

    public function update(int $id, array $data): mixed
    {
        $model = PenggunaModel::findOrFail($id);
        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
            $data['plain_password'] = $data['password'];
        } else {
            unset($data['password'], $data['plain_password']);
        }
        if (isset($data['nama_lengkap'])) {
            $data['name'] = $data['nama_lengkap'];
            unset($data['nama_lengkap']);
        }
        if (isset($data['role_id'])) {
            $role = Role::find($data['role_id']);
            if ($role) {
                $data['tipe'] = $role->slug;
            }
        }
        $model->update($data);
        return $this->toDomain($model->fresh()->load('role'));
    }

    public function delete(int $id): void
    {
        PenggunaModel::findOrFail($id)->delete();
    }

    public function getAktif(): array
    {
        return PenggunaModel::aktif()->with('role')->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getByEmail(string $email): ?Pengguna
    {
        $model = PenggunaModel::with('role')->where('email', $email)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function getByRole(string $roleSlug): array
    {
        return PenggunaModel::byRole($roleSlug)->with('role')->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function createWithRole(array $data, string $roleSlug): Pengguna
    {
        $role = Role::where('slug', $roleSlug)->first();
        if (!$role) {
            throw new \InvalidArgumentException("Role '{$roleSlug}' tidak ditemukan");
        }

        $user = PenggunaModel::create([
            'role_id' => $role->id,
            'username' => $data['email'] ?? $data['username'],
            'password' => Hash::make($data['password']),
            'plain_password' => $data['password'],
            'name' => $data['name'] ?? $data['nama_lengkap'] ?? null,
            'email' => $data['email'],
            'status' => 'aktif',
            'tipe' => $roleSlug,
            'is_aktif' => true,
        ]);

        return $this->toDomain($user->fresh()->load('role'));
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(PenggunaModel $model): Pengguna
    {
        return new Pengguna(
            id: $model->id,
            levelPenggunaId: $model->role_id,
            levelSlug: $model->role?->slug,
            levelNama: $model->role?->name,
            namaLengkap: $model->name,
            email: $model->email,
            telepon: null,
            alamat: null,
            fotoProfil: null,
            isAktif: $model->is_aktif,
            emailVerifiedAt: $model->email_verified_at?->toIso8601String(),
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
