<?php

namespace App\Modules\Setting\Pengguna\Infrastructure;

use App\Modules\Setting\Pengguna\Contracts\PenggunaRepository;
use App\Modules\Setting\Pengguna\Domain\Pengguna;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `pengguna`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentPenggunaRepository implements PenggunaRepository
{
    public function all(): array
    {
        throw new RuntimeException('Pengguna: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('Pengguna: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('Pengguna: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('Pengguna: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('Pengguna: penyimpanan belum diimplementasi.');
    }
}
