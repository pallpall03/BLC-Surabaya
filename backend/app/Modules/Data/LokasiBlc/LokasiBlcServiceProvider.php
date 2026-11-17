<?php

namespace App\Modules\Data\LokasiBlc;

use App\Modules\Data\LokasiBlc\Contracts\LokasiBlcRepository;
use App\Modules\Data\LokasiBlc\Infrastructure\EloquentLokasiBlcRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class LokasiBlcServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LokasiBlcRepository::class, EloquentLokasiBlcRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('lokasi-blc')->group(function (): void {
            Route::get('/', [Http\LokasiBlcController::class, 'index']);
        });
    }
}
