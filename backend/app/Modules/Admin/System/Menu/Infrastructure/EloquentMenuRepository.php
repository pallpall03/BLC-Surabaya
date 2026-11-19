<?php

namespace App\Modules\Admin\System\Menu\Infrastructure;

use App\Modules\Admin\System\Menu\Contracts\MenuRepository;
use App\Modules\Admin\System\Menu\Domain\Menu;
use App\Models\Menu as MenuModel;

/**
 * Implementasi Repository untuk Menu menggunakan Eloquent.
 */
final class EloquentMenuRepository implements MenuRepository
{
    public function all(): array
    {
        return MenuModel::with('children')->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = MenuModel::with('children')->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = MenuModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = MenuModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        MenuModel::findOrFail($id)->delete();
    }

    public function getByParent(?int $parentId): array
    {
        return MenuModel::where('parent_id', $parentId)->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getAktif(): array
    {
        return MenuModel::aktif()->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getOrdered(): array
    {
        return MenuModel::ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getTree(): array
    {
        $parents = MenuModel::whereNull('parent_id')->aktif()->ordered()->with('children')->get();
        return $parents->map(fn ($m) => $this->toDomainWithChildren($m))->all();
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(MenuModel $model): Menu
    {
        return new Menu(
            id: $model->id,
            parentId: $model->parent_id,
            nama: $model->nama,
            slug: $model->slug,
            url: $model->url,
            ikon: $model->ikon,
            urutan: $model->urutan,
            isAktif: $model->is_aktif,
            isDelete: $model->is_delete,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }

    private function toDomainWithChildren(MenuModel $model): Menu
    {
        $domain = $this->toDomain($model);
        if ($model->children->isNotEmpty()) {
            // Note: Domain entity is readonly, so we can't add children dynamically
            // This would need a different approach (DTO or array for tree)
        }
        return $domain;
    }
}
