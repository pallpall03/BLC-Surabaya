<?php

namespace App\Modules\Admin\Data\Artikel\Domain;

/**
 * Entitas Artikel Foto.
 */
final class ArtikelFoto
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly int $artikelId,
        public readonly string $foto,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}