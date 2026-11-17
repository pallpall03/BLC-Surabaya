<?php

namespace App\Modules\Setting\LevelPengguna\Application;

use App\Modules\Setting\LevelPengguna\Contracts\LevelPenggunaRepository;

/**
 * Kasus pemakaian: ambil daftar LevelPengguna.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListLevelPengguna
{
    public function __construct(private readonly LevelPenggunaRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
