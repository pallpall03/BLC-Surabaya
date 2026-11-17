<?php

namespace App\Modules\Data\Testimoni;

use App\Modules\Data\Testimoni\Contracts\TestimoniRepository;
use App\Modules\Data\Testimoni\Infrastructure\EloquentTestimoniRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class TestimoniServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TestimoniRepository::class, EloquentTestimoniRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('testimoni')->group(function (): void {
            Route::get('/', [Http\TestimoniController::class, 'index']);
        });
    }
}
