<?php

namespace App\Modules\Koordinator\Monitoring\Domain;

/**
 * Entitas modul Monitoring (Koordinator). Field sengaja belum diisi:
 * skema database belum tersedia.
 */
final class Monitoring
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
