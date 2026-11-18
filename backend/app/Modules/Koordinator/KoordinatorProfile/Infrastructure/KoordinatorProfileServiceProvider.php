<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Infrastructure;

use Illuminate\Support\ServiceProvider;

class KoordinatorProfileServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Modules\Koordinator\KoordinatorProfile\Contracts\KoordinatorProfileRepositoryInterface::class,
            \App\Modules\Koordinator\KoordinatorProfile\Infrastructure\EloquentKoordinatorProfileRepository::class
        );
    }

    public static function routes(): void
    {
        require_once __DIR__ . '/../Http/KoordinatorProfileRoutesServiceProvider.php';
    }

    public function boot(): void
    {
        //
    }
}