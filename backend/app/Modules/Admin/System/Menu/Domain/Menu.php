<?php

namespace App\Modules\Admin\System\Menu\Domain;

/**
 * Entitas modul Menu. Menggunakan parent_id untuk hierarchy (self-referencing).
 */
final class Menu
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $parentId = null,
        public readonly string $nama = '',
        public readonly string $slug = '',
        public readonly ?string $url = null,
        public readonly ?string $ikon = null,
        public readonly int $urutan = 0,
        public readonly bool $isAktif = true,
        public readonly bool $isDelete = false,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}

    public function isParent(): bool
    {
        return $this->parentId === null;
    }
}
