<?php

namespace App\Modules\Admin\Data\BukuTamu\Infrastructure;

use App\Modules\Admin\Data\BukuTamu\Contracts\BukuTamuRepository;
use App\Modules\Admin\Data\BukuTamu\Domain\BukuTamu;

final class EloquentBukuTamuRepository implements BukuTamuRepository
{
    private function query(): \Illuminate\Database\Eloquent\Builder
    {
        return BukuTamuModel::query()
            ->notDeleted()
            ->with(['blc', 'sesi']);
    }

    public function all(): array
    {
        return $this->query()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (BukuTamuModel $model) => $model->toDomain())
            ->all();
    }

    public function find(int $id): ?BukuTamu
    {
        $model = $this->query()->find($id);

        return $model?->toDomain();
    }

    public function create(array $data): BukuTamu
    {
        $model = BukuTamuModel::create($data);
        $model->load(['blc', 'sesi']);

        return $model->toDomain();
    }

    public function update(int $id, array $data): BukuTamu
    {
        $model = $this->query()->findOrFail($id);
        $model->updateOrFail($data);
        $model->load(['blc', 'sesi']);

        return $model->toDomain();
    }

    public function delete(int $id): void
    {
        $this->query()->findOrFail($id)->updateOrFail(['is_delete' => true]);
    }

    public function getAktif(): array
    {
        return $this->query()
            ->aktif()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(50)
            ->get()
            ->map(fn (BukuTamuModel $model) => $model->toDomain())
            ->all();
    }

    public function getPublicAktif(): array
    {
        return $this->query()
            ->aktif()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(50)
            ->get()
            ->map(fn (BukuTamuModel $model) => $model->toPublicArray())
            ->all();
    }

    public function getByUrutan(): array
    {
        return $this->query()
            ->ordered()
            ->get()
            ->map(fn (BukuTamuModel $model) => $model->toDomain())
            ->all();
    }
}
