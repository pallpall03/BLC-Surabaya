<?php

namespace App\Modules\Koordinator\KategoriPeserta;

use App\Modules\Koordinator\KategoriPeserta\Contracts\KategoriPesertaRepository;
use App\Modules\Koordinator\KategoriPeserta\Infrastructure\EloquentKategoriPesertaRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class KategoriPesertaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KategoriPesertaRepository::class, EloquentKategoriPesertaRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('kategori-peserta')->group(function (): void {
            Route::get('/', [KategoriPeserta\Http\KategoriPesertaController::class, 'index']);
            Route::get('/{id}', [KategoriPeserta\Http\KategoriPesertaController::class, 'show']);
            Route::post('/', [KategoriPeserta\Http\KategoriPesertaController::class, 'store']);
            Route::put('/{id}', [KategoriPeserta\Http\KategoriPesertaController::class, 'update']);
            Route::delete('/{id}', [KategoriPeserta\Http\KategoriPesertaController::class, 'destroy']);
        });
    }
}