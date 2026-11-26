<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use Illuminate\Support\Facades\Route;

class MasterDataRoutesServiceProvider
{
    public static function register(): void
    {
        Route::middleware(['auth:api', 'role:koordinator'])->prefix('master-data')->group(function () {
            // Master Data overview
            Route::get('/', [\App\Modules\Koordinator\MasterData\Http\MasterDataController::class, 'index']);
            Route::post('/', [\App\Modules\Koordinator\MasterData\Http\MasterDataController::class, 'store']);

            // Sub-entities with their own controllers
            Route::prefix('instruktur')->group(function () {
                Route::get('/', [\App\Modules\Koordinator\MasterData\Http\InstrukturController::class, 'index']);
                Route::get('/{id}', [\App\Modules\Koordinator\MasterData\Http\InstrukturController::class, 'show']);
                Route::post('/', [\App\Modules\Koordinator\MasterData\Http\InstrukturController::class, 'store']);
                Route::put('/{id}', [\App\Modules\Koordinator\MasterData\Http\InstrukturController::class, 'update']);
                Route::delete('/{id}', [\App\Modules\Koordinator\MasterData\Http\InstrukturController::class, 'destroy']);
            });

            Route::prefix('instruktur-area')->group(function () {
                Route::get('/', [\App\Modules\Koordinator\MasterData\Http\InstrukturAreaController::class, 'index']);
                Route::get('/{id}', [\App\Modules\Koordinator\MasterData\Http\InstrukturAreaController::class, 'show']);
                Route::post('/', [\App\Modules\Koordinator\MasterData\Http\InstrukturAreaController::class, 'store']);
                Route::put('/{id}', [\App\Modules\Koordinator\MasterData\Http\InstrukturAreaController::class, 'update']);
                Route::delete('/{id}', [\App\Modules\Koordinator\MasterData\Http\InstrukturAreaController::class, 'destroy']);
            });

            Route::prefix('blc-area')->group(function () {
                Route::get('/', [\App\Modules\Koordinator\MasterData\Http\BlcAreaController::class, 'index']);
                Route::get('/{id}', [\App\Modules\Koordinator\MasterData\Http\BlcAreaController::class, 'show']);
                Route::post('/', [\App\Modules\Koordinator\MasterData\Http\BlcAreaController::class, 'store']);
                Route::put('/{id}', [\App\Modules\Koordinator\MasterData\Http\BlcAreaController::class, 'update']);
                Route::delete('/{id}', [\App\Modules\Koordinator\MasterData\Http\BlcAreaController::class, 'destroy']);
            });

            Route::prefix('materi')->group(function () {
                Route::get('/', [\App\Modules\Koordinator\MasterData\Http\MateriController::class, 'index']);
                Route::get('/{id}', [\App\Modules\Koordinator\MasterData\Http\MateriController::class, 'show']);
                Route::post('/', [\App\Modules\Koordinator\MasterData\Http\MateriController::class, 'store']);
                Route::put('/{id}', [\App\Modules\Koordinator\MasterData\Http\MateriController::class, 'update']);
                Route::delete('/{id}', [\App\Modules\Koordinator\MasterData\Http\MateriController::class, 'destroy']);
            });

            Route::prefix('materi-per-pertemuan')->group(function () {
                Route::get('/', [\App\Modules\Koordinator\MasterData\Http\MateriPerPertemuanController::class, 'index']);
                Route::get('/{id}', [\App\Modules\Koordinator\MasterData\Http\MateriPerPertemuanController::class, 'show']);
                Route::post('/', [\App\Modules\Koordinator\MasterData\Http\MateriPerPertemuanController::class, 'store']);
                Route::put('/{id}', [\App\Modules\Koordinator\MasterData\Http\MateriPerPertemuanController::class, 'update']);
                Route::delete('/{id}', [\App\Modules\Koordinator\MasterData\Http\MateriPerPertemuanController::class, 'destroy']);
            });

            Route::prefix('kategori-peserta')->group(function () {
                Route::get('/', [\App\Modules\Koordinator\MasterData\Http\KategoriPesertaController::class, 'index']);
                Route::get('/{id}', [\App\Modules\Koordinator\MasterData\Http\KategoriPesertaController::class, 'show']);
                Route::post('/', [\App\Modules\Koordinator\MasterData\Http\KategoriPesertaController::class, 'store']);
                Route::put('/{id}', [\App\Modules\Koordinator\MasterData\Http\KategoriPesertaController::class, 'update']);
                Route::delete('/{id}', [\App\Modules\Koordinator\MasterData\Http\KategoriPesertaController::class, 'destroy']);
            });

            Route::prefix('sesi')->group(function () {
                Route::get('/', [\App\Modules\Koordinator\MasterData\Http\SesiController::class, 'index']);
                Route::get('/{id}', [\App\Modules\Koordinator\MasterData\Http\SesiController::class, 'show']);
                Route::post('/', [\App\Modules\Koordinator\MasterData\Http\SesiController::class, 'store']);
                Route::put('/{id}', [\App\Modules\Koordinator\MasterData\Http\SesiController::class, 'update']);
                Route::delete('/{id}', [\App\Modules\Koordinator\MasterData\Http\SesiController::class, 'destroy']);
            });

            Route::prefix('soal')->group(function () {
                Route::get('/', [\App\Modules\Koordinator\MasterData\Http\SoalController::class, 'index']);
                Route::get('/{id}', [\App\Modules\Koordinator\MasterData\Http\SoalController::class, 'show']);
                Route::post('/', [\App\Modules\Koordinator\MasterData\Http\SoalController::class, 'store']);
                Route::put('/{id}', [\App\Modules\Koordinator\MasterData\Http\SoalController::class, 'update']);
                Route::delete('/{id}', [\App\Modules\Koordinator\MasterData\Http\SoalController::class, 'destroy']);
            });

            Route::prefix('modul')->group(function () {
                Route::get('/', [\App\Modules\Koordinator\MasterData\Http\ModulController::class, 'index']);
                Route::get('/{id}', [\App\Modules\Koordinator\MasterData\Http\ModulController::class, 'show']);
                Route::post('/', [\App\Modules\Koordinator\MasterData\Http\ModulController::class, 'store']);
                Route::put('/{id}', [\App\Modules\Koordinator\MasterData\Http\ModulController::class, 'update']);
                Route::delete('/{id}', [\App\Modules\Koordinator\MasterData\Http\ModulController::class, 'destroy']);
            });

            Route::get('/{namaModul}', [\App\Modules\Koordinator\MasterData\Http\MasterDataController::class, 'show']);
            Route::put('/{namaModul}', [\App\Modules\Koordinator\MasterData\Http\MasterDataController::class, 'update']);
            Route::delete('/{namaModul}', [\App\Modules\Koordinator\MasterData\Http\MasterDataController::class, 'destroy']);
        });
    }
}