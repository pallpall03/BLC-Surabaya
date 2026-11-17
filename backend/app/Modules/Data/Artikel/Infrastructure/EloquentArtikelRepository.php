<?php

namespace App\Modules\Data\Artikel\Infrastructure;

use App\Modules\Data\Artikel\Contracts\ArtikelRepository;
use App\Modules\Data\Artikel\Domain\Artikel;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `artikel`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentArtikelRepository implements ArtikelRepository
{
    public function all(): array
    {
        throw new RuntimeException('Artikel: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('Artikel: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('Artikel: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('Artikel: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('Artikel: penyimpanan belum diimplementasi.');
    }
}
