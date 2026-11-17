<?php

namespace App\Modules\Data\KategoriArtikel\Infrastructure;

use App\Modules\Data\KategoriArtikel\Contracts\KategoriArtikelRepository;
use App\Modules\Data\KategoriArtikel\Domain\KategoriArtikel;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `kategori_artikel`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentKategoriArtikelRepository implements KategoriArtikelRepository
{
    public function all(): array
    {
        throw new RuntimeException('KategoriArtikel: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('KategoriArtikel: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('KategoriArtikel: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('KategoriArtikel: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('KategoriArtikel: penyimpanan belum diimplementasi.');
    }
}
