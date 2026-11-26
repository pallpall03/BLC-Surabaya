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
        public readonly string $nama = '',
        public readonly ?string $phone = null,
        public readonly ?string $email = null,
        public readonly ?int $kategoriId = null,
        public readonly ?int $lokasiBlcId = null,
        public readonly ?string $namaLokasi = null,
        public readonly ?string $isiTestimoni = null,
        public readonly ?int $rating = null,
        public readonly string $status = 'pending',
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null
    ) {}
}
