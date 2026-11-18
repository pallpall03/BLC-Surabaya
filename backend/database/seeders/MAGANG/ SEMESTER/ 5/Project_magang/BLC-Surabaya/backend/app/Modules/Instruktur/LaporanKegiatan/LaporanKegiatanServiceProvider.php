<?php

namespace App\Modules\Instruktur\LaporanKegiatan;

use App\Modules\Instruktur\LaporanKegiatan\Contracts\LaporanKegiatanRepository;
use App\Modules\Instruktur\LaporanKegiatan\Infrastructure\EloquentLaporanKegiatanRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class LaporanKegiatanServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LaporanKegiatanRepository::class, EloquentLaporanKegiatanRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('laporan-kegiatan')->group(function (): void {
            Route::get('/', [LaporanKegiatan\Http\LaporanKegiatanController::class, 'index']);
            Route::get('/{id}', [LaporanKegiatan\Http\LaporanKegiatanController::class, 'show']);
            Route::post('/', [LaporanKegiatan\Http\LaporanKegiatanController::class, 'store']);
            Route::put('/{id}', [LaporanKegiatan\Http\LaporanKegiatanController::class, 'update']);
            Route::delete('/{id}', [LaporanKegiatan\Http\LaporanKegiatanController::class, 'destroy']);
        });
    }
}