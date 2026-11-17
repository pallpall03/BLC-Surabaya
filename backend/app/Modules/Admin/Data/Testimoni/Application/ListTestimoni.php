<?php

namespace App\Modules\Admin\Data\Testimoni\Application;

use App\Modules\Admin\Data\Testimoni\Contracts\TestimoniRepository;

/**
 * Kasus pemakaian: ambil daftar Testimoni.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListTestimoni
{
    public function __construct(private readonly TestimoniRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
