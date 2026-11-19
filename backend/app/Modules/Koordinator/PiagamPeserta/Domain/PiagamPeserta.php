<?php

namespace App\Modules\Koordinator\PiagamPeserta\Domain;

use App\Modules\Koordinator\PiagamPeserta\Domain\ValueObjects\PiagamPesertaId;
use Carbon\Carbon;

class PiagamPeserta
{
    private PiagamPesertaId $id;
    private string $pesertaId;
    private string $sesiId;
    private string $judul;
    private string $deskripsi;
    private string $filePath;
    private string $status;
    private Carbon $tanggalTerbit;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        PiagamPesertaId $id,
        string $pesertaId,
        string $sesiId,
        string $judul,
        string $deskripsi,
        string $filePath,
        string $status = 'draft',
        ?Carbon $tanggalTerbit = null
    ) {
        $this->id = $id;
        $this->pesertaId = $pesertaId;
        $this->sesiId = $sesiId;
        $this->judul = $judul;
        $this->deskripsi = $deskripsi;
        $this->filePath = $filePath;
        $this->status = $status;
        $this->tanggalTerbit = $tanggalTerbit ?? Carbon::now();
        $this->createdAt = Carbon::now();
        $this->updatedAt = Carbon::now();
    }

    public function getId(): PiagamPesertaId { return $this->id; }
    public function getPesertaId(): string { return $this->pesertaId; }
    public function getSesiId(): string { return $this->sesiId; }
    public function getJudul(): string { return $this->judul; }
    public function getDeskripsi(): string { return $this->deskripsi; }
    public function getFilePath(): string { return $this->filePath; }
    public function getStatus(): string { return $this->status; }
    public function getTanggalTerbit(): Carbon { return $this->tanggalTerbit; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }

    public function publish(): void
    {
        $this->status = 'terbit';
        $this->tanggalTerbit = Carbon::now();
        $this->updatedAt = Carbon::now();
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
        $this->updatedAt = Carbon::now();
    }

    public function updateData(string $judul, string $deskripsi, string $filePath): void
    {
        $this->judul = $judul;
        $this->deskripsi = $deskripsi;
        $this->filePath = $filePath;
        $this->updatedAt = Carbon::now();
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id->value(),
            'peserta_id' => $this->pesertaId,
            'sesi_id' => $this->sesiId,
            'judul' => $this->judul,
            'deskripsi' => $this->deskripsi,
            'file_path' => $this->filePath,
            'status' => $this->status,
            'tanggal_terbit' => $this->tanggalTerbit->toISOString(),
            'created_at' => $this->createdAt->toISOString(),
            'updated_at' => $this->updatedAt->toISOString(),
        ];
    }
}