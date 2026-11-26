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
        public readonly ?string $latitude = null,
        public readonly ?string $longitude = null,
        public readonly ?string $area = null,
        public readonly bool $aktif = true,
        public readonly ?int $jumlahSlotComputer = null,
        public readonly ?string $jadwalBlc = null,
        public readonly ?string $wilayahSurabaya = null,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
