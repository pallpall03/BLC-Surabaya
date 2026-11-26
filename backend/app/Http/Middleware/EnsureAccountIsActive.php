<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Menolak token milik akun yang sudah dinonaktifkan admin, walau tokennya belum kedaluwarsa.
 * Berjalan di grup middleware api setelah DashboardCookieAuthentication.
 */
final class EnsureAccountIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        // Logout harus tetap bisa dipakai supaya browser bisa membersihkan cookie.
        if (! $request->headers->has('Authorization') || $request->is('api/v1/auth/logout')) {
            return $next($request);
        }

        try {
            $user = Auth::guard('api')->user();
        } catch (Throwable) {
            // Token tidak valid/kedaluwarsa: biarkan middleware auth yang menjawab 401.
            return $next($request);
        }

        if ($user !== null && ! $user->aktif()) {
            return response()->json([
                'message' => 'Akun tidak aktif. Hubungi admin.',
                'redirect_to' => '/login',
            ], 403)->header('Cache-Control', 'no-store');
        }

        return $next($request);
    }
}
