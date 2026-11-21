<?php

namespace App\Modules\Instruktur\DaftarPeserta\Application;

use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;

/** Kasus pemakaian: pilihan dropdown untuk form peserta (BLC aktif dan kategori aktif). */
final class OpsiDaftarPeserta
{
    public function __construct(private readonly DaftarPesertaRepository $repository)
    {
    }

    /** @return array{lokasi_blc: list<array{id: int, nama: string}>, kategori_peserta: list<array{id: int, nama: string}>} */
    public function handle(): array
    {
        return $this->repository->opsi();
    }
}
