<?php

namespace App\Modules\Setting\HakAkses\Domain;

/**
 * Entitas modul HakAkses. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class HakAkses
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
