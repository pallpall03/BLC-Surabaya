<?php

namespace App\Modules\Instruktur\LaporanKegiatan\Contracts;

use App\Modules\Instruktur\LaporanKegiatan\Domain\LaporanKegiatan;

interface LaporanKegiatanRepository
{
    public function all(): array;
    public function find(int $id): ?LaporanKegiatan;
    public function findByKelasId(int $kelasId): array;
    public function findByTanggal(string $tanggal): array;
    public function findByBulanTahun(int $bulan, int $tahun): array;
    public function create(LaporanKegiatan $laporan): LaporanKegiatan;
    public function update(LaporanKegiatan $laporan): LaporanKegiatan;
    public function delete(int $id): void;
}