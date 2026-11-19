<?php

namespace App\Modules\Admin\Data\Modul;

use App\Modules\Admin\Data\Modul\Contracts\ModulRepository;
use App\Modules\Admin\Data\Modul\Infrastructure\EloquentModulRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class ModulServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ModulRepository::class, EloquentModulRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('modul')->group(function (): void {
            Route::get('/', [Http\ModulController::class, 'index']);
            Route::post('/', [Http\ModulController::class, 'store']);
            Route::get('/{id}', [Http\ModulController::class, 'show']);
            Route::put('/{id}', [Http\ModulController::class, 'update']);
            Route::patch('/{id}', [Http\ModulController::class, 'update']);
            Route::delete('/{id}', [Http\ModulController::class, 'destroy']);
        });
    }
}
