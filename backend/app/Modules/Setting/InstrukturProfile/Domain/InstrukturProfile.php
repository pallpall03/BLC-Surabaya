<?php

namespace App\Modules\Setting\InstrukturProfile\Domain;

/**
 * Entitas Profil Instruktur (extends Pengguna).
 * Data spesifik instruktur: NIP/NIK, BLC asal, keahlian, jabatan.
 * Login via "KantorKu" (SSO), akses lokasi BLC masing-masing.
 */
final class InstrukturProfile
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly int $penggunaId, // FK ke Pengguna (role instruktur)
        public readonly ?string $nip = null,
        public readonly ?string $nik = null,
        public readonly int $lokasiBlcId, // BLC tempat instruktur bertugas
        public readonly ?string $jabatan = null, // Instruktur Utama, Instruktur Pendamping, dll
        public readonly ?string $bidangKeahlian = null,
        public readonly ?string $pendidikanTerakhir = null,
        public readonly ?string $noSertifikat = null,
        public readonly ?\DateTimeInterface $tglBergabung = null,
        public readonly string $status = 'aktif', // aktif, cuti, nonaktif, pensiun
        public readonly ?string $kantorKuUserId = null, // ID dari SSO KantorKu
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}