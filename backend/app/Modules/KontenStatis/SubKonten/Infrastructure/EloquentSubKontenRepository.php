<?php

namespace App\Modules\KontenStatis\SubKonten\Infrastructure;

use App\Modules\KontenStatis\SubKonten\Contracts\SubKontenRepository;
use App\Modules\KontenStatis\SubKonten\Domain\SubKonten;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `sub_konten`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentSubKontenRepository implements SubKontenRepository
{
    public function all(): array
    {
        throw new RuntimeException('SubKonten: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('SubKonten: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('SubKonten: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('SubKonten: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('SubKonten: penyimpanan belum diimplementasi.');
    }
}
