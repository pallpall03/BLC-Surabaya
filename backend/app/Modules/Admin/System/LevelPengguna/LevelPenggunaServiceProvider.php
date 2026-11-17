<?php

namespace App\Modules\Admin\System\LevelPengguna;

use App\Modules\Admin\System\LevelPengguna\Contracts\LevelPenggunaRepository;
use App\Modules\Admin\System\LevelPengguna\Infrastructure\EloquentLevelPenggunaRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class LevelPenggunaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LevelPenggunaRepository::class, EloquentLevelPenggunaRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php, bukan dari boot(),
     * supaya rute tetap di dalam grup /api yang didaftarkan Laravel.
     */
    public static function routes(): void
    {
        Route::prefix('level-pengguna')->group(function (): void {
            Route::get('/', [Http\LevelPenggunaController::class, 'index']);
        });
    }
}
