<?php

namespace App\Modules\Data\FotoSlider\Application;

use App\Modules\Data\FotoSlider\Contracts\FotoSliderRepository;

/**
 * Kasus pemakaian: ambil daftar FotoSlider.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListFotoSlider
{
    public function __construct(private readonly FotoSliderRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
