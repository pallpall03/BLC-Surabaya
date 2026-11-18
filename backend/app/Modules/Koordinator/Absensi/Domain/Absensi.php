<?php

namespace App\Modules\Koordinator\Absensi\Domain;

use App\Modules\Koordinator\Absensi\Domain\ValueObjects\AbsensiId;
use Carbon\Carbon;

class Absensi
{
    private AbsensiId $id;
    private string $pesertaId;
    private string $sesiId;
    private string $instrukturId;
    private string $lokasiBlcId;
    private Carbon $waktuAbsen;
    private string $status;
    private ?string $keterangan;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        AbsensiId $id,
        string $pesertaId,
        string $sesiId,
        string $instrukturId,
        string $lokasiBlcId,
        Carbon $waktuAbsen,
        string $status = 'hadir',
        ?string $keterangan = null
    ) {
        $this->id = $id;
        $this->pesertaId = $pesertaId;
        $this->sesiId = $sesiId;
        $this->instrukturId = $instrukturId;
        $this->lokasiBlcId = $lokasiBlcId;
        $this->waktuAbsen = $waktuAbsen;
        $this->status = $status;
        $this->keterangan = $keterangan;
        $this->createdAt = Carbon::now();
        $this->updatedAt = Carbon::now();
    }

    public function getId(): AbsensiId { return $this->id; }
    public function getPesertaId(): string { return $this->pesertaId; }
    public function getSesiId(): string { return $this->sesiId; }
    public function getInstrukturId(): string { return $this->instrukturId; }
    public function getLokasiBlcId(): string { return $this->lokasiBlcId; }
    public function getWaktuAbsen(): Carbon { return $this->waktuAbsen; }
    public function getStatus(): string { return $this->status; }
    public function getKeterangan(): ?string { return $this->keterangan; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }

    public function setStatus(string $status): void
    {
        $this->status = $status;
        $this->updatedAt = Carbon::now();
    }

    public function setKeterangan(?string $keterangan): void
    {
        $this->keterangan = $keterangan;
        $this->updatedAt = Carbon::now();
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id->value(),
            'peserta_id' => $this->pesertaId,
            'sesi_id' => $this->sesiId,
            'instruktur_id' => $this->instrukturId,
            'lokasi_blc_id' => $this->lokasiBlcId,
            'waktu_absen' => $this->waktuAbsen->toISOString(),
            'status' => $this->status,
            'keterangan' => $this->keterangan,
            'created_at' => $this->createdAt->toISOString(),
            'updated_at' => $this->updatedAt->toISOString(),
        ];
    }
}