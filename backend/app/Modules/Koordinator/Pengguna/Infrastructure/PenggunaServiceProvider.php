<?php

namespace App\Modules\Koordinator\Pengguna\Infrastructure;

use Illuminate\Support\ServiceProvider;

class PenggunaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Modules\Koordinator\Pengguna\Contracts\PenggunaRepositoryInterface::class,
            \App\Modules\Koordinator\Pengguna\Infrastructure\PenggunaEloquentModel::class
        );
    }

    public function boot(): void
    {
        // Routes will be registered in separate ServiceProvider
    }
}