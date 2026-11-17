<?php

namespace App\Modules\Setting\HakAkses;

use App\Modules\Setting\HakAkses\Contracts\HakAksesRepository;
use App\Modules\Setting\HakAkses\Infrastructure\EloquentHakAksesRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class HakAksesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(HakAksesRepository::class, EloquentHakAksesRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('hak-akses')->group(function (): void {
            Route::get('/', [Http\HakAksesController::class, 'index']);
        });
    }
}
