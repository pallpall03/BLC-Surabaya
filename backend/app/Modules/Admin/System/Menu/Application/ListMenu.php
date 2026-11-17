<?php

namespace App\Modules\Admin\System\Menu\Application;

use App\Modules\Admin\System\Menu\Contracts\MenuRepository;

/**
 * Kasus pemakaian: ambil daftar Menu.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListMenu
{
    public function __construct(private readonly MenuRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
