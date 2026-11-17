<?php

namespace App\Modules\Setting\InstrukturProfile;

use App\Modules\Setting\InstrukturProfile\Contracts\InstrukturProfileRepository;
use App\Modules\Setting\InstrukturProfile\Infrastructure\EloquentInstrukturProfileRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class InstrukturProfileServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(InstrukturProfileRepository::class, EloquentInstrukturProfileRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('instruktur-profile')->group(function (): void {
            Route::get('/', [Http\InstrukturProfileController::class, 'index']);
        });
    }
}