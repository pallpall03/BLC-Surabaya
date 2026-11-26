<?php

namespace App\Modules\Koordinator\PiagamPeserta\Infrastructure;

use Illuminate\Support\Facades\Route;

class PiagamPesertaRoutesServiceProvider
{
    public static function register(): void
    {
        Route::middleware(['auth:api', 'role:koordinator'])->prefix('piagam-peserta')->group(function () {
            Route::get('/', [\App\Modules\Koordinator\PiagamPeserta\Http\PiagamPesertaController::class, 'index']);
            Route::get('/{id}', [\App\Modules\Koordinator\PiagamPeserta\Http\PiagamPesertaController::class, 'show']);
            Route::post('/', [\App\Modules\Koordinator\PiagamPeserta\Http\PiagamPesertaController::class, 'store']);
            Route::put('/{id}', [\App\Modules\Koordinator\PiagamPeserta\Http\PiagamPesertaController::class, 'update']);
            Route::delete('/{id}', [\App\Modules\Koordinator\PiagamPeserta\Http\PiagamPesertaController::class, 'destroy']);
            Route::post('/{id}/publish', [\App\Modules\Koordinator\PiagamPeserta\Http\PiagamPesertaController::class, 'publish']);
        });
    }
}