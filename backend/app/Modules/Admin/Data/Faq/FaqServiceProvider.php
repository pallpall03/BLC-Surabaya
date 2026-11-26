<?php

namespace App\Modules\Admin\Data\Faq;

use App\Modules\Admin\Data\Faq\Contracts\FaqRepository;
use App\Modules\Admin\Data\Faq\Infrastructure\EloquentFaqRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class FaqServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(FaqRepository::class, EloquentFaqRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('faq')->group(function (): void {
            Route::get('/', [Http\FaqController::class, 'index']);
            Route::get('/kategori/{kategori}', [Http\FaqController::class, 'byKategori']);
            Route::get('/{id}', [Http\FaqController::class, 'show']);

            Route::middleware(['auth:api', 'role:superadmin'])->group(function (): void {
                Route::post('/', [Http\FaqController::class, 'store']);
                Route::put('/{id}', [Http\FaqController::class, 'update']);
                Route::patch('/{id}', [Http\FaqController::class, 'update']);
                Route::delete('/{id}', [Http\FaqController::class, 'destroy']);
            });
        });
    }
}
