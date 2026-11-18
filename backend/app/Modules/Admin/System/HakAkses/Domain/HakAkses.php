<?php

namespace App\Modules\Admin\System\HakAkses\Domain;

use App\Modules\Admin\System\LevelPengguna\Domain\LevelPengguna;

/**
 * Entitas Hak Akses (Permission).
 * Merepresentasikan izin akses per modul dan aksi untuk setiap level pengguna.
 */
final class HakAkses
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly int $levelPenggunaId = 0,
        public readonly string $modul = '',
        public readonly string $aksi = '',
        public readonly bool $diizinkan = true,
        public readonly ?LevelPengguna $levelPengguna = null,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}

    /**
     * Cek apakah ini wildcard permission (super admin)
     */
    public function isWildcard(): bool
    {
        return $this->modul === '*' && $this->aksi === '*';
    }

    /**
     * Cek apakah permission ini untuk modul tertentu
     */
    public function isForModul(string $modul): bool
    {
        return $this->modul === $modul || $this->modul === '*';
    }

    /**
     * Cek apakah permission ini untuk aksi tertentu
     */
    public function isForAksi(string $aksi): bool
    {
        return $this->aksi === $aksi || $this->aksi === '*';
    }

    /**
     * Generate key untuk caching/lookup
     */
    public function getKey(): string
    {
        return "{$this->modul}.{$this->aksi}";
    }
}