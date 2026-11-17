<?php

namespace App\Modules\Participant\Modul\Application;

use App\Modules\Participant\Modul\Contracts\ModulRepository;

/**
 * Kasus pemakaian: ambil daftar Modul milik peserta yang login.
 */
final class ListModul
{
    public function __construct(private readonly ModulRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
