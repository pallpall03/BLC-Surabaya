<?php

namespace App\Modules\Participant\Ujian\Domain;

/**
 * Entitas Ujian (Portal Peserta). Field sengaja kosong.
 */
final class Ujian
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
