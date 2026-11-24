<?php

namespace App\Modules\Koordinator\Laporan;

use App\Modules\Koordinator\Laporan\Contracts\LaporanRepository;
use App\Modules\Koordinator\Laporan\Infrastructure\EloquentLaporanRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class LaporanServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LaporanRepository::class, EloquentLaporanRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php (lihat ModuleRegistry).
     * Hanya role: koordinator.
     */
    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role.path'])
            ->prefix('koordinator/laporan')
            ->group(function (): void {
                Route::get('/', [Http\LaporanController::class, 'index']);
            });
    }
}
