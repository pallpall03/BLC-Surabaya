<?php

namespace App\Modules\Instruktur\DaftarHadir;

use App\Modules\Instruktur\DaftarHadir\Contracts\DaftarHadirRepository;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\EloquentDaftarHadirRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class DaftarHadirServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DaftarHadirRepository::class, EloquentDaftarHadirRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php (lihat ModuleRegistry).
     * Hanya role: instruktur.
     */
    public static function routes(): void
    {
        Route::middleware(['auth:sanctum', 'role:instruktur'])
            ->prefix('instruktur/daftar-hadir')
            ->group(function (): void {
                Route::get('/', [Http\DaftarHadirController::class, 'index']);
                Route::post('/', [Http\DaftarHadirController::class, 'store']);
            });
    }
}
