<?php

namespace App\Modules\Admin\Data\Testimoni;

use App\Modules\Admin\Data\Testimoni\Contracts\TestimoniRepository;
use App\Modules\Admin\Data\Testimoni\Infrastructure\EloquentTestimoniRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class TestimoniServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TestimoniRepository::class, EloquentTestimoniRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('testimoni')->group(function (): void {
            Route::get('/', [Http\TestimoniController::class, 'index']);
<<<<<<< HEAD
=======
            Route::get('/aktif', [Http\TestimoniController::class, 'aktif']);
            Route::post('/', [Http\TestimoniController::class, 'store']);
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
            Route::get('/{id}', [Http\TestimoniController::class, 'show']);

            Route::middleware(['auth:api', 'role:superadmin'])->group(function (): void {
                Route::post('/', [Http\TestimoniController::class, 'store']);
                Route::put('/{id}', [Http\TestimoniController::class, 'update']);
                Route::patch('/{id}', [Http\TestimoniController::class, 'update']);
                Route::delete('/{id}', [Http\TestimoniController::class, 'destroy']);
            });
        });
    }
}
