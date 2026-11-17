<?php

namespace App\Modules\Admin\System\Menu\Domain;

/**
 * Entitas modul Menu. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class Menu
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
