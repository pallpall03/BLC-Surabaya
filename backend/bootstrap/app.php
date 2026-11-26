<?php

use App\Http\Middleware\DashboardCookieAuthentication;
use App\Http\Middleware\EnsureAccountIsActive;
use App\Http\Middleware\EnsureUserHasRole;
use App\Shared\Support\DashboardAccess;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: fn () => require __DIR__.'/../routes/web.php',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: [DashboardAccess::COOKIE]);
        $middleware->api(append: [
            DashboardCookieAuthentication::class,
            EnsureAccountIsActive::class,
        ]);
        $middleware->prependToPriorityList(
            AuthenticatesRequests::class,
            DashboardCookieAuthentication::class,
        );
        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);

        // API tidak punya halaman login: tamu yang belum login dibalas 401 JSON,
        // bukan di-redirect ke route 'login' (yang memang tidak ada).
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'message' => 'Silakan login terlebih dahulu.',
                'redirect_to' => '/login',
            ], 401)->header('Cache-Control', 'no-store');
        });

        // Semua error di /api/* selalu dibalas JSON (tanpa redirect ke halaman login).
        $exceptions->shouldRenderJsonWhen(
            fn ($request, Throwable $e) => $request->is('api/*') || $request->expectsJson()
        );
    })->create();
