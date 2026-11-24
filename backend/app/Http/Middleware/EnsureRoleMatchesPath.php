<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Pembatas akses berdasarkan slug path.
 *
 * Segmen pertama setelah /api/v1 menentukan role yang berhak, jadi tiap role
 * otomatis hanya bisa membuka area miliknya sendiri tanpa menulis `role:...`
 * di setiap route:
 *
 *   /api/v1/instruktur/...    -> role instruktur
 *   /api/v1/koordinator/...   -> role koordinator
 *   /api/v1/peserta/...       -> role peserta
 *   /api/v1/operator/...      -> role operator
 *   /api/v1/administrator/... -> role superadmin
 *
 * Dipakai setelah auth:api. Contoh: ->middleware(['auth:api', 'role.path'])
 * Slug yang tidak ada di Role::PATH_ROLE ditolak (gagal tertutup).
 */
final class EnsureRoleMatchesPath
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $roleSlug = Role::PATH_ROLE[$this->slugPath($request) ?? ''] ?? null;

        if ($roleSlug === null || ! $user->hasRole($roleSlug)) {
            return response()->json(['message' => 'Anda tidak memiliki akses ke sumber daya ini.'], 403);
        }

        return $next($request);
    }

    /** Segmen pertama setelah `v1`, huruf kecil. Null kalau path tidak berbentuk api/v1/{slug}/... */
    private function slugPath(Request $request): ?string
    {
        $segmen = $request->segments();
        $posisi = array_search('v1', $segmen, true);

        if ($posisi === false || ! isset($segmen[$posisi + 1])) {
            return null;
        }

        return mb_strtolower($segmen[$posisi + 1]);
    }
}
