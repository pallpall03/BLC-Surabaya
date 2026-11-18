<?php

namespace App\Shared\Support;

use Illuminate\Support\ServiceProvider;

final class ModuleRegistry extends ServiceProvider
{
    public function register(): void
    {
        // Instruktur modules
        $this->app->register(\App\Modules\Instruktur\Kelas\KelasServiceProvider::class);
        $this->app->register(\App\Modules\Instruktur\Peserta\PesertaServiceProvider::class);
        $this->app->register(\App\Modules\Instruktur\Materi\MateriServiceProvider::class);
        $this->app->register(\App\Modules\Instruktur\Ujian\UjianServiceProvider::class);
        $this->app->register(\App\Modules\Instruktur\Absensi\AbsensiServiceProvider::class);
        $this->app->register(\App\Modules\Instruktur\LaporanKegiatan\LaporanKegiatanServiceProvider::class);
        
        // Koordinator modules
        $this->app->register(\App\Modules\Koordinator\Dashboard\DashboardServiceProvider::class);
        $this->app->register(\App\Modules\Koordinator\RekapPesertaPengunjung\RekapPesertaPengunjungServiceProvider::class);
        $this->app->register(\App\Modules\Koordinator\MasterUjian\MasterUjianServiceProvider::class);
        $this->app->register(\App\Modules\Koordinator\KategoriPeserta\KategoriPesertaServiceProvider::class);
    }

    public static function providers(): array
    {
        return [
            \App\Modules\Instruktur\Kelas\KelasServiceProvider::class,
            \App\Modules\Instruktur\Peserta\PesertaServiceProvider::class,
            \App\Modules\Instruktur\Materi\MateriServiceProvider::class,
            \App\Modules\Instruktur\Ujian\UjianServiceProvider::class,
            \App\Modules\Instruktur\Absensi\AbsensiServiceProvider::class,
            \App\Modules\Instruktur\LaporanKegiatan\LaporanKegiatanServiceProvider::class,
            \App\Modules\Koordinator\Dashboard\DashboardServiceProvider::class,
            \App\Modules\Koordinator\RekapPesertaPengunjung\RekapPesertaPengunjungServiceProvider::class,
            \App\Modules\Koordinator\MasterUjian\MasterUjianServiceProvider::class,
            \App\Modules\Koordinator\KategoriPeserta\KategoriPesertaServiceProvider::class,
        ];
    }
}
}