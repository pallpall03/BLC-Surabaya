<?php

namespace App\Modules\Setting\LevelPengguna\Domain;

/**
 * Entitas Level Pengguna (Role).
 * Merepresentasikan peran/jabatan pengguna dalam sistem BLC.
 * Contoh: Super Admin, Admin, Koordinator, Instruktur
 */
final class LevelPengguna
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly string $nama = '',
        public readonly string $slug = '',
        public readonly ?string $deskripsi = null,
        public readonly int $urutan = 0,
        public readonly bool $isAktif = true,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}

    /**
     * Cek apakah level ini adalah Super Admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->slug === 'super_admin';
    }

    /**
     * Cek apakah level ini adalah Admin
     */
    public function isAdmin(): bool
    {
        return $this->slug === 'admin';
    }

    /**
     * Cek apakah level ini adalah Koordinator
     */
    public function isKoordinator(): bool
    {
        return $this->slug === 'koordinator';
    }

    /**
     * Cek apakah level ini adalah Instruktur
     */
    public function isInstruktur(): bool
    {
        return $this->slug === 'instruktur';
    }

    /**
     * Cek apakah level ini memiliki akses manajemen penuh
     */
    public function canManage(): bool
    {
        return in_array($this->slug, ['super_admin', 'admin']);
    }

    /**
     * Cek apakah level ini adalah role pelatihan (koordinator/instruktur)
     */
    public function isPelatihanRole(): bool
    {
        return in_array($this->slug, ['koordinator', 'instruktur']);
    }

    /**
     * Cek apakah level ini bisa mengelola pengguna
     */
    public function canManageUsers(): bool
    {
        return $this->isSuperAdmin() || $this->isAdmin();
    }

    /**
     * Cek apakah level ini bisa mengelola konten (artikel, buku tamu, dll)
     */
    public function canManageContent(): bool
    {
        return $this->isSuperAdmin() || $this->isAdmin() || $this->isKoordinator();
    }

    /**
     * Cek apakah level ini bisa melihat laporan/dashboard
     */
    public function canViewReports(): bool
    {
        return $this->isSuperAdmin() || $this->isAdmin() || $this->isKoordinator() || $this->isInstruktur();
    }
}