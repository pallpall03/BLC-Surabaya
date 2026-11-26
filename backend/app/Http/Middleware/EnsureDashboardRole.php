<?php

namespace App\Http\Middleware;

use App\Shared\Support\DashboardAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureDashboardRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $role = (string) $request->route('role');
        $user = $request->user();

        if ($user === null) {
            return response()->json([
                'message' => 'Silakan login terlebih dahulu.',
                'redirect_to' => '/login',
            ], 401);
        }

        if (! DashboardAccess::exists($role)) {
            return response()->json(['message' => 'Dashboard tidak tersedia.'], 404)
                ->header('Cache-Control', 'no-store');
        }

        if (! $user->hasRole($role)) {
            return response()->json([
                'message' => 'Role akun tidak sesuai dengan dashboard ini. Silakan login ulang.',
                'redirect_to' => '/login',
            ], 403)->header('Cache-Control', 'no-store');
        }

        return $next($request);
    }
}
