<?php

namespace App\Modules\Koordinator\Monitoring;

use App\Modules\Koordinator\Monitoring\Contracts\MonitoringRepository;
use App\Modules\Koordinator\Monitoring\Infrastructure\EloquentMonitoringRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class MonitoringServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MonitoringRepository::class, EloquentMonitoringRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php (lihat ModuleRegistry).
     * Hanya role: koordinator.
     */
    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role:koordinator'])
            ->prefix('koordinator/monitoring')
            ->group(function (): void {
                Route::get('/', [Http\MonitoringController::class, 'index']);
            });
    }
}
