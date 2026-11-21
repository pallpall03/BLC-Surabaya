<?php

namespace App\Modules\Participant\Ujian;

use App\Modules\Participant\Ujian\Contracts\UjianRepository;
use App\Modules\Participant\Ujian\Infrastructure\EloquentUjianRepository;
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
     * Hanya role pengguna. Pembedaan peserta/pengunjung (ikut pelatihan atau tidak)
     * menyusul lewat data pendaftaran setelah skema database ada.
     */
    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role:pengguna'])
            ->prefix('peserta/ujian')
            ->group(function (): void {
                Route::get('/', [Http\UjianController::class, 'index']);
                // /jadwal harus didaftarkan sebelum /{id}, kalau tidak 'jadwal' ditangkap sebagai {id}
                Route::get('/jadwal', [Http\UjianController::class, 'jadwal']);
                Route::get('/{id}', [Http\UjianController::class, 'show'])->whereNumber('id');
                Route::post('/{id}/start', [Http\UjianController::class, 'start'])->whereNumber('id');
                Route::post('/{id}/submit', [Http\UjianController::class, 'submit'])->whereNumber('id');
            });
    }
}
