<?php

namespace App\Modules\Admin\System\Pengguna;

use App\Modules\Admin\System\Pengguna\Contracts\PenggunaRepository;
use App\Modules\Admin\System\Pengguna\Infrastructure\EloquentPenggunaRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class PenggunaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PenggunaRepository::class, EloquentPenggunaRepository::class);
    }

    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role:superadmin'])
            ->prefix('users')
            ->group(function (): void {
                Route::get('/', [Http\PenggunaController::class, 'index']);
                Route::post('/', [Http\PenggunaController::class, 'store']);
                Route::get('/{id}', [Http\PenggunaController::class, 'show']);
                Route::put('/{id}', [Http\PenggunaController::class, 'update']);
                Route::patch('/{id}', [Http\PenggunaController::class, 'update']);
                Route::delete('/{id}', [Http\PenggunaController::class, 'destroy']);
            });
    }
}