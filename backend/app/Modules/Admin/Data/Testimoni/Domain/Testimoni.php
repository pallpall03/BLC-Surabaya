<?php

namespace App\Modules\Admin\Data\Testimoni\Domain;

/**
 * Entitas Testimoni. Mengikuti skema setelah migration
 * 2026_11_24_235900_restructure_testimoni_table:
 * data kunjungan (alamat, gender, dst) sudah dibuang, diganti isi_testimoni + rating.
 * status: pending | tampil | ditolak
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
        public readonly ?string $isiTestimoni = null,
        public readonly ?int $rating = null,
        public readonly string $status = 'pending',
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}