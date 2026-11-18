<?php

namespace App\Modules\Koordinator\Monitoring\Application;

use App\Modules\Koordinator\Monitoring\Contracts\MonitoringRepository;

/**
 * Kasus pemakaian: ambil daftar Monitoring.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListMonitoring
{
    public function __construct(private readonly MonitoringRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
