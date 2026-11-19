<?php

namespace App\Modules\Koordinator\MasterData\Domain;

use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Support\Carbon;

final class Modul
{
    private ModulId $id;
    private string $judul;
    private ?string $deskripsi;
    private string $tipe; // materi, soal
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        ModulId $id,
        string $judul,
        ?string $deskripsi,
        string $tipe,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->judul = $judul;
        $this->deskripsi = $deskripsi;
        $this->tipe = $tipe;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): ModulId { return $this->id; }
    public function getJudul(): string { return $this->judul; }
    public function getDeskripsi(): ?string { return $this->deskripsi; }
    public function getTipe(): string { return $this->tipe; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }
}