<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Pembatas akses berdasarkan role. Dipakai setelah auth:api.
 * Contoh: ->middleware(['auth:api', 'role:instruktur,koordinator'])
 */
final class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json([
                'message' => 'Unauthenticated.',
                'redirect_to' => '/login',
            ], 401);
        }

        if (! $user->hasRole(...$roles)) {
            // Tanpa redirect_to: salah role tidak memindahkan halaman; frontend
            // cukup menampilkan pesan galat.
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke sumber daya ini.',
            ], 403);
        }

        return $next($request);
    }
}
