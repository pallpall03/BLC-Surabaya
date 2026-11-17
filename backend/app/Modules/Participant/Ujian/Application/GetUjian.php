<?php

namespace App\Modules\Participant\Ujian\Application;

use App\Modules\Participant\Ujian\Contracts\UjianRepository;

/**
 * Kasus pemakaian: detail Ujian milik peserta.
 */
final class GetUjian
{
    public function __construct(private readonly UjianRepository $repository)
    {
    }

    public function handle(int $id): mixed
    {
        return $this->repository->find($id);
    }
}
