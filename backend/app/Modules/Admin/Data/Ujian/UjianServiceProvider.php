<?php

namespace App\Modules\Admin\Data\Ujian;

use App\Modules\Admin\Data\Ujian\Contracts\UjianRepository;
use App\Modules\Admin\Data\Ujian\Infrastructure\EloquentUjianRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class UjianServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UjianRepository::class, EloquentUjianRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('ujian')->group(function (): void {
            Route::get('/', [Http\UjianController::class, 'index']);
            Route::get('/{id}', [Http\UjianController::class, 'show']);

            Route::middleware(['auth:api', 'role:superadmin'])->group(function (): void {
                Route::post('/', [Http\UjianController::class, 'store']);
                Route::put('/{id}', [Http\UjianController::class, 'update']);
                Route::patch('/{id}', [Http\UjianController::class, 'update']);
                Route::delete('/{id}', [Http\UjianController::class, 'destroy']);
            });
        });
    }
}
