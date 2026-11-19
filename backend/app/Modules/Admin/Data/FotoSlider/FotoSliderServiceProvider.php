<?php

namespace App\Modules\Admin\Data\FotoSlider;

use App\Modules\Admin\Data\FotoSlider\Contracts\FotoSliderRepository;
use App\Modules\Admin\Data\FotoSlider\Infrastructure\EloquentFotoSliderRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class FotoSliderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(FotoSliderRepository::class, EloquentFotoSliderRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('foto-slider')->group(function (): void {
            Route::get('/', [Http\FotoSliderController::class, 'index']);
            Route::post('/', [Http\FotoSliderController::class, 'store']);
            Route::get('/{id}', [Http\FotoSliderController::class, 'show']);
            Route::put('/{id}', [Http\FotoSliderController::class, 'update']);
            Route::patch('/{id}', [Http\FotoSliderController::class, 'update']);
            Route::delete('/{id}', [Http\FotoSliderController::class, 'destroy']);
        });
    }
}
