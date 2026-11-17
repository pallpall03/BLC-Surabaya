<?php

namespace App\Modules\Data\KategoriArtikel\Application;

use App\Modules\Data\KategoriArtikel\Contracts\KategoriArtikelRepository;

/**
 * Kasus pemakaian: ambil daftar KategoriArtikel.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListKategoriArtikel
{
    public function __construct(private readonly KategoriArtikelRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
