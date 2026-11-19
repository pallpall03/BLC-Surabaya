<?php

namespace App\Modules\Koordinator\MasterData\Domain;

use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Support\Carbon;

final class InstrukturArea
{
    private InstrukturAreaId $id;
    private string $namaArea;
    private string $instrukturId;
    private string $lokasiBlcId;
    private string $lokasiBlcNama;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        InstrukturAreaId $id,
        string $namaArea,
        string $instrukturId,
        string $lokasiBlcId,
        string $lokasiBlcNama,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->namaArea = $namaArea;
        $this->instrukturId = $instrukturId;
        $this->lokasiBlcId = $lokasiBlcId;
        $this->lokasiBlcNama = $lokasiBlcNama;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): InstrukturAreaId { return $this->id; }
    public function getNamaArea(): string { return $this->namaArea; }
    public function getInstrukturId(): string { return $this->instrukturId; }
    public function getLokasiBlcId(): string { return $this->lokasiBlcId; }
    public function getLokasiBlcNama(): string { return $this->lokasiBlcNama; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }
}