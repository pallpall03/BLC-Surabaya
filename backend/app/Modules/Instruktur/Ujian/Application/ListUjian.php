<?php

namespace App\Modules\Instruktur\Ujian\Application;

use App\Modules\Instruktur\Ujian\Contracts\UjianRepository;

/**
 * Kasus pemakaian: ambil daftar Ujian (pretest/posttest).
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListUjian
{
    public function __construct(private readonly UjianRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
