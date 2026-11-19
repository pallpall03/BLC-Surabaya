<?php

namespace App\Modules\Admin\Konten\Domain;

/**
 * Entitas modul Konten (replaces KontenUtama + SubKonten).
 * Menggunakan parent_id untuk hierarchy (self-referencing).
 */
final class Konten
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $parentId = null,
        public readonly string $judul = '',
        public readonly ?string $slug = null,
        public readonly ?string $konten = null,
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