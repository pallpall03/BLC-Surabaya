<?php

namespace App\Shared\Support;

/**
 * Daftar modul admin. Dipakai untuk mendaftarkan route dan provider
 * tanpa mengedit banyak file setiap kali ada modul baru.
 */
final class ModuleRegistry
{
    /**
     * @return list<class-string>
     */
    public static function providers(): array
    {
        return [
            // Data (Landing Page)
            \App\Modules\Data\Artikel\ArtikelServiceProvider::class,
            \App\Modules\Data\Faq\FaqServiceProvider::class,
            \App\Modules\Data\FotoSlider\FotoSliderServiceProvider::class,
            \App\Modules\Data\KategoriArtikel\KategoriArtikelServiceProvider::class,
            \App\Modules\Data\LokasiBlc\LokasiBlcServiceProvider::class,
            \App\Modules\Data\Testimoni\TestimoniServiceProvider::class,
            \App\Modules\Data\TimBlc\TimBlcServiceProvider::class,

            // Konten Statis
            \App\Modules\KontenStatis\KontenUtama\KontenUtamaServiceProvider::class,
            \App\Modules\KontenStatis\SubKonten\SubKontenServiceProvider::class,

            // Setting (RBAC)
            \App\Modules\Setting\HakAkses\HakAksesServiceProvider::class,
            \App\Modules\Setting\KategoriMenu\KategoriMenuServiceProvider::class,
            \App\Modules\Setting\LevelPengguna\LevelPenggunaServiceProvider::class,
            \App\Modules\Setting\Menu\MenuServiceProvider::class,
            \App\Modules\Setting\Pengguna\PenggunaServiceProvider::class,

            // Instruktur Role
            \App\Modules\Instruktur\Sesi\SesiServiceProvider::class,
            \App\Modules\Instruktur\Kelas\KelasServiceProvider::class,
            \App\Modules\Instruktur\Peserta\PesertaServiceProvider::class,
            \App\Modules\Instruktur\Materi\MateriServiceProvider::class,
            \App\Modules\Instruktur\Ujian\UjianServiceProvider::class,
            \App\Modules\Instruktur\Absensi\AbsensiServiceProvider::class,
            \App\Modules\Instruktur\LaporanKegiatan\LaporanKegiatanServiceProvider::class,
            \App\Modules\Instruktur\InstrukturProfile\InstrukturProfileServiceProvider::class,

            // Koordinator Role
            \App\Modules\Koordinator\Dashboard\DashboardServiceProvider::class,
            \App\Modules\Koordinator\RekapPesertaPengunjung\RekapPesertaPengunjungServiceProvider::class,
            \App\Modules\Koordinator\MasterUjian\MasterUjianServiceProvider::class,
            \App\Modules\Koordinator\KategoriPeserta\KategoriPesertaServiceProvider::class,
            \App\Modules\Koordinator\KoordinatorProfile\KoordinatorProfileServiceProvider::class,
        ];
    }
}