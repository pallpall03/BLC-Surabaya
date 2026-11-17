<?php

namespace App\Modules\Admin\Data\KategoriArtikel;

use App\Modules\Admin\Data\KategoriArtikel\Contracts\KategoriArtikelRepository;
use App\Modules\Admin\Data\KategoriArtikel\Infrastructure\EloquentKategoriArtikelRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class KategoriArtikelServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KategoriArtikelRepository::class, EloquentKategoriArtikelRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('kategori-artikel')->group(function (): void {
            Route::get('/', [Http\KategoriArtikelController::class, 'index']);
        });
    }
}
