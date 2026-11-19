<?php

namespace App\Modules\Koordinator\LaporanAbsensi\Contracts;

use App\Modules\Koordinator\LaporanAbsensi\Domain\LaporanAbsensi;
use App\Modules\Koordinator\LaporanAbsensi\Domain\ValueObjects\LaporanAbsensiId;

interface LaporanAbsensiRepositoryInterface
{
    public function all(): array;
    public function find(LaporanAbsensiId $id): ?LaporanAbsensi;
    public function findBySesiId(string $sesiId): array;
    public function findByInstrukturId(string $instrukturId): array;
    public function findByLokasiBlcId(string $lokasiBlcId): array;
    public function findByPeriode(string $mulai, string $akhir): array;
    public function create(array $data): LaporanAbsensi;
    public function update(LaporanAbsensiId $id, array $data): LaporanAbsensi;
    public function delete(LaporanAbsensiId $id): void;
    public function generateLaporan(string $sesiId, string $periodeMulai, string $periodeAkhir): LaporanAbsensi;
}