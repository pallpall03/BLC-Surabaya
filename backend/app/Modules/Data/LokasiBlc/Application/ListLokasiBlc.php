<?php

namespace App\Modules\Data\LokasiBlc\Application;

use App\Modules\Data\LokasiBlc\Contracts\LokasiBlcRepository;

/**
 * Kasus pemakaian: ambil daftar LokasiBlc.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListLokasiBlc
{
    public function __construct(private readonly LokasiBlcRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
