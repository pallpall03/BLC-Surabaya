<?php

namespace App\Modules\Admin\Data\FotoSlider\Domain;

/**
 * Entitas modul FotoSlider. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class FotoSlider
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly string $fileBrosur = '',
        public readonly ?string $ketBrosur = null,
        public readonly ?string $tgl = null,
        public readonly ?string $tipe = null,
        public readonly ?string $status = null,
        public readonly int $urutan = 0,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
