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
        Route::middleware(['auth:api', 'role.path'])
            ->prefix('instruktur/daftar-peserta')
            ->group(function (): void {
                Route::get('/', [Http\DaftarPesertaController::class, 'index']);
                Route::post('/', [Http\DaftarPesertaController::class, 'store']);
                Route::get('/opsi', [Http\DaftarPesertaController::class, 'opsi']);
                Route::get('/{id}', [Http\DaftarPesertaController::class, 'show'])->whereNumber('id');
                Route::match(['put', 'patch'], '/{id}', [Http\DaftarPesertaController::class, 'update'])->whereNumber('id');
                Route::patch('/{id}/validasi', [Http\DaftarPesertaController::class, 'validasi'])->whereNumber('id');
                Route::delete('/{id}', [Http\DaftarPesertaController::class, 'destroy'])->whereNumber('id');
            });
    }
}
