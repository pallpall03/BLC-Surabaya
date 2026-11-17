<?php

namespace App\Modules\Admin\Data\TimBlc\Infrastructure;

use App\Modules\Admin\Data\TimBlc\Contracts\TimBlcRepository;
use App\Modules\Admin\Data\TimBlc\Domain\TimBlc;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `tim_blc`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentTimBlcRepository implements TimBlcRepository
{
    public function all(): array
    {
        throw new RuntimeException('TimBlc: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('TimBlc: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('TimBlc: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('TimBlc: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('TimBlc: penyimpanan belum diimplementasi.');
    }
}
