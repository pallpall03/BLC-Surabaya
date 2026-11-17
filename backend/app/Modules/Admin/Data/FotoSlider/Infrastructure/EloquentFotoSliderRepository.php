<?php

namespace App\Modules\Admin\Data\FotoSlider\Infrastructure;

use App\Modules\Admin\Data\FotoSlider\Contracts\FotoSliderRepository;
use App\Modules\Admin\Data\FotoSlider\Domain\FotoSlider;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `foto_slider`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentFotoSliderRepository implements FotoSliderRepository
{
    public function all(): array
    {
        throw new RuntimeException('FotoSlider: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('FotoSlider: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('FotoSlider: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('FotoSlider: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('FotoSlider: penyimpanan belum diimplementasi.');
    }
}
