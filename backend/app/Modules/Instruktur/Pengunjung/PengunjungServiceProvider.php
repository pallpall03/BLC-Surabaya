<?php

namespace App\Modules\Instruktur\Pengunjung;

use App\Modules\Instruktur\Pengunjung\Contracts\PengunjungRepository;
use App\Modules\Instruktur\Pengunjung\Infrastructure\EloquentPengunjungRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class PengunjungServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PengunjungRepository::class, EloquentPengunjungRepository::class);
    }

    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role:instruktur'])
            ->prefix('instruktur/pengunjung')
            ->group(function (): void {
                Route::get('/opsi', [Http\PengunjungController::class, 'opsi']);
                Route::get('/', [Http\PengunjungController::class, 'index']);
                Route::post('/', [Http\PengunjungController::class, 'store']);
                Route::get('/{id}', [Http\PengunjungController::class, 'show']);
                Route::put('/{id}', [Http\PengunjungController::class, 'update']);
                Route::patch('/{id}', [Http\PengunjungController::class, 'update']);
                Route::delete('/{id}', [Http\PengunjungController::class, 'destroy']);
            });
    }
}
