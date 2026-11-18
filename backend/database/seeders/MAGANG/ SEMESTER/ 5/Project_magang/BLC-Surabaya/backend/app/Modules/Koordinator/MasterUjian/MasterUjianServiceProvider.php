<?php

namespace App\Modules\Koordinator\MasterUjian;

use App\Modules\Koordinator\MasterUjian\Contracts\MasterUjianRepository;
use App\Modules\Koordinator\MasterUjian\Infrastructure\EloquentMasterUjianRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class MasterUjianServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MasterUjianRepository::class, EloquentMasterUjianRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('master-ujian')->group(function (): void {
            Route::get('/', [MasterUjian\Http\MasterUjianController::class, 'index']);
            Route::get('/{id}', [MasterUjian\Http\MasterUjianController::class, 'show']);
            Route::post('/', [MasterUjian\Http\MasterUjianController::class, 'store']);
            Route::put('/{id}', [MasterUjian\Http\MasterUjianController::class, 'update']);
            Route::delete('/{id}', [MasterUjian\Http\MasterUjianController::class, 'destroy']);
        });
    }
}