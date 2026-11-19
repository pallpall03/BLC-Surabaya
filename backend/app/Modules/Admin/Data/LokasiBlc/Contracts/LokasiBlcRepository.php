<?php

namespace App\Modules\Admin\Data\LokasiBlc\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Data\LokasiBlc\Domain\LokasiBlc;

/**
 * @extends Repository<LokasiBlc>
 */
interface LokasiBlcRepository extends Repository
{
    public function getAktif(): array;
    public function getByArea(string $area): array;
}
