<?php

namespace App\Modules\Instruktur\DaftarPeserta\Application;

use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;

/** Kasus pemakaian: detail satu peserta (null jika tidak ada). */
final class GetDaftarPeserta
{
    public function __construct(private readonly DaftarPesertaRepository $repository)
    {
    }

    /** @return array<string, mixed>|null */
    public function handle(int $id): ?array
    {
        return $this->repository->find($id);
    }
}
