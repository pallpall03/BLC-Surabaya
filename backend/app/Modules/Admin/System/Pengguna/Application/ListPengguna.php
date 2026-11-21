<?php

namespace App\Modules\Admin\System\Pengguna\Application;

use App\Modules\Admin\System\Pengguna\Contracts\PenggunaRepository;

/**
 * Kasus pemakaian: ambil daftar Pengguna.
 */
final class ListPengguna
{
    public function __construct(private readonly PenggunaRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}