<?php

namespace App\Modules\Participant\Piagam\Application;

use App\Modules\Participant\Piagam\Contracts\PiagamRepository;

/**
 * Kasus pemakaian: detail Piagam milik peserta.
 */
final class GetPiagam
{
    public function __construct(private readonly PiagamRepository $repository)
    {
    }

    public function handle(int $id): mixed
    {
        return $this->repository->find($id);
    }
}
