<?php

namespace App\Modules\Admin\Data\TimBlc\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Data\TimBlc\Domain\TimBlc;

/**
 * @extends Repository<TimBlc>
 */
interface TimBlcRepository extends Repository
{
    public function getByRole(string $role): array;
    public function getInstruktur(): array;
    public function getKoordinator(): array;
    public function getAktif(): array;
}
