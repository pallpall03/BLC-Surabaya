<?php

namespace App\Modules\Admin\Data\Faq\Domain;

/**
 * Entitas modul Faq. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class Faq
{
    public function __construct(
        public readonly ?int $id = null,
    ) {
    }
}
