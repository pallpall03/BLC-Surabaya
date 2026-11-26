<?php

namespace App\Modules\Instruktur\FotoKegiatan;

use App\Modules\Instruktur\FotoKegiatan\Contracts\FotoKegiatanRepository;
use App\Modules\Instruktur\FotoKegiatan\Infrastructure\EloquentFotoKegiatanRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class FotoKegiatanServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(FotoKegiatanRepository::class, EloquentFotoKegiatanRepository::class);
    }

    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role:instruktur'])
            ->prefix('instruktur/foto-kegiatan')
            ->group(function (): void {
                Route::get('/opsi', [Http\FotoKegiatanController::class, 'opsi']);
                Route::get('/', [Http\FotoKegiatanController::class, 'index']);
                Route::post('/', [Http\FotoKegiatanController::class, 'store']);
                Route::get('/{id}', [Http\FotoKegiatanController::class, 'show']);
                Route::put('/{id}', [Http\FotoKegiatanController::class, 'update']);
                Route::delete('/{id}', [Http\FotoKegiatanController::class, 'destroy']);
            });
    }
}
