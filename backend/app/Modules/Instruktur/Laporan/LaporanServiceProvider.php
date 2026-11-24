<?php

namespace App\Modules\Instruktur\Laporan;

use App\Modules\Instruktur\Laporan\Contracts\LaporanRepository;
use App\Modules\Instruktur\Laporan\Infrastructure\EloquentLaporanRepository;
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
     * Hanya role: instruktur.
     */
    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role.path'])
            ->prefix('instruktur/laporan')
            ->group(function (): void {
                Route::get('/', [Http\LaporanController::class, 'index']);
            });
    }
}
