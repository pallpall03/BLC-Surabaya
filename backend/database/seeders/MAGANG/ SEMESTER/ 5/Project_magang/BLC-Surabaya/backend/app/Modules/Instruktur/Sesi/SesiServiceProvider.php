<?php

namespace App\Modules\Instruktur\Sesi;

use App\Modules\Instruktur\Sesi\Contracts\SesiRepository;
use App\Modules\Instruktur\Sesi\Infrastructure\EloquentSesiRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class SesiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SesiRepository::class, EloquentSesiRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('sesi')->group(function (): void {
            Route::get('/', [Sesi\Http\SesiController::class, 'index']);
            Route::get('/{id}', [Sesi\Http\SesiController::class, 'show']);
            Route::post('/', [Sesi\Http\SesiController::class, 'store']);
            Route::put('/{id}', [Sesi\Http\SesiController::class, 'update']);
            Route::delete('/{id}', [Sesi\Http\SesiController::class, 'destroy']);
        });
    }
}