<?php

namespace App\Modules\Admin\Data\TimBlc;

use App\Modules\Admin\Data\TimBlc\Contracts\TimBlcRepository;
use App\Modules\Admin\Data\TimBlc\Infrastructure\EloquentTimBlcRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class TimBlcServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TimBlcRepository::class, EloquentTimBlcRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('tim-blc')->group(function (): void {
            Route::get('/', [Http\TimBlcController::class, 'index']);
        });
    }
}
