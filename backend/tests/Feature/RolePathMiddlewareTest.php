<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/** Middleware `role.path`: slug di path (/api/v1/{slug}/...) menentukan role yang boleh masuk. */
class RolePathMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        // Rute uji: satu per slug path, ditambah satu slug yang tidak terdaftar.
        foreach ([...array_keys(Role::PATH_ROLE), 'tidak-terdaftar'] as $slug) {
            Route::middleware(['api', 'auth:api', 'role.path'])
                ->get("/api/v1/{$slug}/ping", fn () => response()->json(['ok' => true]));
        }
    }

    private function sebagai(string $roleSlug): void
    {
        $this->actingAs(User::factory()->create([
            'role_id' => Role::where('slug', $roleSlug)->value('id'),
        ]), 'api');
    }

    public function test_tanpa_login_ditolak_401(): void
    {
        foreach (array_keys(Role::PATH_ROLE) as $slug) {
            $this->getJson("/api/v1/{$slug}/ping")->assertStatus(401);
        }
    }

    public function test_tiap_role_hanya_bisa_membuka_path_miliknya(): void
    {
        foreach (Role::PATH_ROLE as $slugPath => $roleSlug) {
            foreach (Role::daftar() as $roleLain => $_nama) {
                $this->sebagai($roleLain);

                $this->getJson("/api/v1/{$slugPath}/ping")
                    ->assertStatus($roleLain === $roleSlug ? 200 : 403);
            }
        }
    }

    public function test_path_administrator_dipegang_superadmin(): void
    {
        $this->sebagai('superadmin');
        $this->getJson('/api/v1/administrator/ping')->assertOk();

        $this->sebagai('operator');
        $this->getJson('/api/v1/administrator/ping')->assertStatus(403);
    }

    public function test_slug_yang_tidak_terdaftar_ditolak_untuk_semua_role(): void
    {
        foreach (array_keys(Role::daftar()) as $roleSlug) {
            $this->sebagai($roleSlug);

            $this->getJson('/api/v1/tidak-terdaftar/ping')->assertStatus(403);
        }
    }

    public function test_user_tanpa_role_ditolak(): void
    {
        $this->actingAs(User::factory()->create(['role_id' => null]), 'api');

        $this->getJson('/api/v1/instruktur/ping')->assertStatus(403);
    }
}
