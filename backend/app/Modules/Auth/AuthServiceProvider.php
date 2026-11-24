<?php

namespace App\Modules\Auth;

use App\Modules\Auth\Contracts\CaptchaService;
use App\Modules\Auth\Contracts\UserRepository;
use App\Modules\Auth\Infrastructure\CacheCaptchaService;
use App\Modules\Auth\Infrastructure\EloquentUserRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepository::class, EloquentUserRepository::class);
        $this->app->bind(CaptchaService::class, CacheCaptchaService::class);
    }

    /**
     * Dipanggil dari routes/modules.php (lihat ModuleRegistry).
     */
    public static function routes(): void
    {
        Route::prefix('auth')->group(function (): void {
            Route::post('/register', [Http\AuthController::class, 'register'])->middleware('throttle:10,1');
            Route::get('/captcha', [Http\AuthController::class, 'captcha'])->middleware('throttle:60,1');
            Route::post('/login', [Http\AuthController::class, 'login'])->middleware('throttle:30,1');

            Route::middleware('auth:api')->group(function (): void {
                Route::post('/logout', [Http\AuthController::class, 'logout']);
                Route::get('/me', [Http\AuthController::class, 'me']);
            });
        });

        // Path administrator: hanya role superadmin (middleware role.path).
        Route::middleware(['auth:api', 'role.path'])
            ->prefix('administrator')
            ->group(function (): void {
                Route::post('/akun/{id}/buka-kunci', [Http\AuthController::class, 'bukaKunci'])->whereNumber('id');
            });
    }
}
