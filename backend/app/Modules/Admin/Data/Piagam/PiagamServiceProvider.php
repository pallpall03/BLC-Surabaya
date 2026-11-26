<?php

namespace App\Modules\Admin\Data\Piagam;

use App\Modules\Admin\Data\Piagam\Contracts\PiagamRepository;
use App\Modules\Admin\Data\Piagam\Infrastructure\EloquentPiagamRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class PiagamServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PiagamRepository::class, EloquentPiagamRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('piagam')->group(function (): void {
            Route::get('/', [Http\PiagamController::class, 'index']);
            Route::get('/{id}', [Http\PiagamController::class, 'show']);

            Route::middleware(['auth:api', 'role:superadmin'])->group(function (): void {
                Route::post('/', [Http\PiagamController::class, 'store']);
                Route::put('/{id}', [Http\PiagamController::class, 'update']);
                Route::patch('/{id}', [Http\PiagamController::class, 'update']);
                Route::delete('/{id}', [Http\PiagamController::class, 'destroy']);
            });
        });
    }
}
