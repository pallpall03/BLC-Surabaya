<?php

namespace App\Modules\Admin\System\KategoriMenu;

use App\Modules\Admin\System\KategoriMenu\Contracts\KategoriMenuRepository;
use App\Modules\Admin\System\KategoriMenu\Infrastructure\EloquentKategoriMenuRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class KategoriMenuServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KategoriMenuRepository::class, EloquentKategoriMenuRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('kategori-menu')->group(function (): void {
            Route::get('/', [Http\KategoriMenuController::class, 'index']);
        });
    }
}
