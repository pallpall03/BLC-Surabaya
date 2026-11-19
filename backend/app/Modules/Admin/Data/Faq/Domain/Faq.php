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
        public readonly string $pertanyaan = '',
        public readonly string $jawaban = '',
        public readonly ?int $kategoriId = null,
        public readonly int $urutan = 0,
        public readonly bool $isAktif = true,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
