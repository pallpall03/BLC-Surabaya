<?php

namespace App\Modules\Admin\Data\Ujian\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Data\Ujian\Domain\Ujian;

/**
 * @extends Repository<Ujian>
 */
interface UjianRepository extends Repository
{
    public function getAktif(): array;
}
