<?php

namespace App\Modules\Instruktur\Laporan;

use App\Modules\Instruktur\Laporan\Contracts\LaporanRepository;
use App\Modules\Instruktur\Laporan\Infrastructure\EloquentLaporanRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class LaporanServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LaporanRepository::class, EloquentLaporanRepository::class);
    }

    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role:instruktur'])
            ->prefix('instruktur/laporan')
            ->group(function (): void {
                Route::get('/', [Http\LaporanController::class, 'index']);
                Route::get('/rekap', [Http\LaporanController::class, 'rekap']);
                Route::get('/opsi', [Http\LaporanController::class, 'opsi']);
                Route::post('/', [Http\LaporanController::class, 'store']);
                Route::get('/{id}', [Http\LaporanController::class, 'show'])->whereNumber('id');
                Route::match(['put', 'patch'], '/{id}', [Http\LaporanController::class, 'update'])->whereNumber('id');
                Route::delete('/{id}', [Http\LaporanController::class, 'destroy'])->whereNumber('id');
            });
    }
}
