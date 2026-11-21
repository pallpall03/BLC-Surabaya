<?php

namespace App\Modules\Instruktur\DaftarPeserta\Application;

use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/** Kasus pemakaian: hapus peserta (soft delete, datanya masih ada di database). */
final class DeleteDaftarPeserta
{
    public function __construct(private readonly DaftarPesertaRepository $repository)
    {
    }

    /** @throws ModelNotFoundException */
    public function handle(int $id): void
    {
        $this->repository->delete($id);
    }
}
