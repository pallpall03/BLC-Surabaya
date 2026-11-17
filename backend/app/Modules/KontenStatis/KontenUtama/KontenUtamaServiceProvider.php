<?php

namespace App\Modules\KontenStatis\KontenUtama;

use App\Modules\KontenStatis\KontenUtama\Contracts\KontenUtamaRepository;
use App\Modules\KontenStatis\KontenUtama\Infrastructure\EloquentKontenUtamaRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class KontenUtamaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KontenUtamaRepository::class, EloquentKontenUtamaRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('konten-utama')->group(function (): void {
            Route::get('/', [Http\KontenUtamaController::class, 'index']);
        });
    }
}
