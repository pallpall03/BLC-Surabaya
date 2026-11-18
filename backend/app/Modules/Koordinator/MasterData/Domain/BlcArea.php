<?php

namespace App\Modules\Koordinator\MasterData\Domain;

use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Support\Carbon;

final class BlcArea
{
    private BlcAreaId $id;
    private string $nama;
    private ?string $alamat;
    private ?string $koordinatorId;
    private bool $isAktif;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        BlcAreaId $id,
        string $nama,
        ?string $alamat,
        ?string $koordinatorId,
        bool $isAktif,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->nama = $nama;
        $this->alamat = $alamat;
        $this->koordinatorId = $koordinatorId;
        $this->isAktif = $isAktif;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): BlcAreaId { return $this->id; }
    public function getNama(): string { return $this->nama; }
    public function getAlamat(): ?string { return $this->alamat; }
    public function getKoordinatorId(): ?string { return $this->koordinatorId; }
    public function isAktif(): bool { return $this->isAktif; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }
}