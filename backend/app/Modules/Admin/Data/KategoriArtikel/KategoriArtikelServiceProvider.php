<?php

namespace App\Modules\Admin\Data\KategoriArtikel;

use App\Modules\Admin\Data\KategoriArtikel\Contracts\KategoriArtikelRepository;
use App\Modules\Admin\Data\KategoriArtikel\Infrastructure\EloquentKategoriArtikelRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class KategoriArtikelServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KategoriArtikelRepository::class, EloquentKategoriArtikelRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('kategori-artikel')->group(function (): void {
            Route::get('/', [Http\KategoriArtikelController::class, 'index']);
            Route::get('/{id}', [Http\KategoriArtikelController::class, 'show']);

            Route::middleware(['auth:api', 'role:superadmin'])->group(function (): void {
                Route::post('/', [Http\KategoriArtikelController::class, 'store']);
                Route::put('/{id}', [Http\KategoriArtikelController::class, 'update']);
                Route::patch('/{id}', [Http\KategoriArtikelController::class, 'update']);
                Route::delete('/{id}', [Http\KategoriArtikelController::class, 'destroy']);
            });
        });
    }
}
