<?php

namespace App\Modules\Admin\Data\Piagam\Infrastructure;

use App\Modules\Admin\Data\Piagam\Contracts\PiagamRepository;
use App\Modules\Admin\Data\Piagam\Domain\Piagam;
use App\Models\Piagam as PiagamModel;

/** Implementasi Repository untuk Piagam menggunakan Eloquent. */
final class EloquentPiagamRepository implements PiagamRepository
{
    public function all(): array
    {
        return PiagamModel::aktif()->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = PiagamModel::aktif()->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = PiagamModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = PiagamModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        PiagamModel::findOrFail($id)->delete();
    }

    public function getAktif(): array
    {
        return PiagamModel::aktif()->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    private function toDomain(PiagamModel $model): Piagam
    {
        return new Piagam(
            id: $model->id,
            judul: $model->judul,
            slug: $model->slug,
            deskripsi: $model->deskripsi,
            templateFile: $model->template_file,
            urutan: $model->urutan ?? 0,
            isAktif: $model->is_aktif ?? true,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
