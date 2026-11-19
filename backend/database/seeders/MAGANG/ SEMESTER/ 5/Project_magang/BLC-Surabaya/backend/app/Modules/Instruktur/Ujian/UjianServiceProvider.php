<?php

namespace App\Modules\Instruktur\Ujian;

use App\Modules\Instruktur\Ujian\Contracts\UjianRepository;
use App\Modules\Instruktur\Ujian\Infrastructure\EloquentUjianRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class UjianServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UjianRepository::class, EloquentUjianRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('ujian')->group(function (): void {
            Route::get('/', [Ujian\Http\UjianController::class, 'index']);
            Route::get('/{id}', [Ujian\Http\UjianController::class, 'show']);
            Route::post('/', [Ujian\Http\UjianController::class, 'store']);
            Route::put('/{id}', [Ujian\Http\UjianController::class, 'update']);
            Route::delete('/{id}', [Ujian\Http\UjianController::class, 'destroy']);
        });
    }
}