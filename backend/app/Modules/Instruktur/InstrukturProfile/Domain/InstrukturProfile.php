<?php

namespace App\Modules\Instruktur\InstrukturProfile\Domain;

use App\Modules\Instruktur\InstrukturProfile\Domain\ValueObjects\InstrukturProfileId;
use App\Modules\Instruktur\InstrukturProfile\Domain\ValueObjects\PenggunaId;
use App\Modules\Instruktur\InstrukturProfile\Domain\ValueObjects\LokasiBlcId;
use Illuminate\Support\Carbon;

final class InstrukturProfile
{
    private InstrukturProfileId $id;
    private PenggunaId $penggunaId;
    private ?string $kantorKuUserId;
    private ?LokasiBlcId $lokasiBlcId;
    private ?string $nip;
    private ?string $bidangKeahlian;
    private ?string $riwayatPendidikan;
    private ?string $riwayatPelatihan;
    private bool $isAktif;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        InstrukturProfileId $id,
        PenggunaId $penggunaId,
        ?string $kantorKuUserId,
        ?LokasiBlcId $lokasiBlcId,
        ?string $nip,
        ?string $bidangKeahlian,
        ?string $riwayatPendidikan,
        ?string $riwayatPelatihan,
        bool $isAktif,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->penggunaId = $penggunaId;
        $this->kantorKuUserId = $kantorKuUserId;
        $this->lokasiBlcId = $lokasiBlcId;
        $this->nip = $nip;
        $this->bidangKeahlian = $bidangKeahlian;
        $this->riwayatPendidikan = $riwayatPendidikan;
        $this->riwayatPelatihan = $riwayatPelatihan;
        $this->isAktif = $isAktif;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): InstrukturProfileId { return $this->id; }
    public function getPenggunaId(): PenggunaId { return $this->penggunaId; }
    public function getKantorKuUserId(): ?string { return $this->kantorKuUserId; }
    public function getLokasiBlcId(): ?LokasiBlcId { return $this->lokasiBlcId; }
    public function getNip(): ?string { return $this->nip; }
    public function getBidangKeahlian(): ?string { return $this->bidangKeahlian; }
    public function getRiwayatPendidikan(): ?string { return $this->riwayatPendidikan; }
    public function getRiwayatPelatihan(): ?string { return $this->riwayatPelatihan; }
    public function isAktif(): bool { return $this->isAktif; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }

    public function activate(): void { $this->isAktif = true; }
    public function deactivate(): void { $this->isAktif = false; }
}