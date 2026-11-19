<?php

namespace App\Modules\Admin\Data\LokasiBlc;

use App\Modules\Admin\Data\LokasiBlc\Contracts\LokasiBlcRepository;
use App\Modules\Admin\Data\LokasiBlc\Infrastructure\EloquentLokasiBlcRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class LokasiBlcServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LokasiBlcRepository::class, EloquentLokasiBlcRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('lokasi-blc')->group(function (): void {
            Route::get('/', [Http\LokasiBlcController::class, 'index']);
            Route::post('/', [Http\LokasiBlcController::class, 'store']);
            Route::get('/{id}', [Http\LokasiBlcController::class, 'show']);
            Route::put('/{id}', [Http\LokasiBlcController::class, 'update']);
            Route::patch('/{id}', [Http\LokasiBlcController::class, 'update']);
            Route::delete('/{id}', [Http\LokasiBlcController::class, 'destroy']);
        });
    }
}
