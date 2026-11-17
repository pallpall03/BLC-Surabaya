<?php

namespace App\Modules\Admin\Data\Artikel\Application;

use App\Modules\Admin\Data\Artikel\Contracts\ArtikelRepository;

/**
 * Kasus pemakaian: ambil daftar Artikel.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListArtikel
{
    public function __construct(private readonly ArtikelRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
