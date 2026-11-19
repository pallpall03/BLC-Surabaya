<?php

namespace App\Modules\Admin\Data\FotoSlider\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Data\FotoSlider\Domain\FotoSlider;

/**
 * @extends Repository<FotoSlider>
 */
interface FotoSliderRepository extends Repository
{
    public function getByTipe(string $tipe): array;
    public function getAktif(): array;
    public function getByStatus(string $status): array;
}
