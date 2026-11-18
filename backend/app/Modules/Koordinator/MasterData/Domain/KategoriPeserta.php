<?php

namespace App\Modules\Koordinator\MasterData\Domain;

use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Support\Carbon;

final class KategoriPeserta
{
    private KategoriPesertaId $id;
    private string $nama;
    private ?string $deskripsi;
    private bool $isAktif;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        KategoriPesertaId $id,
        string $nama,
        ?string $deskripsi,
        bool $isAktif,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->nama = $nama;
        $this->deskripsi = $deskripsi;
        $this->isAktif = $isAktif;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): KategoriPesertaId { return $this->id; }
    public function getNama(): string { return $this->nama; }
    public function getDeskripsi(): ?string { return $this->deskripsi; }
    public function isAktif(): bool { return $this->isAktif; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }
}