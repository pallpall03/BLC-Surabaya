<?php

namespace App\Modules\Koordinator\Absensi\Infrastructure;

use Illuminate\Support\ServiceProvider;

class AbsensiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Modules\Koordinator\Absensi\Contracts\AbsensiRepositoryInterface::class,
            \App\Modules\Koordinator\Absensi\Infrastructure\AbsensiEloquentModel::class
        );
    }

    public function boot(): void
    {
        // Routes will be registered in separate ServiceProvider
    }
}