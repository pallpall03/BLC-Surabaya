<?php

namespace App\Modules\Instruktur\Kelas;

use App\Modules\Instruktur\Kelas\Contracts\KelasRepository;
use App\Modules\Instruktur\Kelas\Infrastructure\EloquentKelasRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class KelasServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KelasRepository::class, EloquentKelasRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('kelas')->group(function (): void {
            Route::get('/', [Kelas\Http\KelasController::class, 'index']);
            Route::get('/{id}', [Kelas\Http\KelasController::class, 'show']);
            Route::post('/', [Kelas\Http\KelasController::class, 'store']);
            Route::put('/{id}', [Kelas\Http\KelasController::class, 'update']);
            Route::delete('/{id}', [Kelas\Http\KelasController::class, 'destroy']);
        });
    }
}