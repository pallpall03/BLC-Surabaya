<?php

namespace App\Modules\Instruktur\InstrukturProfile;

use App\Modules\Instruktur\InstrukturProfile\Contracts\InstrukturProfileRepository;
use App\Modules\Instruktur\InstrukturProfile\Infrastructure\EloquentInstrukturProfileRepository;
use Illuminate\Support\ServiceProvider;

final class InstrukturProfileServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            InstrukturProfileRepository::class,
            EloquentInstrukturProfileRepository::class,
        );
    }

    public function boot(): void
    {
        //
    }
}