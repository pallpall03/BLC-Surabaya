<?php

namespace App\Modules\Koordinator\Dashboard\Contracts;

use App\Modules\Koordinator\Dashboard\Domain\Dashboard;

interface DashboardRepository
{
    public function all(): array;
    public function find(int $id): ?Dashboard;
    public function getDashboardData(): array;
}