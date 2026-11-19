<?php

namespace App\Modules\Admin\System\MenuAkses\Infrastructure;

use App\Modules\Admin\System\MenuAkses\Contracts\MenuAksesRepository;
use App\Modules\Admin\System\MenuAkses\Domain\MenuAkses;
use App\Models\MenuAkses as MenuAksesModel;

/**
 * Implementasi Repository untuk MenuAkses menggunakan Eloquent.
 */
final class EloquentMenuAksesRepository implements MenuAksesRepository
{
    public function all(): array
    {
        return MenuAksesModel::with(['role', 'menu'])->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = MenuAksesModel::with(['role', 'menu'])->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = MenuAksesModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = MenuAksesModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        MenuAksesModel::findOrFail($id)->delete();
    }

    public function getByRole(int $roleId): array
    {
        return MenuAksesModel::with('menu')
            ->where('role_id', $roleId)
            ->get()
            ->map(fn ($m) => $this->toDomain($m))
            ->all();
    }

    public function getByMenu(int $menuId): array
    {
        return MenuAksesModel::with('role')
            ->where('menu_id', $menuId)
            ->get()
            ->map(fn ($m) => $this->toDomain($m))
            ->all();
    }

    public function getByRoleAndMenu(int $roleId, int $menuId): ?MenuAkses
    {
        $model = MenuAksesModel::where('role_id', $roleId)
            ->where('menu_id', $menuId)
            ->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function syncForRole(int $roleId, array $menuAkses): void
    {
        // Delete existing for this role
        MenuAksesModel::where('role_id', $roleId)->delete();

        // Insert new
        foreach ($menuAkses as $menuId => $perms) {
            MenuAksesModel::create([
                'role_id' => $roleId,
                'menu_id' => $menuId,
                'bisa_lihat' => $perms['bisa_lihat'] ?? true,
                'bisa_tambah' => $perms['bisa_tambah'] ?? false,
                'bisa_edit' => $perms['bisa_edit'] ?? false,
                'bisa_hapus' => $perms['bisa_hapus'] ?? false,
            ]);
        }
    }

    private function toDomain(MenuAksesModel $model): MenuAkses
    {
        return new MenuAkses(
            id: $model->id,
            roleId: $model->role_id,
            menuId: $model->menu_id,
            bisaLihat: $model->bisa_lihat,
            bisaTambah: $model->bisa_tambah,
            bisaEdit: $model->bisa_edit,
            bisaHapus: $model->bisa_hapus,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}