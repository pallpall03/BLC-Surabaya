<?php

namespace App\Modules\Instruktur\DaftarPeserta;

use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;
use App\Modules\Instruktur\DaftarPeserta\Infrastructure\EloquentDaftarPesertaRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class DaftarPesertaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DaftarPesertaRepository::class, EloquentDaftarPesertaRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php (lihat ModuleRegistry).
     * Hanya role: instruktur.
     */
    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role:instruktur'])
            ->prefix('instruktur/daftar-peserta')
            ->group(function (): void {
                Route::get('/', [Http\DaftarPesertaController::class, 'index']);
                Route::post('/', [Http\DaftarPesertaController::class, 'store']);
            });
    }
}
