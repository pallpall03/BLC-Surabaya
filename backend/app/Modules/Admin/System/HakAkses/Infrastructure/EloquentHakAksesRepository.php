<?php

namespace App\Modules\Admin\System\HakAkses\Infrastructure;

use App\Modules\Admin\System\HakAkses\Contracts\HakAksesRepository;
use App\Modules\Admin\System\HakAkses\Domain\HakAkses;
use App\Modules\Admin\System\HakAkses\Infrastructure\HakAksesModel;
use App\Modules\Admin\System\LevelPengguna\Infrastructure\LevelPenggunaModel;

/**
 * Implementasi Repository untuk Hak Akses menggunakan Eloquent.
 */
final class EloquentHakAksesRepository implements HakAksesRepository
{
    public function all(): array
    {
        return HakAksesModel::with('levelPengguna')->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = HakAksesModel::with('levelPengguna')->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByLevelAndModulAksi(int $levelPenggunaId, string $modul, string $aksi): mixed
    {
        $model = HakAksesModel::where('level_pengguna_id', $levelPenggunaId)
            ->where(function ($q) use ($modul) {
                $q->where('modul', $modul)->orWhere('modul', '*');
            })
            ->where(function ($q) use ($aksi) {
                $q->where('aksi', $aksi)->orWhere('aksi', '*');
            })
            ->first();

        return $model ? $this->toDomain($model) : null;
    }

    public function getByLevel(int $levelPenggunaId): array
    {
        return HakAksesModel::where('level_pengguna_id', $levelPenggunaId)
            ->get()
            ->map(fn ($m) => $this->toDomain($m))
            ->all();
    }

    public function create(array $data): mixed
    {
        $model = HakAksesModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = HakAksesModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        HakAksesModel::findOrFail($id)->delete();
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(HakAksesModel $model): HakAkses
    {
        return new HakAkses(
            id: $model->id,
            levelPenggunaId: $model->level_pengguna_id,
            modul: $model->modul,
            aksi: $model->aksi,
            diizinkan: $model->diizinkan,
            levelPengguna: $model->levelPengguna ? new \App\Modules\Admin\System\LevelPengguna\Domain\LevelPengguna(
                id: $model->levelPengguna->id,
                nama: $model->levelPengguna->nama,
                slug: $model->levelPengguna->slug,
                deskripsi: $model->levelPengguna->deskripsi,
                urutan: $model->levelPengguna->urutan,
                isAktif: $model->levelPengguna->is_aktif,
            ) : null,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
