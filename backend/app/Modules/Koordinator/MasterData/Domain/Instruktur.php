<?php

namespace App\Modules\Koordinator\MasterData\Domain;

use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Support\Carbon;

final class Instruktur
{
    private InstrukturId $id;
    private string $namaLengkap;
    private string $username;
    private string $jenisKelamin; // L, P
    private ?string $lokasiBlcId;
    private ?string $kantorKuUserId;
    private ?string $email;
    private ?string $telepon;
    private ?string $alamat;
    private bool $isAktif;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        InstrukturId $id,
        string $namaLengkap,
        string $username,
        string $jenisKelamin,
        ?string $lokasiBlcId,
        ?string $kantorKuUserId,
        ?string $email,
        ?string $telepon,
        ?string $alamat,
        bool $isAktif,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->namaLengkap = $namaLengkap;
        $this->username = $username;
        $this->jenisKelamin = $jenisKelamin;
        $this->lokasiBlcId = $lokasiBlcId;
        $this->kantorKuUserId = $kantorKuUserId;
        $this->email = $email;
        $this->telepon = $telepon;
        $this->alamat = $alamat;
        $this->isAktif = $isAktif;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): InstrukturId { return $this->id; }
    public function getNamaLengkap(): string { return $this->namaLengkap; }
    public function getUsername(): string { return $this->username; }
    public function getJenisKelamin(): string { return $this->jenisKelamin; }
    public function getLokasiBlcId(): ?string { return $this->lokasiBlcId; }
    public function getKantorKuUserId(): ?string { return $this->kantorKuUserId; }
    public function getEmail(): ?string { return $this->email; }
    public function getTelepon(): ?string { return $this->telepon; }
    public function getAlamat(): ?string { return $this->alamat; }
    public function isAktif(): bool { return $this->isAktif; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }
}