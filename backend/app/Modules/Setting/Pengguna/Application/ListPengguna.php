<?php

namespace App\Modules\Setting\Pengguna\Application;

use App\Modules\Setting\Pengguna\Contracts\PenggunaRepository;

/**
 * Kasus pemakaian: ambil daftar Pengguna.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListPengguna
{
    public function __construct(private readonly PenggunaRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
