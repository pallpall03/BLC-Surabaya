<?php

namespace App\Shared\Support;

use App\Models\Role;
use App\Models\User;
use Symfony\Component\HttpFoundation\Cookie;

final class DashboardAccess
{
    public const COOKIE = 'blc_dashboard_token';

    /** @return array<string, string> */
    public static function routes(): array
    {
        return [
            Role::SUPERADMIN => '/administrator',
            Role::OPERATOR => '/operator',
            Role::INSTRUKTUR => '/instruktur',
        ];
    }

    public static function exists(string $role): bool
    {
        return array_key_exists($role, self::routes());
    }

    public static function url(?User $user): string
    {
        $slug = $user?->role?->slug;

        return $slug === null ? '/' : (self::routes()[$slug] ?? '/');
    }

    public static function roleForPath(string $path): ?string
    {
        $prefix = explode('/', trim($path, '/'))[0] ?? '';

        foreach (self::routes() as $role => $route) {
            if (trim($route, '/') === $prefix) {
                return $role;
            }
        }

        return null;
    }

    /**
     * Cookie httpOnly berisi token JWT. Dipakai untuk login, refresh, dan register.
     * Umur cookie mengikuti masa berlaku token; 0 detik berarti cookie sesi browser.
     */
    public static function cookie(string $token, int $detikBerlaku): Cookie
    {
        return cookie(
            self::COOKIE,
            $token,
            $detikBerlaku > 0 ? (int) ceil($detikBerlaku / 60) : 0,
            (string) config('session.path', '/'),
            config('session.domain') ?: null,
            (bool) config('session.secure', false),
            true,
            false,
            config('session.same_site', 'lax'),
        );
    }

    /** Hapus cookie dashboard (logout atau token tidak lagi valid). */
    public static function forgetCookie(): Cookie
    {
        return cookie(
            self::COOKIE,
            '',
            -60,
            (string) config('session.path', '/'),
            config('session.domain') ?: null,
            (bool) config('session.secure', false),
            true,
            false,
            config('session.same_site', 'lax'),
        );
    }
}
