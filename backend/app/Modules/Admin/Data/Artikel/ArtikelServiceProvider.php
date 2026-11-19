<?php

namespace App\Modules\Admin\Data\Artikel;

use App\Modules\Admin\Data\Artikel\Contracts\ArtikelRepository;
use App\Modules\Admin\Data\Artikel\Infrastructure\EloquentArtikelRepository;
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
                Route::get('/latest', [Http\ArtikelController::class, 'latest']);
                Route::get('/kategori/{kategoriId}', [Http\ArtikelController::class, 'byKategori']);
                Route::post('/', [Http\ArtikelController::class, 'store']);
                Route::get('/{id}', [Http\ArtikelController::class, 'show']);
                Route::put('/{id}', [Http\ArtikelController::class, 'update']);
                Route::patch('/{id}', [Http\ArtikelController::class, 'update']);
                Route::delete('/{id}', [Http\ArtikelController::class, 'destroy']);
            });
        }
}
