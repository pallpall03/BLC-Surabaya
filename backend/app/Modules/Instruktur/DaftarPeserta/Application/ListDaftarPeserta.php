<?php

namespace App\Modules\Instruktur\DaftarPeserta\Application;

use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;

/**
 * Kasus pemakaian: ambil daftar Daftar Peserta.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListDaftarPeserta
{
    public function __construct(private readonly DaftarPesertaRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
