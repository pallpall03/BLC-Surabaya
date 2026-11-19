<?php

namespace App\Modules\Instruktur\Laporan\Application;

use App\Modules\Instruktur\Laporan\Contracts\LaporanRepository;

/**
 * Kasus pemakaian: ambil daftar Laporan Kegiatan.
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
