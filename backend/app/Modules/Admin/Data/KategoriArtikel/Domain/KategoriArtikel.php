<?php

namespace App\Modules\Admin\Data\KategoriArtikel\Domain;

/**
 * Entitas modul KategoriArtikel. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class KategoriArtikel
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $jenisKategori = null,
        public readonly string $namaKelompok = '',
        public readonly int $urutan = 0,
        public readonly bool $isDelete = false,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
