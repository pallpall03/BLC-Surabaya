<?php

namespace App\Modules\Instruktur\Ujian\Domain;

/**
 * Entitas modul Ujian (pretest/posttest) (Instruktur). Field sengaja belum diisi:
 * skema database belum tersedia.
 */
final class Ujian
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
