<?php

namespace App\Modules\Admin\KontenStatis\SubKonten;

use App\Modules\Admin\KontenStatis\SubKonten\Contracts\SubKontenRepository;
use App\Modules\Admin\KontenStatis\SubKonten\Infrastructure\EloquentSubKontenRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class SubKontenServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SubKontenRepository::class, EloquentSubKontenRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('sub-konten')->group(function (): void {
            Route::get('/', [Http\SubKontenController::class, 'index']);
        });
    }
}
