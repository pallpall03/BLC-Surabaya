<?php

namespace App\Modules\Admin\Data\BukuTamu;

use App\Modules\Admin\Data\BukuTamu\Contracts\BukuTamuRepository;
use App\Modules\Admin\Data\BukuTamu\Infrastructure\EloquentBukuTamuRepository;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

final class BukuTamuServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(BukuTamuRepository::class, EloquentBukuTamuRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('buku-tamu')->group(function (): void {
            Route::get('/', [Http\BukuTamuController::class, 'index']);
            Route::post('/', [Http\BukuTamuController::class, 'store']);
            Route::get('/{id}', [Http\BukuTamuController::class, 'show']);
            Route::put('/{id}', [Http\BukuTamuController::class, 'update']);
            Route::patch('/{id}', [Http\BukuTamuController::class, 'update']);
            Route::delete('/{id}', [Http\BukuTamuController::class, 'destroy']);
        });
    }
}
