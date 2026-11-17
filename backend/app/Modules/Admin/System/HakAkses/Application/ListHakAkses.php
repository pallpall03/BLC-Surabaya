<?php

namespace App\Modules\Admin\System\HakAkses\Application;

use App\Modules\Admin\System\HakAkses\Contracts\HakAksesRepository;

/**
 * Kasus pemakaian: ambil daftar HakAkses.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListHakAkses
{
    public function __construct(private readonly HakAksesRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
