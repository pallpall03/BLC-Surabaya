<?php

namespace App\Modules\Admin\System\Menu;

use App\Modules\Admin\System\Menu\Contracts\MenuRepository;
use App\Modules\Admin\System\Menu\Infrastructure\EloquentMenuRepository;
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
            Route::get('/flat', [Http\MenuController::class, 'flat']);
            Route::post('/', [Http\MenuController::class, 'store']);
            Route::get('/{id}', [Http\MenuController::class, 'show']);
            Route::put('/{id}', [Http\MenuController::class, 'update']);
            Route::patch('/{id}', [Http\MenuController::class, 'update']);
            Route::delete('/{id}', [Http\MenuController::class, 'destroy']);
        });
    }
}
