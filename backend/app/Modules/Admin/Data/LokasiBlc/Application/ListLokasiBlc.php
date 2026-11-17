<?php

namespace App\Modules\Admin\Data\LokasiBlc\Application;

use App\Modules\Admin\Data\LokasiBlc\Contracts\LokasiBlcRepository;

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
