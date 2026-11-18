<?php

namespace App\Modules\Participant\Ujian\Application;

use App\Modules\Participant\Ujian\Contracts\UjianRepository;

/**
 * Kasus pemakaian: ambil jadwal ujian peserta yang login.
 */
final class GetMyJadwal
{
    public function __construct(private readonly UjianRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all(); // nanti difilter by peserta_id
    }
}
