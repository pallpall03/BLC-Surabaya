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
        public readonly ?string $alamat = null,
        public readonly ?string $phone = null,
        public readonly ?string $gender = null,
        public readonly ?string $email = null,
        public readonly ?int $kategoriId = null,
        public readonly ?string $keperluan = null,
        public readonly ?int $lokasiBlcId = null,
        public readonly ?int $materiId = null,
        public readonly bool $isSurabaya = false,
        public readonly ?string $tanggalLahir = null,
        public readonly ?string $kecamatan = null,
        public readonly ?string $kelurahan = null,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
