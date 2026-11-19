<?php

namespace App\Modules\Participant\Piagam\Application;

use App\Modules\Participant\Piagam\Contracts\PiagamRepository;

/**
 * Kasus pemakaian: ambil daftar Piagam milik peserta yang login.
 */
final class ListPiagam
{
    public function __construct(private readonly PiagamRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
