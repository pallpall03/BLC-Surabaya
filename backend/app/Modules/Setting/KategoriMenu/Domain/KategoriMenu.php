<?php

namespace App\Modules\Setting\KategoriMenu\Domain;

/**
 * Entitas modul KategoriMenu. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class KategoriMenu
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
