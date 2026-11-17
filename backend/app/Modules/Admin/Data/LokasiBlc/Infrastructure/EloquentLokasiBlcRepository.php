<?php

namespace App\Modules\Admin\Data\LokasiBlc\Infrastructure;

use App\Modules\Admin\Data\LokasiBlc\Contracts\LokasiBlcRepository;
use App\Modules\Admin\Data\LokasiBlc\Domain\LokasiBlc;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `lokasi_blc`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentLokasiBlcRepository implements LokasiBlcRepository
{
    public function all(): array
    {
        throw new RuntimeException('LokasiBlc: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('LokasiBlc: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('LokasiBlc: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('LokasiBlc: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('LokasiBlc: penyimpanan belum diimplementasi.');
    }
}
