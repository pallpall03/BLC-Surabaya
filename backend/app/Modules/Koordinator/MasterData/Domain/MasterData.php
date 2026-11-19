<?php

namespace App\Modules\Koordinator\MasterData\Domain;

use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Support\Carbon;

final class MasterData
{
    private MasterDataId $id;
    private string $namaModul; // instruktur, instruktur_area, blc_area, materi, materi_per_pertemuan, kategori_peserta, sesi, soal, modul
    private string $namaTampil;
    private ?string $deskripsi;
    private bool $isAktif;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        MasterDataId $id,
        string $namaModul,
        string $namaTampil,
        ?string $deskripsi,
        bool $isAktif,
        Carbon $createdAt,
        Carbon $updatedAt
    ) {
        $this->id = $id;
        $this->namaModul = $namaModul;
        $this->namaTampil = $namaTampil;
        $this->deskripsi = $deskripsi;
        $this->isAktif = $isAktif;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): MasterDataId { return $this->id; }
    public function getNamaModul(): string { return $this->namaModul; }
    public function getNamaTampil(): string { return $this->namaTampil; }
    public function getDeskripsi(): ?string { return $this->deskripsi; }
    public function isAktif(): bool { return $this->isAktif; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }

    public function activate(): void { $this->isAktif = true; }
    public function deactivate(): void { $this->isAktif = false; }
}