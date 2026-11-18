<?php

namespace App\Modules\Koordinator\KategoriPeserta\Contracts;

use App\Modules\Koordinator\KategoriPeserta\Domain\KategoriPeserta;

interface KategoriPesertaRepository
{
    public function all(): array;
    public function find(int $id): ?KategoriPeserta;
    public function findByNama(string $nama): ?KategoriPeserta;
    public function create(KategoriPeserta $kategori): KategoriPeserta;
    public function update(KategoriPeserta $kategori): KategoriPeserta;
    public function delete(int $id): void;
}