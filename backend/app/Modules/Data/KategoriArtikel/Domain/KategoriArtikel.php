<?php

namespace App\Modules\Data\KategoriArtikel\Domain;

/**
 * Entitas modul KategoriArtikel. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class KategoriArtikel
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
