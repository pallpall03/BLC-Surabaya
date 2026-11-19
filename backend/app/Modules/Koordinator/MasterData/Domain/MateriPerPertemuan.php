<?php

namespace App\Modules\Koordinator\MasterData\Domain;

use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Support\Carbon;

final class MateriPerPertemuan
{
    private MateriPerPertemuanId $id;
    private string $materiId;
    private int $pertemuanKe;
    private string $judul;
    private ?string $deskripsi;
    private ?string $filePath;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        MateriPerPertemuanId $id,
        string $materiId,
        int $pertemuanKe,
        string $judul,
        ?string $deskripsi,
        ?string $filePath,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->materiId = $materiId;
        $this->pertemuanKe = $pertemuanKe;
        $this->judul = $judul;
        $this->deskripsi = $deskripsi;
        $this->filePath = $filePath;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): MateriPerPertemuanId { return $this->id; }
    public function getMateriId(): string { return $this->materiId; }
    public function getPertemuanKe(): int { return $this->pertemuanKe; }
    public function getJudul(): string { return $this->judul; }
    public function getDeskripsi(): ?string { return $this->deskripsi; }
    public function getFilePath(): ?string { return $this->filePath; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }
}