<?php

namespace App\Modules\Participant\Ujian\Application;

use App\Modules\Participant\Ujian\Contracts\UjianRepository;

/**
 * Kasus pemakaian: ambil daftar Ujian milik peserta yang login.
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
