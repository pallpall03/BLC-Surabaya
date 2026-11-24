<?php

namespace App\Modules\Admin\System\MenuAkses;

use App\Modules\Admin\System\MenuAkses\Contracts\MenuAksesRepository;
use App\Modules\Admin\System\MenuAkses\Infrastructure\EloquentMenuAksesRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class MenuAksesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MenuAksesRepository::class, EloquentMenuAksesRepository::class);
    }

    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role:superadmin'])
            ->prefix('menu-akses')
            ->group(function (): void {
                Route::get('/', [Http\MenuAksesController::class, 'index']);
                Route::get('/role/{roleId}', [Http\MenuAksesController::class, 'byRole']);
                Route::post('/', [Http\MenuAksesController::class, 'store']);
                Route::get('/{id}', [Http\MenuAksesController::class, 'show']);
                Route::put('/{id}', [Http\MenuAksesController::class, 'update']);
                Route::patch('/{id}', [Http\MenuAksesController::class, 'update']);
                Route::delete('/{id}', [Http\MenuAksesController::class, 'destroy']);
                Route::post('/sync/{roleId}', [Http\MenuAksesController::class, 'sync']);
            });
    }
}