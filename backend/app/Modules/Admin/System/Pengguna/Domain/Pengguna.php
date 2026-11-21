<?php

namespace App\Modules\Admin\System\Pengguna\Domain;

/**
 * Entitas Pengguna (User).
 */
final class Pengguna
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $levelPenggunaId = null,
        public readonly ?string $levelSlug = null,
        public readonly ?string $levelNama = null,
        public readonly ?string $namaLengkap = null,
        public readonly string $email = '',
        public readonly ?string $telepon = null,
        public readonly ?string $alamat = null,
        public readonly ?string $fotoProfil = null,
        public readonly bool $isAktif = true,
        public readonly ?string $emailVerifiedAt = null,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}

    public function getInitials(): string
    {
        $words = explode(' ', trim($this->namaLengkap ?? $this->email ?? ''));
        $initials = '';
        foreach ($words as $word) {
            if ($word) {
                $initials .= mb_strtoupper($word[0]);
            }
        }
        return $initials ?: '?';
    }

    public function getDisplayName(): string
    {
        return $this->namaLengkap ?? $this->email ?? '-';
    }
}