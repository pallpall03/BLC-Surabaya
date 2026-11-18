<?php

namespace App\Modules\Koordinator\Pengguna\Domain;

use App\Modules\Koordinator\Pengguna\Domain\ValueObjects\PenggunaId;
use Carbon\Carbon;

class Pengguna
{
    private PenggunaId $id;
    private string $username;
    private string $email;
    private string $passwordHash;
    private string $namaLengkap;
    private Carbon $tanggalMasuk;
    private Carbon $lastLoginAt;
    private string $peran;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        PenggunaId $id,
        string $username,
        string $email,
        string $passwordHash,
        string $namaLengkap,
        Carbon $tanggalMasuk,
        Carbon $lastLoginAt,
        string $peran,
        ?Carbon $createdAt = null,
        ?Carbon $updatedAt = null
    ) {
        $this->id = $id;
        $this->username = $username;
        $this->email = $email;
        $this->passwordHash = $passwordHash;
        $this->namaLengkap = $namaLengkap;
        $this->tanggalMasuk = $tanggalMasuk;
        $this->lastLoginAt = $lastLoginAt;
        $this->peran = $peran;
        $this->createdAt = $createdAt ?? Carbon::now();
        $this->updatedAt = $updatedAt ?? Carbon::now();
    }

    public function getId(): PenggunaId { return $this->id; }
    public function getUsername(): string { return $this->username; }
    public function getEmail(): string { return $this->email; }
    public function getPasswordHash(): string { return $this->passwordHash; }
    public function getNamaLengkap(): string { return $this->namaLengkap; }
    public function getTanggalMasuk(): Carbon { return $this->tanggalMasuk; }
    public function getLastLoginAt(): Carbon { return $this->lastLoginAt; }
    public function getPeran(): string { return $this->peran; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }

    public function setPasswordHash(string $passwordHash): void
    {
        $this->passwordHash = $passwordHash;
        $this->updatedAt = Carbon::now();
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id->value(),
            'username' => $this->username,
            'email' => $this->email,
            'password_hash' => $this->passwordHash,
            'nama_lengkap' => $this->namaLengkap,
            'tanggal_masuk' => $this->tanggalMasuk->toISOString(),
            'last_login_at' => $this->lastLoginAt->toISOString(),
            'peran' => $this->peran,
            'created_at' => $this->createdAt->toISOString(),
            'updated_at' => $this->updatedAt->toISOString(),
        ];
    }
}