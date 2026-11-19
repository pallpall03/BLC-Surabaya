<?php

namespace App\Modules\Admin\Data\Artikel\Domain;

/**
 * Entitas modul Artikel. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class Artikel
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $kategoriArtikelId = null,
        public readonly string $judul = '',
        public readonly string $keterangan = '',
        public readonly ?string $lokasi = null,
        public readonly ?int $createdBy = null,
        public readonly ?string $sesiId = null,
        public readonly bool $isDelete = false,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
