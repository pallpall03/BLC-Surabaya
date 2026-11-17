<?php

namespace App\Modules\KontenStatis\SubKonten\Application;

use App\Modules\KontenStatis\SubKonten\Contracts\SubKontenRepository;

/**
 * Kasus pemakaian: ambil daftar SubKonten.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListSubKonten
{
    public function __construct(private readonly SubKontenRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
