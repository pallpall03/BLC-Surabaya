<?php

namespace App\Modules\Admin\Data\Testimoni\Domain;

/**
 * Entitas modul Testimoni. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class Testimoni
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
