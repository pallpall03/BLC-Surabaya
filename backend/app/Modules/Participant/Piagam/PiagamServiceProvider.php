<?php

namespace App\Modules\Participant\Piagam;

use App\Modules\Participant\Piagam\Contracts\PiagamRepository;
use App\Modules\Participant\Piagam\Infrastructure\EloquentPiagamRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class PiagamServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PiagamRepository::class, EloquentPiagamRepository::class);
        // Use cases
        $this->app->bind(App\Modules\Participant\Piagam\Application\ListPiagam::class);
        $this->app->bind(App\Modules\Participant\Piagam\Application\GetPiagam::class);

    }

    public static function routes(): void
    {
        Route::prefix('peserta/piagam')->group(function (): void {
            Route::get('/', [Http\PiagamController::class, 'index']);
            Route::get('/{id}', [Http\PiagamController::class, 'show']);

        });
    }
}
