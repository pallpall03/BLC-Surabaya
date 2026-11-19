<?php

namespace App\Modules\Participant\Piagam;

use App\Modules\Participant\Piagam\Contracts\PiagamRepository;
use App\Modules\Participant\Piagam\Infrastructure\EloquentPiagamRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class PiagamServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PiagamRepository::class, EloquentPiagamRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php (lihat ModuleRegistry).
     * Hanya role pengguna. Pembedaan peserta/pengunjung (ikut pelatihan atau tidak)
     * menyusul lewat data pendaftaran setelah skema database ada.
     */
    public static function routes(): void
    {
        Route::middleware(['auth:sanctum', 'role:pengguna'])
            ->prefix('peserta/piagam')
            ->group(function (): void {
                Route::get('/', [Http\PiagamController::class, 'index']);
                Route::get('/{id}', [Http\PiagamController::class, 'show'])->whereNumber('id');
            });
    }
}
