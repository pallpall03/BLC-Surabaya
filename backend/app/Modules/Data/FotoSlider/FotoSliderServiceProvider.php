<?php

namespace App\Modules\Data\FotoSlider;

use App\Modules\Data\FotoSlider\Contracts\FotoSliderRepository;
use App\Modules\Data\FotoSlider\Infrastructure\EloquentFotoSliderRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class FotoSliderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(FotoSliderRepository::class, EloquentFotoSliderRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('foto-slider')->group(function (): void {
            Route::get('/', [Http\FotoSliderController::class, 'index']);
        });
    }
}
