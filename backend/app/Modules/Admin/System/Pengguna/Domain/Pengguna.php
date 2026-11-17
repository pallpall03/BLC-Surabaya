<?php

namespace App\Modules\Admin\System\Pengguna\Domain;

/**
 * Entitas modul Pengguna. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class Pengguna
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
