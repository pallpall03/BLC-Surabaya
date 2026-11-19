<?php

namespace App\Modules\Admin\Data\Ujian\Infrastructure;

use App\Modules\Admin\Data\Ujian\Contracts\UjianRepository;
use App\Modules\Admin\Data\Ujian\Domain\Ujian;
use App\Models\Ujian as UjianModel;

/** Implementasi Repository untuk Ujian menggunakan Eloquent. */
final class EloquentUjianRepository implements UjianRepository
{
    public function all(): array
    {
        return UjianModel::aktif()->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = UjianModel::aktif()->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = UjianModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = UjianModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        UjianModel::findOrFail($id)->delete();
    }

    public function getAktif(): array
    {
        return UjianModel::aktif()->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    private function toDomain(UjianModel $model): Ujian
    {
        return new Ujian(
            id: $model->id,
            judul: $model->judul,
            slug: $model->slug,
            deskripsi: $model->deskripsi,
            durasiMenit: $model->durasi_menit ?? 60,
            urutan: $model->urutan ?? 0,
            isAktif: $model->is_aktif ?? true,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
