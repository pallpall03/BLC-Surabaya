<?php

namespace App\Shared\Support;

/** Daftar semua modul. Dipakai untuk mendaftarkan route dan provider tanpa mengedit banyak file setiap kali ada modul baru. */
final class ModuleRegistry
{
    /** @return list<class-string> */
    public static function providers(): array
    {
        return [
            // Auth (login/register)
            \App\Modules\Auth\AuthServiceProvider::class,
            // Admin - Data (konten landing page)
            \App\Modules\Admin\Data\Artikel\ArtikelServiceProvider::class,
            \App\Modules\Admin\Data\Faq\FaqServiceProvider::class,
            \App\Modules\Admin\Data\FotoSlider\FotoSliderServiceProvider::class,
            \App\Modules\Admin\Data\KategoriArtikel\KategoriArtikelServiceProvider::class,
            \App\Modules\Admin\Data\LokasiBlc\LokasiBlcServiceProvider::class,
            \App\Modules\Admin\Data\Testimoni\TestimoniServiceProvider::class,
            \App\Modules\Admin\Data\TimBlc\TimBlcServiceProvider::class,
            \App\Modules\Admin\Data\Modul\ModulServiceProvider::class,
            \App\Modules\Admin\Data\Ujian\UjianServiceProvider::class,
            \App\Modules\Admin\Data\Piagam\PiagamServiceProvider::class,
            // Admin - Konten (replaces KontenUtama + SubKonten)
            \App\Modules\Admin\Konten\KontenServiceProvider::class,
            // Admin - System (pengaturan sistem/user)
            \App\Modules\Admin\System\Menu\MenuServiceProvider::class,
            \App\Modules\Admin\System\MenuAkses\MenuAksesServiceProvider::class,
            // Participant (portal peserta login)
            \App\Modules\Participant\Modul\ModulServiceProvider::class,
            \App\Modules\Participant\Ujian\UjianServiceProvider::class,
            \App\Modules\Participant\Piagam\PiagamServiceProvider::class,
            // Instruktur
            \App\Modules\Instruktur\DaftarPeserta\DaftarPesertaServiceProvider::class,
            \App\Modules\Instruktur\DaftarHadir\DaftarHadirServiceProvider::class,
            \App\Modules\Instruktur\Laporan\LaporanServiceProvider::class,
            \App\Modules\Instruktur\Ujian\UjianServiceProvider::class,
            // Koordinator
            \App\Modules\Koordinator\KoordinatorProfile\Infrastructure\KoordinatorProfileServiceProvider::class,
            \App\Modules\Koordinator\Monitoring\MonitoringServiceProvider::class,
            \App\Modules\Koordinator\Laporan\LaporanServiceProvider::class,
        ];
    }
}
