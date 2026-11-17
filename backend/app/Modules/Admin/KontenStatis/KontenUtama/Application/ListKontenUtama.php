<?php

namespace App\Modules\Admin\KontenStatis\KontenUtama\Application;

use App\Modules\Admin\KontenStatis\KontenUtama\Contracts\KontenUtamaRepository;

/**
 * Kasus pemakaian: ambil daftar KontenUtama.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListKontenUtama
{
    public function __construct(private readonly KontenUtamaRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
