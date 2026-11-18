<?php

namespace App\Modules\Instruktur\DaftarHadir\Application;

use App\Modules\Instruktur\DaftarHadir\Contracts\DaftarHadirRepository;

/**
 * Kasus pemakaian: ambil daftar Daftar Hadir.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListDaftarHadir
{
    public function __construct(private readonly DaftarHadirRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
