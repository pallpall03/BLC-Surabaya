<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Domain;

use App\Modules\Koordinator\KoordinatorProfile\Domain\ValueObjects\KoordinatorProfileId;
use App\Modules\Koordinator\KoordinatorProfile\Domain\ValueObjects\PenggunaId;
use Illuminate\Support\Carbon;

final class KoordinatorProfile
{
    private KoordinatorProfileId $id;
    private PenggunaId $penggunaId;
    private ?string $kantorKuUserId;
    private array $lokasiBlcIds;
    private ?string $nip;
    private ?string $bidangKeahlian;
    private bool $isAktif;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        KoordinatorProfileId $id,
        PenggunaId $penggunaId,
        ?string $kantorKuUserId,
        array $lokasiBlcIds,
        ?string $nip,
        ?string $bidangKeahlian,
        bool $isAktif,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->penggunaId = $penggunaId;
        $this->kantorKuUserId = $kantorKuUserId;
        $this->lokasiBlcIds = $lokasiBlcIds;
        $this->nip = $nip;
        $this->bidangKeahlian = $bidangKeahlian;
        $this->isAktif = $isAktif;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): KoordinatorProfileId { return $this->id; }
    public function getPenggunaId(): PenggunaId { return $this->penggunaId; }
    public function getKantorKuUserId(): ?string { return $this->kantorKuUserId; }
    public function getLokasiBlcIds(): array { return $this->lokasiBlcIds; }
    public function getNip(): ?string { return $this->nip; }
    public function getBidangKeahlian(): ?string { return $this->bidangKeahlian; }
    public function isAktif(): bool { return $this->isAktif; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }

    public function activate(): void { $this->isAktif = true; }
    public function deactivate(): void { $this->isAktif = false; }
    public function addLokasiBlcId(string $lokasiBlcId): void
    {
        if (!in_array($lokasiBlcId, $this->lokasiBlcIds, true)) {
            $this->lokasiBlcIds[] = $lokasiBlcId;
        }
    }
    public function removeLokasiBlcId(string $lokasiBlcId): void
    {
        $this->lokasiBlcIds = array_values(array_filter($this->lokasiBlcIds, fn($id) => $id !== $lokasiBlcId));
    }
}