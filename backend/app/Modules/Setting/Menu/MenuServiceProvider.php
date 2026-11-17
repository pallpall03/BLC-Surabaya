<?php

namespace App\Modules\Setting\Menu;

use App\Modules\Setting\Menu\Contracts\MenuRepository;
use App\Modules\Setting\Menu\Infrastructure\EloquentMenuRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class MenuServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MenuRepository::class, EloquentMenuRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('menu')->group(function (): void {
            Route::get('/', [Http\MenuController::class, 'index']);
        });
    }
}
