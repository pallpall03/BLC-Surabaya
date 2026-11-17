<?php

namespace App\Modules\Setting\LevelPengguna\Infrastructure;

use App\Modules\Setting\LevelPengguna\Contracts\LevelPenggunaRepository;
use App\Modules\Setting\LevelPengguna\Domain\LevelPengguna;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `level_pengguna`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentLevelPenggunaRepository implements LevelPenggunaRepository
{
    public function all(): array
    {
        throw new RuntimeException('LevelPengguna: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('LevelPengguna: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('LevelPengguna: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('LevelPengguna: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('LevelPengguna: penyimpanan belum diimplementasi.');
    }
}
