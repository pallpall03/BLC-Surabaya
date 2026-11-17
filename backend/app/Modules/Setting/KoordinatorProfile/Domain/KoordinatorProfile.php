<?php

namespace App\Modules\Setting\KoordinatorProfile\Domain;

/**
 * Entitas Profil Koordinator (extends Pengguna).
 * Data spesifik koordinator: NIP/NIK, cakupan area (multi BLC), jabatan.
 * Akses: monitoring, report seluruh kegiatan BLC di area tanggung jawab.
 */
final class KoordinatorProfile
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly int $penggunaId, // FK ke Pengguna (role koordinator)
        public readonly ?string $nip = null,
        public readonly ?string $nik = null,
        public readonly array $lokasiBlcIds = [], // Multi BLC yang dikoordinasi
        public readonly ?string $jabatan = null, // Koordinator Wilayah, Koordinator Bidang, dll
        public readonly ?string $bidangKoordinasi = null,
        public readonly ?\DateTimeInterface $tglBergabung = null,
        public readonly string $status = 'aktif', // aktif, cuti, nonaktif, pensiun
        public readonly ?string $kantorKuUserId = null, // ID dari SSO KantorKu
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}