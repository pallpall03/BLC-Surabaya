<?php

namespace App\Modules\Admin\System\HakAkses\Infrastructure;

use App\Modules\Admin\System\HakAkses\Contracts\HakAksesRepository;
use App\Modules\Admin\System\HakAkses\Domain\HakAkses;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `hak_akses`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentHakAksesRepository implements HakAksesRepository
{
    public function all(): array
    {
        throw new RuntimeException('HakAkses: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('HakAkses: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('HakAkses: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('HakAkses: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('HakAkses: penyimpanan belum diimplementasi.');
    }
}
