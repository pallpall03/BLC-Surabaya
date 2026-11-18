<?php

namespace App\Modules\Instruktur\DaftarHadir\Domain;

/**
 * Entitas modul Daftar Hadir (Instruktur). Field sengaja belum diisi:
 * skema database belum tersedia.
 */
final class DaftarHadir
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
