<?php

namespace Tests\Feature;

use App\Http\Middleware\EnsureUserHasRole;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    private function pengguna(?string $roleSlug): ?User
    {
        if ($roleSlug === null) {
            return null;
        }

        $user = new User;
        $user->id = 1;
        $user->setRelation('role', new Role(['slug' => $roleSlug]));

        return $user;
    }

    private function jalankan(?string $roleSlug, string ...$roles): Response
    {
        $request = Request::create('/api/v1/area-bebas');
        $request->setUserResolver(fn () => $this->pengguna($roleSlug));

        return (new EnsureUserHasRole)->handle(
            $request,
            fn () => new JsonResponse(['ok' => true]),
            ...$roles,
        );
    }

    public function test_tanpa_login_ditolak_401(): void
    {
        $response = $this->jalankan(null, 'instruktur');

        $this->assertSame(401, $response->getStatusCode());
        $this->assertSame(['message' => 'Unauthenticated.'], json_decode($response->getContent(), true));
    }

    public function test_role_diambil_dari_user_bukan_dari_path(): void
    {
        foreach (array_keys(Role::daftar()) as $roleSlug) {
            $response = $this->jalankan($roleSlug, $roleSlug);

            $this->assertSame(200, $response->getStatusCode(), $roleSlug);
        }
    }

    public function test_role_yang_salah_ditolak_403(): void
    {
        $response = $this->jalankan('peserta', 'instruktur');

        $this->assertSame(403, $response->getStatusCode());
    }

    public function test_user_tanpa_role_ditolak_403(): void
    {
        $user = new User;
        $user->id = 1;

        $request = Request::create('/api/v1/instruktur');
        $request->setUserResolver(fn () => $user);

        $response = (new EnsureUserHasRole)->handle(
            $request,
            fn () => new JsonResponse(['ok' => true]),
            'instruktur',
        );

        $this->assertSame(403, $response->getStatusCode());
    }

    public function test_route_boleh_menerima_beberapa_role(): void
    {
        $this->assertSame(200, $this->jalankan('instruktur', 'instruktur', 'koordinator')->getStatusCode());
        $this->assertSame(200, $this->jalankan('koordinator', 'instruktur', 'koordinator')->getStatusCode());
        $this->assertSame(403, $this->jalankan('peserta', 'instruktur', 'koordinator')->getStatusCode());
    }

    public function test_rute_dashboard_memakai_auth_dan_role_eksplisit(): void
    {
        $routes = [
            ['GET', '/api/v1/users', 'superadmin'],
            ['GET', '/api/v1/instruktur/daftar-peserta', 'instruktur'],
            ['GET', '/api/v1/koordinator/monitoring', 'koordinator'],
            ['GET', '/api/v1/peserta/modul', 'peserta'],
            ['POST', '/api/v1/administrator/akun/1/buka-kunci', 'superadmin'],
        ];

        foreach ($routes as [$method, $uri, $role]) {
            $route = Route::getRoutes()->match(Request::create($uri, $method));
            $middleware = $route->gatherMiddleware();

            $this->assertContains('auth:api', $middleware, $uri);
            $this->assertContains("role:{$role}", $middleware, $uri);
            $this->assertNotContains('role.path', $middleware, $uri);
        }
    }
}
