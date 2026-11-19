<?php

namespace App\Modules\Instruktur\Peserta;

use App\Modules\Instruktur\Peserta\Contracts\PesertaRepository;
use App\Modules\Instruktur\Peserta\Infrastructure\EloquentPesertaRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class PesertaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PesertaRepository::class, EloquentPesertaRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('peserta')->group(function (): void {
            Route::get('/', [Peserta\Http\PesertaController::class, 'index']);
            Route::get('/{id}', [Peserta\Http\PesertaController::class, 'show']);
            Route::post('/', [Peserta\Http\PesertaController::class, 'store']);
            Route::put('/{id}', [Peserta\Http\PesertaController::class, 'update']);
            Route::delete('/{id}', [Peserta\Http\PesertaController::class, 'destroy']);
        });
    }
}