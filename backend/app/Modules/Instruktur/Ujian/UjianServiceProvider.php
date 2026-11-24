<?php

namespace App\Modules\Instruktur\Ujian;

use App\Modules\Instruktur\Ujian\Contracts\UjianRepository;
use App\Modules\Instruktur\Ujian\Infrastructure\EloquentUjianRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class UjianServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UjianRepository::class, EloquentUjianRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php (lihat ModuleRegistry).
     * Hanya role: instruktur.
     */
    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role.path'])
            ->prefix('instruktur/ujian')
            ->group(function (): void {
                Route::get('/', [Http\UjianController::class, 'index']);
            });
    }
}
