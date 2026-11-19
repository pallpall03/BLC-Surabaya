<?php

namespace App\Modules\Koordinator\MasterData\Domain;

use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Support\Carbon;

final class Sesi
{
    private SesiId $id;
    private string $judul;
    private ?string $deskripsi;
    private Carbon $tanggalMulai;
    private Carbon $tanggalAkhir;
    private bool $isAktif;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        SesiId $id,
        string $judul,
        ?string $deskripsi,
        Carbon $tanggalMulai,
        Carbon $tanggalAkhir,
        bool $isAktif,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->judul = $judul;
        $this->deskripsi = $deskripsi;
        $this->tanggalMulai = $tanggalMulai;
        $this->tanggalAkhir = $tanggalAkhir;
        $this->isAktif = $isAktif;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): SesiId { return $this->id; }
    public function getJudul(): string { return $this->judul; }
    public function getDeskripsi(): ?string { return $this->deskripsi; }
    public function getTanggalMulai(): Carbon { return $this->tanggalMulai; }
    public function getTanggalAkhir(): Carbon { return $this->tanggalAkhir; }
    public function isAktif(): bool { return $this->isAktif; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }
}