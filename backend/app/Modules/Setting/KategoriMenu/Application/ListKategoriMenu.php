<?php

namespace App\Modules\Setting\KategoriMenu\Application;

use App\Modules\Setting\KategoriMenu\Contracts\KategoriMenuRepository;

/**
 * Kasus pemakaian: ambil daftar KategoriMenu.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListKategoriMenu
{
    public function __construct(private readonly KategoriMenuRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
