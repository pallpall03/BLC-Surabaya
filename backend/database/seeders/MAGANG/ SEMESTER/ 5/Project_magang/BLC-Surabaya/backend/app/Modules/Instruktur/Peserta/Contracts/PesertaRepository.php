<?php

namespace App\Modules\Instruktur\Peserta\Contracts;

use App\Modules\Instruktur\Peserta\Domain\Peserta;

interface PesertaRepository
{
    public function all(): array;
    public function find(int $id): ?Peserta;
    public function findByKelasId(int $kelasId): array;
    public function findByKecamatanKelurahan(string $kecamatan, string $kelurahan): array;
    public function findByKategori(string $kategori): array;
    public function create(Peserta $peserta): Peserta;
    public function update(Peserta $peserta): Peserta;
    public function delete(int $id): void;
}