<?php

namespace App\Modules\Koordinator\PiagamPeserta\Infrastructure;

use Illuminate\Support\ServiceProvider;

class PiagamPesertaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Modules\Koordinator\PiagamPeserta\Contracts\PiagamPesertaRepositoryInterface::class,
            \App\Modules\Koordinator\PiagamPeserta\Infrastructure\PiagamPesertaEloquentModel::class
        );
    }

    public function boot(): void
    {
        // Routes will be registered in separate ServiceProvider
    }
}