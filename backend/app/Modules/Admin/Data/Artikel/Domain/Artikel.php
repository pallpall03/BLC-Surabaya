<?php

namespace App\Modules\Admin\Data\Artikel\Domain;

/**
 * Entitas modul Artikel. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class Artikel
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
