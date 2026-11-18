<?php

namespace App\Modules\Instruktur\InstrukturProfile;

use Illuminate\Support\ServiceProvider;

class InstrukturProfileServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Modules\Instruktur\InstrukturProfile\Contracts\InstrukturProfileRepositoryInterface::class,
            \App\Modules\Instruktur\InstrukturProfile\Infrastructure\EloquentInstrukturProfileRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}