<?php

namespace App\Modules\Admin\System\LevelPengguna\Domain;

/**
 * Entitas modul LevelPengguna. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class LevelPengguna
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
