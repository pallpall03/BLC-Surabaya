<?php

namespace App\Modules\Koordinator\MasterData\Domain;

use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Support\Carbon;

final class Soal
{
    private SoalId $id;
    private string $judul;
    private ?string $deskripsi;
    private string $tipeSoal; // pilihan_ganda, esai, esai_kode
    private bool $isAktif;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        SoalId $id,
        string $judul,
        ?string $deskripsi,
        string $tipeSoal,
        bool $isAktif,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->judul = $judul;
        $this->deskripsi = $deskripsi;
        $this->tipeSoal = $tipeSoal;
        $this->isAktif = $isAktif;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): SoalId { return $this->id; }
    public function getJudul(): string { return $this->judul; }
    public function getDeskripsi(): ?string { return $this->deskripsi; }
    public function getTipeSoal(): string { return $this->tipeSoal; }
    public function isAktif(): bool { return $this->isAktif; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }
}