<?php

namespace App\Modules\Data\Artikel;

use App\Modules\Data\Artikel\Contracts\ArtikelRepository;
use App\Modules\Data\Artikel\Infrastructure\EloquentArtikelRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class ArtikelServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ArtikelRepository::class, EloquentArtikelRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('artikel')->group(function (): void {
            Route::get('/', [Http\ArtikelController::class, 'index']);
        });
    }
}
