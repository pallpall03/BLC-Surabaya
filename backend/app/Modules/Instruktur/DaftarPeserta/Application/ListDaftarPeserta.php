<?php

namespace App\Modules\Instruktur\DaftarPeserta\Application;

use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;

/** Kasus pemakaian: daftar peserta berhalaman + statistik untuk kartu ringkasan. */
final class ListDaftarPeserta
{
    public function __construct(private readonly DaftarPesertaRepository $repository)
    {
    }

    /**
     * @param  array<string, mixed>  $filter
     * @return array{data: list<array<string, mixed>>, meta: array<string, int>, statistik: array<string, int>}
     */
    public function handle(array $filter, int $perPage = 10, int $page = 1): array
    {
        return [
            ...$this->repository->paginate($filter, $perPage, $page),
            'statistik' => $this->repository->statistik($filter),
        ];
    }
}
