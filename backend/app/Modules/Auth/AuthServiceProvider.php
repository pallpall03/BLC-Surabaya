<?php

namespace App\Modules\Auth;

use App\Http\Middleware\EnsureDashboardGate;
use App\Http\Middleware\EnsureDashboardRole;
use App\Modules\Auth\Contracts\CaptchaService;
use App\Modules\Auth\Contracts\UserRepository;
use App\Modules\Auth\Http\AuthController;
use App\Modules\Auth\Infrastructure\CacheCaptchaService;
use App\Modules\Auth\Infrastructure\EloquentUserRepository;
use App\Shared\Support\DashboardAccess;
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
            Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
            Route::get('/captcha', [AuthController::class, 'captcha'])->middleware('throttle:60,1');
            Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:30,1');
            Route::get('/dashboard-gate', fn () => response()->noContent(204))
                ->middleware(EnsureDashboardGate::class);

            // Di luar auth:api agar token yang sudah kedaluwarsa tetapi masih di dalam
            // JWT_REFRESH_TTL bisa ditukar; token yang benar-benar tidak valid tetap 401.
            Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('throttle:10,1');

            Route::middleware('auth:api')->group(function (): void {
                Route::post('/logout', [AuthController::class, 'logout']);
                Route::get('/me', [AuthController::class, 'me']);
                Route::get('/akses-dashboard', [AuthController::class, 'aksesDashboard']);
                Route::get('/akses-dashboard/{role}', [AuthController::class, 'aksesDashboard'])
                    ->middleware(EnsureDashboardRole::class)
                    ->whereIn('role', array_keys(DashboardAccess::routes()));
            });
        });

        // Endpoint administrator: hanya role superadmin.
        Route::middleware(['auth:api', 'role:superadmin'])
            ->prefix('administrator')
            ->group(function (): void {
                Route::post('/akun/{id}/buka-kunci', [AuthController::class, 'bukaKunci'])->whereNumber('id');
            });
    }
}
