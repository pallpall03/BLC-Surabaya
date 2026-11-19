<?php

namespace App\Modules\Admin\Data\Modul\Infrastructure;

use App\Modules\Admin\Data\Modul\Contracts\ModulRepository;
use App\Modules\Admin\Data\Modul\Domain\Modul;
use App\Models\Modul as ModulModel;

/** Implementasi Repository untuk Modul menggunakan Eloquent. */
final class EloquentModulRepository implements ModulRepository
{
    public function all(): array
    {
        return ModulModel::aktif()->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = ModulModel::aktif()->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = ModulModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = ModulModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        ModulModel::findOrFail($id)->delete();
    }

    public function getAktif(): array
    {
        return ModulModel::aktif()->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    private function toDomain(ModulModel $model): Modul
    {
        return new Modul(
            id: $model->id,
            nama: $model->nama,
            slug: $model->slug,
            deskripsi: $model->deskripsi,
            urutan: $model->urutan ?? 0,
            isAktif: $model->is_aktif ?? true,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
