<?php

namespace App\Modules\Instruktur\Laporan\Domain;

/**
 * Entitas modul Laporan Kegiatan (Instruktur). Field sengaja belum diisi:
 * skema database belum tersedia.
 */
final class Laporan
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
