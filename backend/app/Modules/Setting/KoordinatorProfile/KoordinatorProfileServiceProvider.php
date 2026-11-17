<?php

namespace App\Modules\Setting\KoordinatorProfile;

use App\Modules\Setting\KoordinatorProfile\Contracts\KoordinatorProfileRepository;
use App\Modules\Setting\KoordinatorProfile\Infrastructure\EloquentKoordinatorProfileRepository;
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
            Route::get('/', [Http\KoordinatorProfileController::class, 'index']);
        });
    }
}