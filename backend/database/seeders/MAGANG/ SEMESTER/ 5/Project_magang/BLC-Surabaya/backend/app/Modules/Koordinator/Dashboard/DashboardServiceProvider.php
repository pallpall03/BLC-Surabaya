<?php

namespace App\Modules\Koordinator\Dashboard;

use App\Modules\Koordinator\Dashboard\Contracts\DashboardRepository;
use App\Modules\Koordinator\Dashboard\Infrastructure\EloquentDashboardRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class DashboardServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DashboardRepository::class, EloquentDashboardRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('dashboard')->group(function (): void {
            Route::get('/', [Dashboard\Http\DashboardController::class, 'index']);
        });
    }
}