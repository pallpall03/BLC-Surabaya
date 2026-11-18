<?php

namespace App\Modules\Koordinator\Laporan\Domain;

/**
 * Entitas modul Laporan Seluruh Kegiatan BLC (Koordinator). Field sengaja belum diisi:
 * skema database belum tersedia.
 */
final class Laporan
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
