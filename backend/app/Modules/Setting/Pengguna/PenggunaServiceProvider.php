<?php

namespace App\Modules\Setting\Pengguna;

use App\Modules\Setting\Pengguna\Contracts\PenggunaRepository;
use App\Modules\Setting\Pengguna\Infrastructure\EloquentPenggunaRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class PenggunaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PenggunaRepository::class, EloquentPenggunaRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('pengguna')->group(function (): void {
            Route::get('/', [Http\PenggunaController::class, 'index']);
        });
    }
}
