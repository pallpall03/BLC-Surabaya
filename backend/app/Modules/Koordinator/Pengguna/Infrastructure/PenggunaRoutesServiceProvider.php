<?php

namespace App\Modules\Koordinator\Pengguna\Infrastructure;

use Illuminate\Support\Facades\Route;

class PenggunaRoutesServiceProvider
{
    public static function register(): void
    {
        Route::middleware(['auth:api', 'role:koordinator'])->prefix('pengguna')->group(function () {
            Route::get('/', [\App\Modules\Koordinator\Pengguna\Http\PenggunaController::class, 'index']);
            Route::get('/{id}', [\App\Modules\Koordinator\Pengguna\Http\PenggunaController::class, 'show']);
            Route::post('/', [\App\Modules\Koordinator\Pengguna\Http\PenggunaController::class, 'store']);
            Route::put('/{id}', [\App\Modules\Koordinator\Pengguna\Http\PenggunaController::class, 'update']);
            Route::delete('/{id}', [\App\Modules\Koordinator\Pengguna\Http\PenggunaController::class, 'destroy']);

            // Update last login route
            Route::post('/{id}/login', [\App\Modules\Koordinator\Pengguna\Http\PenggunaController::class, 'updateLastLogin']);
        });
    }
}