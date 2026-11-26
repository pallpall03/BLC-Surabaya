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
        Route::middleware(['auth:api', 'role:instruktur'])
            ->prefix('instruktur/ujian')
            ->group(function (): void {
                Route::get('/', [Http\UjianController::class, 'index']);
                Route::get('/opsi', [Http\UjianController::class, 'opsi']);
                Route::post('/', [Http\UjianController::class, 'store']);
                Route::post('/jadwal', [Http\UjianController::class, 'storeJadwal']);
                Route::match(['put', 'patch'], '/jadwal/{id}', [Http\UjianController::class, 'updateJadwal'])->whereNumber('id');
                Route::delete('/jadwal/{id}', [Http\UjianController::class, 'destroyJadwal'])->whereNumber('id');
                Route::get('/{id}', [Http\UjianController::class, 'show'])->whereNumber('id');
                Route::match(['put', 'patch'], '/{id}', [Http\UjianController::class, 'update'])->whereNumber('id');
                Route::delete('/{id}', [Http\UjianController::class, 'destroy'])->whereNumber('id');
            });
    }
}
