<?php

namespace App\Modules\Admin\System\MenuAkses\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\System\MenuAkses\Domain\MenuAkses;

/**
 * @extends Repository<MenuAkses>
 */
interface MenuAksesRepository extends Repository
{
    public function getByRole(int $roleId): array;
    public function getByMenu(int $menuId): array;
    public function getByRoleAndMenu(int $roleId, int $menuId): ?MenuAkses;
    public function syncForRole(int $roleId, array $menuAkses): void; // menuId => [bisa_lihat, bisa_tambah, bisa_edit, bisa_hapus]
}