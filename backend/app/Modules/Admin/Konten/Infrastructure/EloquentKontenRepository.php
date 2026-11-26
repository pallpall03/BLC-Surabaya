<?php

namespace App\Modules\Admin\Konten\Infrastructure;

use App\Modules\Admin\Konten\Contracts\KontenRepository;
use App\Modules\Admin\Konten\Domain\Konten;
use App\Models\Konten as KontenModel;

/**
 * Implementasi Repository untuk Konten menggunakan Eloquent.
 */
final class EloquentKontenRepository implements KontenRepository
{
    public function all(): array
    {
        return KontenModel::with('children')->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = KontenModel::with('children')->aktif()->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = KontenModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = KontenModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        KontenModel::findOrFail($id)->delete();
    }

    public function getByParent(?int $parentId): array
    {
        return KontenModel::where('parent_id', $parentId)->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getAktif(): array
    {
        return KontenModel::aktif()->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getOrdered(): array
    {
        return KontenModel::aktif()->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getTree(): array
    {
        $parents = KontenModel::whereNull('parent_id')->aktif()->ordered()->with('children')->get();
        return $parents->map(fn ($m) => $this->toDomainWithChildren($m))->all();
    }

    public function getBySlug(string $slug): ?Konten
    {
        $model = KontenModel::where('slug', $slug)->aktif()->first();
        return $model ? $this->toDomain($model) : null;
    }

    private function toDomain(KontenModel $model): Konten
    {
        return new Konten(
            id: $model->id,
            parentId: $model->parent_id,
            judul: $model->judul,
            slug: $model->slug,
            konten: $model->konten,
            ikon: $model->ikon,
            urutan: $model->urutan,
            isAktif: $model->is_aktif,
            isDelete: $model->is_delete,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }

    private function toDomainWithChildren(KontenModel $model): Konten
    {
        $domain = $this->toDomain($model);
        // Note: Domain entity is readonly, children not included in entity
        return $domain;
    }
}