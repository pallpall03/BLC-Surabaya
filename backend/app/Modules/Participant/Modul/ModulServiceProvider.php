<?php

namespace App\Modules\Participant\Modul;

use App\Modules\Participant\Modul\Contracts\ModulRepository;
use App\Modules\Participant\Modul\Infrastructure\EloquentModulRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class ModulServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ModulRepository::class, EloquentModulRepository::class);
        // Use cases
        $this->app->bind(App\Modules\Participant\Modul\Application\ListModul::class);
        $this->app->bind(App\Modules\Participant\Modul\Application\GetModul::class);

    }

    public static function routes(): void
    {
        Route::prefix('peserta/modul')->group(function (): void {
            Route::get('/', [Http\ModulController::class, 'index']);
            Route::get('/{id}', [Http\ModulController::class, 'show']);

        });
    }
}
