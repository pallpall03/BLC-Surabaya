<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    private const INSTRUKTUR_URLS = [
        '/api/v1/instruktur/daftar-peserta',
        '/api/v1/instruktur/daftar-hadir',
        '/api/v1/instruktur/laporan',
        '/api/v1/instruktur/ujian',
    ];

    private const KOORDINATOR_URLS = [
        '/api/v1/koordinator/monitoring',
        '/api/v1/koordinator/laporan',
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    private function sebagai(string $roleSlug): void
    {
        Sanctum::actingAs(User::factory()->create([
            'role_id' => Role::where('slug', $roleSlug)->value('id'),
        ]));
    }

    public function test_tanpa_login_semua_rute_role_ditolak_401(): void
    {
        foreach ([...self::INSTRUKTUR_URLS, ...self::KOORDINATOR_URLS, '/api/v1/peserta/ujian'] as $url) {
            $this->getJson($url)->assertStatus(401);
        }
    }

    public function test_instruktur_hanya_boleh_ke_area_instruktur(): void
    {
        $this->sebagai('instruktur');

        foreach (self::INSTRUKTUR_URLS as $url) {
            $this->getJson($url)->assertStatus(501); // lolos middleware, controller placeholder
        }
        foreach ([...self::KOORDINATOR_URLS, '/api/v1/peserta/ujian'] as $url) {
            $this->getJson($url)->assertStatus(403);
        }
    }

    public function test_koordinator_hanya_boleh_ke_area_koordinator(): void
    {
        $this->sebagai('koordinator');

        foreach (self::KOORDINATOR_URLS as $url) {
            $this->getJson($url)->assertStatus(501);
        }
        foreach ([...self::INSTRUKTUR_URLS, '/api/v1/peserta/ujian'] as $url) {
            $this->getJson($url)->assertStatus(403);
        }
    }

    public function test_pengguna_tidak_boleh_masuk_area_instruktur_atau_koordinator(): void
    {
        $this->sebagai('pengguna');

        foreach ([...self::INSTRUKTUR_URLS, ...self::KOORDINATOR_URLS] as $url) {
            $this->getJson($url)->assertStatus(403);
        }
    }

    public function test_admin_tidak_otomatis_boleh_ke_area_instruktur_atau_koordinator(): void
    {
        $this->sebagai('admin');

        foreach ([...self::INSTRUKTUR_URLS, ...self::KOORDINATOR_URLS] as $url) {
            $this->getJson($url)->assertStatus(403);
        }
    }

    public function test_pengguna_boleh_ke_area_peserta_dan_instruktur_ditolak(): void
    {
        $this->sebagai('pengguna');

        // lolos middleware lalu controller placeholder melempar error (belum ada skema) => bukan 401/403
        $this->assertNotContains($this->getJson('/api/v1/peserta/modul')->status(), [401, 403]);

        $this->sebagai('instruktur');
        $this->getJson('/api/v1/peserta/modul')->assertStatus(403);
    }

    public function test_rute_jadwal_ujian_tidak_tertangkap_sebagai_id(): void
    {
        $route = Route::getRoutes()->match(Request::create('/api/v1/peserta/ujian/jadwal', 'GET'));

        $this->assertSame('jadwal', $route->getActionMethod());
    }
}
