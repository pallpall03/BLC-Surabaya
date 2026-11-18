<?php

namespace App\Modules\Instruktur\Materi;

use App\Modules\Instruktur\Materi\Contracts\MateriRepository;
use App\Modules\Instruktur\Materi\Infrastructure\EloquentMateriRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class MateriServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MateriRepository::class, EloquentMateriRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('materi')->group(function (): void {
            Route::get('/', [Materi\Http\MateriController::class, 'index']);
            Route::get('/{id}', [Materi\Http\MateriController::class, 'show']);
            Route::post('/', [Materi\Http\MateriController::class, 'store']);
            Route::put('/{id}', [Materi\Http\MateriController::class, 'update']);
            Route::delete('/{id}', [Materi\Http\MateriController::class, 'destroy']);
        });
    }
}