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
        // Use cases
        $this->app->bind(App\Modules\Participant\Ujian\Application\ListUjian::class);
        $this->app->bind(App\Modules\Participant\Ujian\Application\GetUjian::class);
        $this->app->bind(App\Modules\Participant\Ujian\Application\GetMyJadwal::class);
        $this->app->bind(App\Modules\Participant\Ujian\Application\StartUjian::class);
        $this->app->bind(App\Modules\Participant\Ujian\Application\SubmitUjian::class);
    }

    public static function routes(): void
    {
        Route::prefix('peserta/ujian')->group(function (): void {
            Route::get('/', [Http\UjianController::class, 'index']);
            Route::get('/{id}', [Http\UjianController::class, 'show']);
            Route::get('/jadwal', [Http\UjianController::class, 'jadwal']);
            Route::post('/{id}/start', [Http\UjianController::class, 'start']);
            Route::post('/{id}/submit', [Http\UjianController::class, 'submit']);
        });
    }
}
