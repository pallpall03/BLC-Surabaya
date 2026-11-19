<?php

namespace App\Modules\Koordinator\RekapPesertaPengunjung\Contracts;

use App\Modules\Koordinator\RekapPesertaPengunjung\Domain\RekapPesertaPengunjung;

interface RekapPesertaPengunjungRepository
{
    public function all(): array;
    public function find(int $id): ?RekapPesertaPengunjung;
    public function findByLokasiBlcId(int $lokasiBlcId): array;
    public function findByTanggal(string $tanggal): array;
    public function findByBulanTahun(int $bulan, int $tahun): array;
    public function create(RekapPesertaPengunjung $rekap): RekapPesertaPengunjung;
    public function update(RekapPesertaPengunjung $rekap): RekapPesertaPengunjung;
    public function delete(int $id): void;
}