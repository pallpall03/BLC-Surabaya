<?php

namespace App\Modules\Admin\System\LevelPengguna\Infrastructure;

use App\Modules\Admin\System\LevelPengguna\Contracts\LevelPenggunaRepository;
use App\Modules\Admin\System\LevelPengguna\Domain\LevelPengguna;
use App\Modules\Admin\System\LevelPengguna\Infrastructure\LevelPenggunaModel;

/**
 * Implementasi Repository untuk Level Pengguna menggunakan Eloquent.
 */
final class EloquentLevelPenggunaRepository implements LevelPenggunaRepository
{
    public function all(): array
    {
        return LevelPenggunaModel::ordered()->aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = LevelPenggunaModel::with('hakAkses')->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findBySlug(string $slug): mixed
    {
        $model = LevelPenggunaModel::where('slug', $slug)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = LevelPenggunaModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = LevelPenggunaModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        LevelPenggunaModel::findOrFail($id)->delete();
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(LevelPenggunaModel $model): LevelPengguna
    {
        return new LevelPengguna(
            id: $model->id,
            nama: $model->nama,
            slug: $model->slug,
            deskripsi: $model->deskripsi,
            urutan: $model->urutan,
            isAktif: $model->is_aktif,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
