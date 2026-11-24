<?php

namespace App\Modules\Participant\Modul;

use App\Modules\Participant\Modul\Contracts\ModulRepository;
use App\Modules\Participant\Modul\Infrastructure\EloquentModulRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class ModulServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ModulRepository::class, EloquentModulRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php (lihat ModuleRegistry).
     * Hanya role pengguna. Pembedaan peserta/pengunjung (ikut pelatihan atau tidak)
     * menyusul lewat data pendaftaran setelah skema database ada.
     */
    public static function routes(): void
    {
        Route::middleware(['auth:api', 'role.path'])
            ->prefix('peserta/modul')
            ->group(function (): void {
                Route::get('/', [Http\ModulController::class, 'index']);
                Route::get('/{id}', [Http\ModulController::class, 'show'])->whereNumber('id');
            });
    }
}
