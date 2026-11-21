<?php

namespace App\Modules\Auth;

use App\Modules\Auth\Contracts\UserRepository;
use App\Modules\Auth\Infrastructure\EloquentUserRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepository::class, EloquentUserRepository::class);
    }

    /**
     * Dipanggil dari routes/modules.php (lihat ModuleRegistry).
     */
    public static function routes(): void
    {
        Route::prefix('auth')->group(function (): void {
            Route::post('/register', [Http\AuthController::class, 'register'])->middleware('throttle:10,1');
            Route::post('/login', [Http\AuthController::class, 'login'])->middleware('throttle:30,1');

            Route::middleware('auth:api')->group(function (): void {
                Route::post('/logout', [Http\AuthController::class, 'logout']);
                Route::get('/me', [Http\AuthController::class, 'me']);
            });
        });
    }
}
