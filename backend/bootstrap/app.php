<?php

use App\Http\Middleware\EnsureRoleMatchesPath;
use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => EnsureUserHasRole::class,
            'role.path' => EnsureRoleMatchesPath::class,
        ]);

        // API tidak punya halaman login: tamu yang belum login dibalas 401 JSON,
        // bukan di-redirect ke route 'login' (yang memang tidak ada).
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Semua error di /api/* selalu dibalas JSON (tanpa redirect ke halaman login).
        $exceptions->shouldRenderJsonWhen(
            fn ($request, Throwable $e) => $request->is('api/*') || $request->expectsJson()
        );
    })->create();
