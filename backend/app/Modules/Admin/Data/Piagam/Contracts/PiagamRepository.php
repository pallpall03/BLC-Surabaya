<?php

namespace App\Modules\Admin\Data\Piagam\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Data\Piagam\Domain\Piagam;

/**
 * @extends Repository<Piagam>
 */
interface PiagamRepository extends Repository
{
    public function getAktif(): array;
}
