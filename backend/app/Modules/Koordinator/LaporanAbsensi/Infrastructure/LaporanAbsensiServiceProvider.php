<?php

namespace App\Modules\Koordinator\LaporanAbsensi\Infrastructure;

use Illuminate\Support\ServiceProvider;

class LaporanAbsensiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Modules\Koordinator\LaporanAbsensi\Contracts\LaporanAbsensiRepositoryInterface::class,
            \App\Modules\Koordinator\LaporanAbsensi\Infrastructure\LaporanAbsensiEloquentModel::class
        );
    }

    public function boot(): void
    {
        // Routes will be registered in separate ServiceProvider
    }
}