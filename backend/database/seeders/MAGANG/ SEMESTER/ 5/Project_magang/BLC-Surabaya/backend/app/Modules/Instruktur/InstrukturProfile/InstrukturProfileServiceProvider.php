<?php

namespace App\Modules\Instruktur\InstrukturProfile;

use App\Modules\Instruktur\InstrukturProfile\Contracts\InstrukturProfileRepository;
use App\Modules\Instruktur\InstrukturProfile\Infrastructure\EloquentInstrukturProfileRepository;
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
            Route::get('/', [InstrukturProfile\Http\InstrukturProfileController::class, 'index']);
            Route::get('/{id}', [InstrukturProfile\Http\InstrukturProfileController::class, 'show']);
            Route::post('/', [InstrukturProfile\Http\InstrukturProfileController::class, 'store']);
            Route::put('/{id}', [InstrukturProfile\Http\InstrukturProfileController::class, 'update']);
            Route::delete('/{id}', [InstrukturProfile\Http\InstrukturProfileController::class, 'destroy']);
        });
    }
}