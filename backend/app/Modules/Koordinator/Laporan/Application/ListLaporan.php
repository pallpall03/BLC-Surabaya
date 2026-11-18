<?php

namespace App\Modules\Koordinator\Laporan\Application;

use App\Modules\Koordinator\Laporan\Contracts\LaporanRepository;

/**
 * Kasus pemakaian: ambil daftar Laporan Seluruh Kegiatan BLC.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListLaporan
{
    public function __construct(private readonly LaporanRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
