<?php

namespace App\Modules\Data\TimBlc\Application;

use App\Modules\Data\TimBlc\Contracts\TimBlcRepository;

/**
 * Kasus pemakaian: ambil daftar TimBlc.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListTimBlc
{
    public function __construct(private readonly TimBlcRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
