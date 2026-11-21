<?php

namespace App\Modules\Instruktur\DaftarPeserta\Application;

use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/** Kasus pemakaian: ubah data peserta. Status validasi tidak diubah di sini. */
final class UpdateDaftarPeserta
{
    public function __construct(private readonly DaftarPesertaRepository $repository)
    {
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     *
     * @throws ModelNotFoundException
     */
    public function handle(int $id, array $data): array
    {
        return $this->repository->update($id, $data);
    }
}
