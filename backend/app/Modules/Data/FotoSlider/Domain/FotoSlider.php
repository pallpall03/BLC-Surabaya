<?php

namespace App\Modules\Data\FotoSlider\Domain;

/**
 * Entitas modul FotoSlider. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class FotoSlider
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
