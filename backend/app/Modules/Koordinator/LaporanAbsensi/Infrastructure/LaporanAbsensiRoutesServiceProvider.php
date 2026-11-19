<?php

namespace App\Modules\Koordinator\LaporanAbsensi\Infrastructure;

use Illuminate\Support\Facades\Route;

class LaporanAbsensiRoutesServiceProvider
{
    public static function register(): void
    {
        Route::prefix('laporan-absensi')->group(function () {
            Route::get('/', [\App\Modules\Koordinator\LaporanAbsensi\Http\LaporanAbsensiController::class, 'index']);
            Route::get('/{id}', [\App\Modules\Koordinator\LaporanAbsensi\Http\LaporanAbsensiController::class, 'show']);
            Route::post('/', [\App\Modules\Koordinator\LaporanAbsensi\Http\LaporanAbsensiController::class, 'store']);
            Route::put('/{id}', [\App\Modules\Koordinator\LaporanAbsensi\Http\LaporanAbsensiController::class, 'update']);
            Route::delete('/{id}', [\App\Modules\Koordinator\LaporanAbsensi\Http\LaporanAbsensiController::class, 'destroy']);

            // Generate laporan route
            Route::get('/generate/{sesiId}/{periodeMulai}/{periodeAkhir}', [\App\Modules\Koordinator\LaporanAbsensi\Http\LaporanAbsensiController::class, 'generate']);
        });
    }
}