<?php

namespace App\Modules\Instruktur\DaftarPeserta\Domain;

/**
 * Entitas modul Daftar Peserta (Instruktur). Field sengaja belum diisi:
 * skema database belum tersedia.
 */
final class DaftarPeserta
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
