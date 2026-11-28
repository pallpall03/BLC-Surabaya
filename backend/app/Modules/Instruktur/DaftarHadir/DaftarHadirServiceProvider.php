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
        Route::middleware(['auth:api', 'role:instruktur'])
            ->prefix('instruktur/daftar-hadir')
            ->group(function (): void {
                Route::get('/', [Http\DaftarHadirController::class, 'index']);
                Route::get('/{id}', [Http\DaftarHadirController::class, 'show'])->whereNumber('id');
                Route::post('/', [Http\DaftarHadirController::class, 'store']);

                Route::prefix('kelas')->group(function (): void {
                    Route::get('/', [Http\KelasController::class, 'index']);
                    Route::get('/opsi/sesi', [Http\KelasController::class, 'opsiSesi']);
                    Route::get('/opsi/materi', [Http\KelasController::class, 'opsiMateri']);
                    Route::get('/opsi', [Http\KelasController::class, 'opsi']);
                    Route::post('/', [Http\KelasController::class, 'store']);

                    Route::get('/{id}/calon-peserta', [Http\KelasController::class, 'calonPeserta'])->whereNumber('id');
                    Route::get('/{id}/peserta', [Http\KelasController::class, 'peserta'])->whereNumber('id');
                    Route::post('/{id}/peserta', [Http\KelasController::class, 'tambahPeserta'])->whereNumber('id');
                    Route::delete('/{id}/peserta/{pesertaId}', [Http\KelasController::class, 'keluarkanPeserta'])
                        ->whereNumber('id')
                        ->whereNumber('pesertaId');
                    Route::get('/{id}/rekap', [Http\KelasController::class, 'rekap'])->whereNumber('id');

                    Route::get('/{id}', [Http\KelasController::class, 'show'])->whereNumber('id');
                    Route::match(['put', 'patch'], '/{id}', [Http\KelasController::class, 'update'])->whereNumber('id');
                    Route::delete('/{id}', [Http\KelasController::class, 'destroy'])->whereNumber('id');
                });
            });
    }
}
