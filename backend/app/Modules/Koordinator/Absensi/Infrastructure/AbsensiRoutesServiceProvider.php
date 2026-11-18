<?php

namespace App\Modules\Koordinator\Absensi\Infrastructure;

use Illuminate\Support\Facades\Route;

class AbsensiRoutesServiceProvider
{
    public static function register(): void
    {
        Route::prefix('absensi')->group(function () {
            Route::get('/', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'index']);
            Route::get('/{id}', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'show']);
            Route::post('/', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'store']);
            Route::put('/{id}', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'update']);
            Route::delete('/{id}', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'destroy']);

            // Filter routes
            Route::get('/peserta/{pesertaId}', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'byPeserta']);
            Route::get('/sesi/{sesiId}', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'bySesi']);
            Route::get('/instruktur/{instrukturId}', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'byInstruktur']);
            Route::get('/lokasi-blc/{lokasiBlcId}', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'byLokasiBlc']);
            Route::get('/tanggal/{tanggal}', [\App\Modules\Koordinator\Absensi\Http\AbsensiController::class, 'byTanggal']);
        });
    }
}