<?php

namespace App\Modules\Admin\KontenStatis\SubKonten\Domain;

/**
 * Entitas modul SubKonten. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class SubKonten
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
