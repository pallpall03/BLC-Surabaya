<?php

namespace App\Modules\Koordinator\KoordinatorProfile;

use App\Modules\Koordinator\KoordinatorProfile\Contracts\KoordinatorProfileRepository;
use App\Modules\Koordinator\KoordinatorProfile\Infrastructure\EloquentKoordinatorProfileRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class KoordinatorProfileServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KoordinatorProfileRepository::class, EloquentKoordinatorProfileRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('koordinator-profile')->group(function (): void {
            Route::get('/', [KoordinatorProfile\Http\KoordinatorProfileController::class, 'index']);
            Route::get('/{id}', [KoordinatorProfile\Http\KoordinatorProfileController::class, 'show']);
            Route::post('/', [KoordinatorProfile\Http\KoordinatorProfileController::class, 'store']);
            Route::put('/{id}', [KoordinatorProfile\Http\KoordinatorProfileController::class, 'update']);
            Route::delete('/{id}', [KoordinatorProfile\Http\KoordinatorProfileController::class, 'destroy']);
        });
    }
}