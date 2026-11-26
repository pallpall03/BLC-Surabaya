<?php

namespace App\Http\Middleware;

use App\Shared\Support\DashboardAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;

final class EnsureDashboardGate
{
    public function handle(Request $request, Closure $next): Response
    {
        $path = $request->query('path');
        $apiGate = is_string($path);
        $path = $apiGate ? $path : $request->path();
        $role = DashboardAccess::roleForPath($path);

        if ($role === null) {
            return $apiGate
                ? redirect()->to('/')->header('Cache-Control', 'no-store')
                : $next($request);
        }

        try {
            $user = auth('api')->user();
        } catch (JWTException) {
            $user = null;
        }

        if ($user === null || ! $user->aktif()) {
            return redirect()
                ->to('/login')
                ->withCookie(DashboardAccess::forgetCookie())
                ->header('Cache-Control', 'no-store');
        }

        $request->setUserResolver(fn () => $user);

        if (! $user->hasRole($role)) {
            // Tanpa perpindahan otomatis ke dashboard lain: pengguna harus login ulang
            // melalui halaman login untuk melanjutkan.
            return redirect()
                ->to('/login')
                ->header('Cache-Control', 'no-store');
        }

        return $next($request);
    }
}
