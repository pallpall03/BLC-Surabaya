<?php

namespace App\Modules\Admin\KontenStatis\SubKonten\Application;

use App\Modules\Admin\KontenStatis\SubKonten\Contracts\SubKontenRepository;

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
