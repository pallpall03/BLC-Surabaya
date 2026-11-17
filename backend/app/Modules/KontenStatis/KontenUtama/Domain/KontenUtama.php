<?php

namespace App\Modules\KontenStatis\KontenUtama\Domain;

/**
 * Entitas modul KontenUtama. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class KontenUtama
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
