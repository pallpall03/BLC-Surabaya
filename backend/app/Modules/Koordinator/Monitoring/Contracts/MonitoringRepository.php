<?php

namespace App\Modules\Koordinator\Monitoring\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Koordinator\Monitoring\Domain\Monitoring;

/**
 * @extends Repository<Monitoring>
 */
interface MonitoringRepository extends Repository
{
}
