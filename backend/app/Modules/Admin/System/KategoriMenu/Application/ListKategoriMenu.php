<?php

namespace App\Modules\Admin\System\KategoriMenu\Application;

use App\Modules\Admin\System\KategoriMenu\Contracts\KategoriMenuRepository;

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
