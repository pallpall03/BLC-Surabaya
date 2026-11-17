<?php

namespace App\Modules\Data\Faq;

use App\Modules\Data\Faq\Contracts\FaqRepository;
use App\Modules\Data\Faq\Infrastructure\EloquentFaqRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class FaqServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(FaqRepository::class, EloquentFaqRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('faq')->group(function (): void {
            Route::get('/', [Http\FaqController::class, 'index']);
        });
    }
}
