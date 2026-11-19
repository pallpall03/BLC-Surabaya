<?php

namespace App\Modules\Admin\Konten;

use App\Modules\Admin\Konten\Contracts\KontenRepository;
use App\Modules\Admin\Konten\Infrastructure\EloquentKontenRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class KontenServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KontenRepository::class, EloquentKontenRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('konten')->group(function (): void {
            Route::get('/', [Http\KontenController::class, 'index']);
            Route::get('/flat', [Http\KontenController::class, 'flat']);
            Route::get('/slug/{slug}', [Http\KontenController::class, 'bySlug']);
            Route::post('/', [Http\KontenController::class, 'store']);
            Route::get('/{id}', [Http\KontenController::class, 'show']);
            Route::put('/{id}', [Http\KontenController::class, 'update']);
            Route::patch('/{id}', [Http\KontenController::class, 'update']);
            Route::delete('/{id}', [Http\KontenController::class, 'destroy']);
        });
    }
}