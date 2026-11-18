<?php

namespace App\Modules\Participant\Modul\Domain;

/**
 * Entitas Modul (Portal Peserta). Field sengaja kosong.
 */
final class Modul
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
