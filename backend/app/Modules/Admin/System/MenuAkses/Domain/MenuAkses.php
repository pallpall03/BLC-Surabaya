<?php

namespace App\Modules\Admin\System\MenuAkses\Domain;

/**
 * Entitas modul MenuAkses (RBAC matrix: role × menu × 4 actions).
 */
final class MenuAkses
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly int $roleId,
        public readonly int $menuId,
        public readonly bool $bisaLihat = true,
        public readonly bool $bisaTambah = false,
        public readonly bool $bisaEdit = false,
        public readonly bool $bisaHapus = false,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}