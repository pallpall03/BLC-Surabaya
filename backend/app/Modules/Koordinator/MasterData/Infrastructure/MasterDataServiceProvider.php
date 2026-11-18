<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use Illuminate\Support\ServiceProvider;

class MasterDataServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Modules\Koordinator\MasterData\Contracts\MasterDataRepositoryInterface::class,
            \App\Modules\Koordinator\MasterData\Infrastructure\MasterDataEloquentModel::class
        );
    }

    public function boot(): void
    {
        // Routes will be registered in separate ServiceProvider
    }
}