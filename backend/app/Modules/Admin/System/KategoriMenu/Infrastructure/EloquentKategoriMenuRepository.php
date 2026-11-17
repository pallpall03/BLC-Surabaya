<?php

namespace App\Modules\Admin\System\KategoriMenu\Infrastructure;

use App\Modules\Admin\System\KategoriMenu\Contracts\KategoriMenuRepository;
use App\Modules\Admin\System\KategoriMenu\Domain\KategoriMenu;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `kategori_menu`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentKategoriMenuRepository implements KategoriMenuRepository
{
    public function all(): array
    {
        throw new RuntimeException('KategoriMenu: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('KategoriMenu: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('KategoriMenu: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('KategoriMenu: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('KategoriMenu: penyimpanan belum diimplementasi.');
    }
}
