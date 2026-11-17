<?php

namespace App\Modules\Participant\Modul\Application;

use App\Modules\Participant\Modul\Contracts\ModulRepository;

/**
 * Kasus pemakaian: detail Modul milik peserta.
 */
final class GetModul
{
    public function __construct(private readonly ModulRepository $repository)
    {
    }

    public function handle(int $id): mixed
    {
        return $this->repository->find($id);
    }
}
