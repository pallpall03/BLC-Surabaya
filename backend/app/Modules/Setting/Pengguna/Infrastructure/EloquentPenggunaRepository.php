<?php

namespace App\Modules\Setting\Pengguna\Infrastructure;

use App\Modules\Setting\Pengguna\Contracts\PenggunaRepository;
use App\Modules\Setting\Pengguna\Domain\Pengguna;
use App\Modules\Setting\Pengguna\Infrastructure\PenggunaModel;
use App\Modules\Setting\LevelPengguna\Infrastructure\LevelPenggunaModel;
use App\Modules\Setting\HakAkses\Contracts\HakAksesRepository;
use Illuminate\Support\Facades\Hash;

/**
 * Implementasi Repository untuk Pengguna menggunakan Eloquent.
 */
final class EloquentPenggunaRepository implements PenggunaRepository
{
    public function __construct(
        private readonly HakAksesRepository $hakAksesRepository
    ) {}

    public function all(): array
    {
        return PenggunaModel::withLevel()->aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = PenggunaModel::withLevel()->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByEmail(string $email): mixed
    {
        $model = PenggunaModel::withLevel()->where('email', $email)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function findByToken(string $token): mixed
    {
        $personalAccessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
        
        if (!$personalAccessToken || !$personalAccessToken->tokenable) {
            return null;
        }

        $model = $personalAccessToken->tokenable;
        $model->load('levelPengguna');
        
        return $this->toDomain($model);
    }

    public function create(array $data): mixed
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $model = PenggunaModel::create($data);
        return $this->toDomain($model->fresh('levelPengguna'));
    }

    public function update(int $id, array $data): mixed
    {
        $model = PenggunaModel::findOrFail($id);
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $model->update($data);
        return $this->toDomain($model->fresh('levelPengguna'));
    }

    public function delete(int $id): void
    {
        PenggunaModel::findOrFail($id)->delete();
    }

    /**
     * Create Personal Access Token untuk user (Sanctum)
     */
    public function createToken(int $userId, string $name, array $abilities = ['*']): string
    {
        $model = PenggunaModel::findOrFail($userId);
        return $model->createToken($name, $abilities)->plainTextToken;
    }

    /**
     * Revoke token
     */
    public function revokeToken(int $userId, string $tokenId): void
    {
        $model = PenggunaModel::findOrFail($userId);
        $model->tokens()->where('id', $tokenId)->delete();
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(PenggunaModel $model): Pengguna
    {
        // Load permissions for this user's level
        $permissions = [];
        if ($model->level_pengguna_id) {
            $hakAksesList = $this->hakAksesRepository->getByLevel($model->level_pengguna_id);
            foreach ($hakAksesList as $hakAkses) {
                if ($hakAkses->diizinkan) {
                    $key = $hakAkses->modul . '.' . $hakAkses->aksi;
                    $permissions[$key] = true;
                }
            }
        }

        return new Pengguna(
            id: $model->id,
            levelPenggunaId: $model->level_pengguna_id,
            namaLengkap: $model->nama_lengkap,
            email: $model->email,
            telepon: $model->telepon,
            alamat: $model->alamat,
            fotoProfil: $model->foto_profil,
            isAktif: $model->is_aktif,
            emailVerifiedAt: $model->email_verified_at?->toIso8601String(),
            levelPengguna: $model->levelPengguna ? new \App\Modules\Setting\LevelPengguna\Domain\LevelPengguna(
                id: $model->levelPengguna->id,
                nama: $model->levelPengguna->nama,
                slug: $model->levelPengguna->slug,
                deskripsi: $model->levelPengguna->deskripsi,
                urutan: $model->levelPengguna->urutan,
                isAktif: $model->levelPengguna->is_aktif,
            ) : null,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
            permissions: $permissions,
        );
    }
}
