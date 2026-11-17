<?php

namespace App\Modules\Admin\KontenStatis\KontenUtama\Infrastructure;

use App\Modules\Admin\KontenStatis\KontenUtama\Contracts\KontenUtamaRepository;
use App\Modules\Admin\KontenStatis\KontenUtama\Domain\KontenUtama;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `konten_utama`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentKontenUtamaRepository implements KontenUtamaRepository
{
    public function all(): array
    {
        throw new RuntimeException('KontenUtama: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('KontenUtama: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('KontenUtama: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('KontenUtama: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('KontenUtama: penyimpanan belum diimplementasi.');
    }
}
