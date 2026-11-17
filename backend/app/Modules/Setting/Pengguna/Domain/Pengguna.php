<?php

namespace App\Modules\Setting\Pengguna\Domain;

use App\Modules\Setting\LevelPengguna\Domain\LevelPengguna;

/**
 * Entitas Pengguna (User).
 * Merepresentasikan pengguna sistem BLC dengan role/level tertentu.
 */
final class Pengguna
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $levelPenggunaId = null,
        public readonly string $namaLengkap = '',
        public readonly string $email = '',
        public readonly ?string $telepon = null,
        public readonly ?string $alamat = null,
        public readonly ?string $fotoProfil = null,
        public readonly bool $isAktif = true,
        public readonly ?string $emailVerifiedAt = null,
        public readonly ?LevelPengguna $levelPengguna = null,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
        /**
         * Permissions loaded from HakAkses table.
         * Format: ['modul.aksi' => bool, 'modul.*' => bool]
         * Populated by Application Service after fetching from repository.
         */
        public readonly array $permissions = [],
    ) {}

    /**
     * Cek apakah pengguna memiliki level/role
     */
    public function hasLevel(): bool
    {
        return $this->levelPengguna !== null;
    }

    /**
     * Cek apakah pengguna adalah Super Admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->levelPengguna?->isSuperAdmin() ?? false;
    }

    /**
     * Cek apakah pengguna adalah Admin
     */
    public function isAdmin(): bool
    {
        return $this->levelPengguna?->isAdmin() ?? false;
    }

    /**
     * Cek apakah pengguna adalah Koordinator
     */
    public function isKoordinator(): bool
    {
        return $this->levelPengguna?->isKoordinator() ?? false;
    }

    /**
     * Cek apakah pengguna adalah Instruktur
     */
    public function isInstruktur(): bool
    {
        return $this->levelPengguna?->isInstruktur() ?? false;
    }

    /**
     * Cek apakah pengguna bisa mengelola (admin level)
     */
    public function canManage(): bool
    {
        return $this->levelPengguna?->canManage() ?? false;
    }

    /**
     * Cek apakah pengguna adalah role pelatihan
     */
    public function isPelatihanRole(): bool
    {
        return $this->levelPengguna?->isPelatihanRole() ?? false;
    }

    /**
     * Cek izin akses untuk modul dan aksi tertentu.
     * Memeriksa permissions array yang diisi oleh Application Service.
     * Wildcard '*' didukung untuk modul dan aksi.
     */
    public function can(string $modul, string $aksi): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if (!$this->hasLevel() || empty($this->permissions)) {
            return false;
        }

        // Cek exact match: modul.aksi
        $exactKey = $modul . '.' . $aksi;
        if (isset($this->permissions[$exactKey])) {
            return $this->permissions[$exactKey];
        }

        // Cek wildcard aksi: modul.*
        $modulWildcard = $modul . '.*';
        if (isset($this->permissions[$modulWildcard])) {
            return $this->permissions[$modulWildcard];
        }

        // Cek wildcard full: *.*
        if (isset($this->permissions['*.*'])) {
            return $this->permissions['*.*'];
        }

        return false;
    }

    /**
     * Alias untuk can() - untuk kompatibilitas
     */
    public function hasPermission(string $modul, string $aksi): bool
    {
        return $this->can($modul, $aksi);
    }

    /**
     * Get semua permissions sebagai array
     */
    public function getPermissions(): array
    {
        return $this->permissions;
    }

    /**
     * Get nama singkat untuk display
     */
    public function getInitials(): string
    {
        $words = explode(' ', trim($this->namaLengkap));
        $initials = '';
        foreach ($words as $word) {
            $initials .= mb_strtoupper($word[0]);
        }
        return $initials;
    }
}
