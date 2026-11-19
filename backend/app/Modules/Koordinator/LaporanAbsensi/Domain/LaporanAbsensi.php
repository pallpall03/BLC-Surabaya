<?php

namespace App\Modules\Koordinator\LaporanAbsensi\Domain;

use App\Modules\Koordinator\LaporanAbsensi\Domain\ValueObjects\LaporanAbsensiId;
use Carbon\Carbon;

class LaporanAbsensi
{
    private LaporanAbsensiId $id;
    private string $sesiId;
    private string $instrukturId;
    private string $lokasiBlcId;
    private string $periodeMulai;
    private string $periodeAkhir;
    private int $totalPeserta;
    private int $totalHadir;
    private int $totalTidakHadir;
    private float $persentaseKehadiran;
    private Carbon $createdAt;
    private Carbon $updatedAt;

    public function __construct(
        LaporanAbsensiId $id,
        string $sesiId,
        string $instrukturId,
        string $lokasiBlcId,
        string $periodeMulai,
        string $periodeAkhir,
        int $totalPeserta,
        int $totalHadir,
        int $totalTidakHadir,
        float $persentaseKehadiran
    ) {
        $this->id = $id;
        $this->sesiId = $sesiId;
        $this->instrukturId = $instrukturId;
        $this->lokasiBlcId = $lokasiBlcId;
        $this->periodeMulai = $periodeMulai;
        $this->periodeAkhir = $periodeAkhir;
        $this->totalPeserta = $totalPeserta;
        $this->totalHadir = $totalHadir;
        $this->totalTidakHadir = $totalTidakHadir;
        $this->persentaseKehadiran = $persentaseKehadiran;
        $this->createdAt = Carbon::now();
        $this->updatedAt = Carbon::now();
    }

    public function getId(): LaporanAbsensiId { return $this->id; }
    public function getSesiId(): string { return $this->sesiId; }
    public function getInstrukturId(): string { return $this->instrukturId; }
    public function getLokasiBlcId(): string { return $this->lokasiBlcId; }
    public function getPeriodeMulai(): string { return $this->periodeMulai; }
    public function getPeriodeAkhir(): string { return $this->periodeAkhir; }
    public function getTotalPeserta(): int { return $this->totalPeserta; }
    public function getTotalHadir(): int { return $this->totalHadir; }
    public function getTotalTidakHadir(): int { return $this->totalTidakHadir; }
    public function getPersentaseKehadiran(): float { return $this->persentaseKehadiran; }
    public function getCreatedAt(): Carbon { return $this->createdAt; }
    public function getUpdatedAt(): Carbon { return $this->updatedAt; }

    public function updateData(
        int $totalPeserta,
        int $totalHadir,
        int $totalTidakHadir,
        float $persentaseKehadiran
    ): void {
        $this->totalPeserta = $totalPeserta;
        $this->totalHadir = $totalHadir;
        $this->totalTidakHadir = $totalTidakHadir;
        $this->persentaseKehadiran = $persentaseKehadiran;
        $this->updatedAt = Carbon::now();
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id->value(),
            'sesi_id' => $this->sesiId,
            'instruktur_id' => $this->instrukturId,
            'lokasi_blc_id' => $this->lokasiBlcId,
            'periode_mulai' => $this->periodeMulai,
            'periode_akhir' => $this->periodeAkhir,
            'total_peserta' => $this->totalPeserta,
            'total_hadir' => $this->totalHadir,
            'total_tidak_hadir' => $this->totalTidakHadir,
            'persentase_kehadiran' => $this->persentaseKehadiran,
            'created_at' => $this->createdAt->toISOString(),
            'updated_at' => $this->updatedAt->toISOString(),
        ];
    }
}