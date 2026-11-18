<?php

namespace App\Modules\Koordinator\Infrastructure;

use Illuminate\Support\ServiceProvider;

class KoordinatorServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register MasterData module
        $this->app->register(\App\Modules\Koordinator\MasterData\Infrastructure\MasterDataServiceProvider::class);

        // Register Absensi module
        $this->app->register(\App\Modules\Koordinator\Absensi\Infrastructure\AbsensiServiceProvider::class);

        // Register LaporanAbsensi module
        $this->app->register(\App\Modules\Koordinator\LaporanAbsensi\Infrastructure\LaporanAbsensiServiceProvider::class);

        // Register PiagamPeserta module
        $this->app->register(\App\Modules\Koordinator\PiagamPeserta\Infrastructure\PiagamPesertaServiceProvider::class);

        // Register Pengguna module
        $this->app->register(\App\Modules\Koordinator\Pengguna\Infrastructure\PenggunaServiceProvider::class);
    }

    public function boot(): void
    {
        // Register routes from all sub-modules
        \App\Modules\Koordinator\MasterData\Infrastructure\MasterDataRoutesServiceProvider::register();
        \App\Modules\Koordinator\Absensi\Infrastructure\AbsensiRoutesServiceProvider::register();
        \App\Modules\Koordinator\LaporanAbsensi\Infrastructure\LaporanAbsensiRoutesServiceProvider::register();
        \App\Modules\Koordinator\PiagamPeserta\Infrastructure\PiagamPesertaRoutesServiceProvider::register();
        \App\Modules\Koordinator\Pengguna\Infrastructure\PenggunaRoutesServiceProvider::register();
    }
}