<?php

namespace App\Modules\Admin\Data\Modul\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Data\Modul\Domain\Modul;

/**
 * @extends Repository<Modul>
 */
interface ModulRepository extends Repository
{
    public function getAktif(): array;
}
