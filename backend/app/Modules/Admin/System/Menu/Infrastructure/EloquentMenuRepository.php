<?php

namespace App\Modules\Admin\System\Menu\Infrastructure;

use App\Modules\Admin\System\Menu\Contracts\MenuRepository;
use App\Modules\Admin\System\Menu\Domain\Menu;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `menu`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentMenuRepository implements MenuRepository
{
    public function all(): array
    {
        throw new RuntimeException('Menu: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('Menu: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('Menu: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('Menu: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('Menu: penyimpanan belum diimplementasi.');
    }
}
