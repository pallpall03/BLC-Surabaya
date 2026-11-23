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
        public readonly string $judul = '',
        public readonly ?string $deskripsi = null,
        public readonly ?string $gambar = null,
        public readonly int $urutan = 0,
        public readonly bool $aktif = true,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
