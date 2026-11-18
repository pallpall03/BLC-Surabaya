<?php

namespace App\Modules\Instruktur\Absensi;

use App\Modules\Instruktur\Absensi\Contracts\AbsensiRepository;
use App\Modules\Instruktur\Absensi\Infrastructure\EloquentAbsensiRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class AbsensiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AbsensiRepository::class, EloquentAbsensiRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('absensi')->group(function (): void {
            Route::get('/', [Absensi\Http\AbsensiController::class, 'index']);
            Route::get('/{id}', [Absensi\Http\AbsensiController::class, 'show']);
            Route::post('/', [Absensi\Http\AbsensiController::class, 'store']);
            Route::put('/{id}', [Absensi\Http\AbsensiController::class, 'update']);
            Route::delete('/{id}', [Absensi\Http\AbsensiController::class, 'destroy']);
        });
    }
}