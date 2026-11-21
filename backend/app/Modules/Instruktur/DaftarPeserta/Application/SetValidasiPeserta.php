<?php

namespace App\Modules\Instruktur\DaftarPeserta\Application;

use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Kasus pemakaian: validasi / batalkan validasi peserta.
 * $valid = null berarti balik status sekarang (tombol "Validasi" / "Batalkan").
 * Saat divalidasi, waktu dan instruktur yang memvalidasi dicatat; saat dibatalkan keduanya dikosongkan.
 */
final class SetValidasiPeserta
{
    public function __construct(private readonly DaftarPesertaRepository $repository)
    {
    }

    /**
     * @return array<string, mixed>
     *
     * @throws ModelNotFoundException
     */
    public function handle(int $id, ?bool $valid, ?int $oleh): array
    {
        if ($valid === null) {
            $sekarang = $this->repository->find($id);

            if ($sekarang === null) {
                throw (new ModelNotFoundException())->setModel('peserta', [$id]);
            }

            $valid = ! $sekarang['tervalidasi'];
        }

        return $this->repository->setValidasi($id, $valid, $oleh);
    }
}
