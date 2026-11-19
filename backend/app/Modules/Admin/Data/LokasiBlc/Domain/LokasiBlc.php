<?php

namespace App\Modules\Admin\Data\LokasiBlc\Domain;

/**
 * Entitas modul LokasiBlc. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class LokasiBlc
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly string $namaBlc = '',
        public readonly ?string $alamat = null,
        public readonly ?string $fotoBlc = null,
        public readonly ?string $foto2Blc = null,
        public readonly bool $isDelete = false,
        public readonly ?int $radius = null,
        public readonly ?string $latitude = null,
        public readonly ?string $longitude = null,
        public readonly ?string $fotoAbsenIns = null,
        public readonly ?int $verFotoAbsenIns = null,
        public readonly ?string $area = null,
        public readonly bool $aktif = false,
        public readonly bool $isKorwil = false,
        public readonly bool $isTeknisiAhli = false,
        public readonly bool $isTeknisi = false,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
