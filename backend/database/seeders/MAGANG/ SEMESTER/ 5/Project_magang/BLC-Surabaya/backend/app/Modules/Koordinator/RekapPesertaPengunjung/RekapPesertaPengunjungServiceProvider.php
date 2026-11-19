<?php

namespace App\Modules\Koordinator\RekapPesertaPengunjung;

use App\Modules\Koordinator\RekapPesertaPengunjung\Contracts\RekapPesertaPengunjungRepository;
use App\Modules\Koordinator\RekapPesertaPengunjung\Infrastructure\EloquentRekapPesertaPengunjungRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class RekapPesertaPengunjungServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(RekapPesertaPengunjungRepository::class, EloquentRekapPesertaPengunjungRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('rekap-peserta-pengunjung')->group(function (): void {
            Route::get('/', [RekapPesertaPengunjung\Http\RekapPesertaPengunjungController::class, 'index']);
            Route::get('/{id}', [RekapPesertaPengunjung\Http\RekapPesertaPengunjungController::class, 'show']);
            Route::post('/', [RekapPesertaPengunjung\Http\RekapPesertaPengunjungController::class, 'store']);
            Route::put('/{id}', [RekapPesertaPengunjung\Http\RekapPesertaPengunjungController::class, 'update']);
            Route::delete('/{id}', [RekapPesertaPengunjung\Http\RekapPesertaPengunjungController::class, 'destroy']);
        });
    }
}