<?php

namespace App\Modules\Admin\Data\BukuTamu\Infrastructure;

use App\Modules\Admin\Data\BukuTamu\Contracts\BukuTamuRepository;
use App\Modules\Admin\Data\BukuTamu\Domain\BukuTamu;

final class EloquentBukuTamuRepository implements BukuTamuRepository
{
    public function all(): array
    {
        return BukuTamuModel::ordered()->get()->map(fn ($m) => $m->toDomain())->all();
    }

    public function find(int $id): ?BukuTamu
    {
        $model = BukuTamuModel::find($id);
        return $model ? $model->toDomain() : null;
    }

    public function create(array $data): BukuTamu
    {
        $model = BukuTamuModel::create($data);
        return $model->toDomain();
    }

    public function update(int $id, array $data): BukuTamu
    {
        $model = BukuTamuModel::findOrFail($id);
        $model->update($data);
        return $model->toDomain();
    }

    public function delete(int $id): void
    {
        BukuTamuModel::findOrFail($id)->delete();
    }

    public function getAktif(): array
    {
        return BukuTamuModel::aktif()->ordered()->get()->map(fn ($m) => $m->toDomain())->all();
    }

    public function getByUrutan(): array
    {
        return BukuTamuModel::ordered()->get()->map(fn ($m) => $m->toDomain())->all();
    }
}