<?php

namespace App\Modules\Instruktur\Laporan\Application;

use App\Modules\Instruktur\Laporan\Contracts\LaporanRepository;

/**
 * Kasus pemakaian: daftar Laporan Kegiatan milik instruktur pada rentang tanggal.
 */
final class ListLaporan
{
    public function __construct(private readonly LaporanRepository $repository)
    {
    }

    /** @return list<\App\Modules\Instruktur\Laporan\Domain\Laporan> */
    public function handle(int $instrukturId, string $mulai, string $sampai): array
    {
        return $this->repository->listForInstruktur($instrukturId, $mulai, $sampai);
    }
}
