<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Modules\Auth\Contracts\CaptchaService;
use App\Modules\Auth\Infrastructure\CacheCaptchaService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

/** Aturan login NIK: salah 1x tanpa captcha, salah 2x captcha muncul, salah 3x terkunci sampai dibuka admin. */
class LoginNikTest extends TestCase
{
    use RefreshDatabase;

    private const NIK = '3578010101900001';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        // Captcha palsu untuk tes: id "ok" dengan jawaban "123456" selalu benar.
        // Sifat sekali pakai captcha yang asli diuji di test_captcha_nyata_sekali_pakai.
        $this->app->instance(CaptchaService::class, new class implements CaptchaService
        {
            public function buat(): array
            {
                return ['id' => 'ok', 'image' => 'data:,', 'refresh_in' => 60];
            }

            public function verifikasi(?string $id, ?string $jawaban): bool
            {
                return $id === 'ok' && $jawaban === '123456';
            }
        });
    }

    private function buatUser(string $roleSlug = 'peserta'): User
    {
        return User::factory()->create([
            'nik' => self::NIK,
            'password' => 'rahasia123',
            'role_id' => Role::where('slug', $roleSlug)->value('id'),
        ]);
    }

    private function login(string $password, array $tambahan = [], string $login = self::NIK)
    {
        return $this->postJson('/api/v1/auth/login', ['login' => $login, 'password' => $password] + $tambahan);
    }

    public function test_endpoint_captcha_memberi_gambar_dan_interval_refresh_60_detik(): void
    {
        $this->app->instance(CaptchaService::class, $this->app->make(CacheCaptchaService::class));

        $res = $this->getJson('/api/v1/auth/captcha')
            ->assertOk()
            ->assertJsonStructure(['captcha_id', 'image', 'refresh_in'])
            ->assertJsonPath('refresh_in', 60);

        $this->assertStringStartsWith('data:image/svg+xml;base64,', $res->json('image'));
        $this->assertStringNotContainsString('<text', base64_decode(substr($res->json('image'), 26)));
        $this->assertStringContainsString('no-store', $res->headers->get('Cache-Control'));
    }

    public function test_salah_password_pertama_tanpa_captcha(): void
    {
        $this->buatUser();

        $this->login('salah')
            ->assertStatus(401)
            ->assertJsonPath('captcha_required', false)
            ->assertJsonPath('locked', false)
            ->assertJsonPath('attempts_left', 2);
    }

    public function test_salah_password_kedua_memunculkan_captcha(): void
    {
        $this->buatUser();

        $this->login('salah');
        $this->login('salah')
            ->assertStatus(401)
            ->assertJsonPath('captcha_required', true)
            ->assertJsonPath('attempts_left', 1);
    }

    public function test_setelah_dua_salah_login_tanpa_captcha_ditolak_walau_password_benar(): void
    {
        $user = $this->buatUser();
        $this->login('salah');
        $this->login('salah');

        $this->login('rahasia123')
            ->assertStatus(422)
            ->assertJsonPath('captcha_required', true);

        $this->assertSame(2, $user->fresh()->failed_login_attempts, 'captcha kosong tidak dihitung sebagai salah password');
    }

    public function test_captcha_salah_ditolak_dan_tidak_menambah_hitungan_salah(): void
    {
        $user = $this->buatUser();
        $this->login('salah');
        $this->login('salah');

        $this->login('rahasia123', ['captcha_id' => 'ok', 'captcha' => '000000'])
            ->assertStatus(422)
            ->assertJsonPath('captcha_required', true);

        $this->assertSame(2, $user->fresh()->failed_login_attempts);
    }

    public function test_dengan_captcha_benar_dan_password_benar_login_berhasil_dan_hitungan_direset(): void
    {
        $user = $this->buatUser();
        $this->login('salah');
        $this->login('salah');

        $this->login('rahasia123', ['captcha_id' => 'ok', 'captcha' => '123456'])
            ->assertOk()
            ->assertJsonStructure(['token'])
            ->assertJsonPath('user.nik', self::NIK);

        $this->assertSame(0, $user->fresh()->failed_login_attempts);
    }

    public function test_login_berhasil_sebelum_batas_mereset_hitungan(): void
    {
        $user = $this->buatUser();
        $this->login('salah');

        $this->login('rahasia123')->assertOk();

        $this->assertSame(0, $user->fresh()->failed_login_attempts);
    }

    public function test_salah_ketiga_mengunci_akun(): void
    {
        $user = $this->buatUser();
        $this->login('salah');
        $this->login('salah');

        $this->login('salah', ['captcha_id' => 'ok', 'captcha' => '123456'])
            ->assertStatus(423)
            ->assertJsonPath('locked', true);

        $this->assertNotNull($user->fresh()->locked_at);
    }

    public function test_akun_terkunci_tetap_ditolak_walau_password_dan_captcha_benar(): void
    {
        $user = $this->buatUser();
        $user->forceFill(['failed_login_attempts' => 3, 'locked_at' => now()])->save();

        $this->login('rahasia123', ['captcha_id' => 'ok', 'captcha' => '123456'])
            ->assertStatus(423)
            ->assertJsonPath('locked', true);
    }

    public function test_admin_bisa_membuka_akun_terkunci(): void
    {
        $user = $this->buatUser();
        $user->forceFill(['failed_login_attempts' => 3, 'locked_at' => now()])->save();

        $admin = User::factory()->create(['role_id' => Role::where('slug', 'superadmin')->value('id')]);
        $this->actingAs($admin, 'api');

        $this->postJson("/api/v1/administrator/akun/{$user->id}/buka-kunci")
            ->assertOk();

        $this->assertNull($user->fresh()->locked_at);
        $this->assertSame(0, $user->fresh()->failed_login_attempts);

        $this->login('rahasia123')->assertOk();
    }

    public function test_buka_kunci_hanya_untuk_path_administrator_oleh_superadmin(): void
    {
        $user = $this->buatUser();

        $this->postJson("/api/v1/administrator/akun/{$user->id}/buka-kunci")->assertStatus(401);

        foreach (['peserta', 'instruktur', 'koordinator', 'operator'] as $slug) {
            $this->actingAs(User::factory()->create(['role_id' => Role::where('slug', $slug)->value('id')]), 'api');

            $this->postJson("/api/v1/administrator/akun/{$user->id}/buka-kunci")->assertStatus(403);
        }
    }

    public function test_buka_kunci_akun_yang_tidak_ada_404(): void
    {
        $this->actingAs(User::factory()->create(['role_id' => Role::where('slug', 'superadmin')->value('id')]), 'api');

        $this->postJson('/api/v1/administrator/akun/99999/buka-kunci')->assertStatus(404);
    }

    public function test_nik_tidak_terdaftar_diperlakukan_sama_dengan_nik_terdaftar(): void
    {
        $this->buatUser();
        $tidakAda = '3578010101900555';

        foreach ([self::NIK, $tidakAda] as $nik) {
            $this->login('salah', nik: $nik)->assertStatus(401)->assertJsonPath('attempts_left', 2)->assertJsonPath('captcha_required', false);
            $this->login('salah', nik: $nik)->assertStatus(401)->assertJsonPath('attempts_left', 1)->assertJsonPath('captcha_required', true);
            $this->login('salah', ['captcha_id' => 'ok', 'captcha' => '123456'], nik: $nik)->assertStatus(423);
        }
    }

    public function test_captcha_nyata_sekali_pakai(): void
    {
        $service = new CacheCaptchaService();
        $hash = hash_hmac('sha256', '123456', (string) config('app.key'));
        $kunci = fn (string $id) => 'captcha:'.hash('sha256', $id);

        Cache::put($kunci('abc'), $hash, 90);
        $this->assertTrue($service->verifikasi('abc', '123456'));
        $this->assertFalse($service->verifikasi('abc', '123456'), 'captcha tidak boleh dipakai dua kali');

        Cache::put($kunci('def'), $hash, 90);
        $this->assertFalse($service->verifikasi('def', '999999'));
        $this->assertFalse($service->verifikasi('def', '123456'), 'salah sekali langsung hangus');

        $this->assertFalse($service->verifikasi(null, '123456'));
        $this->assertFalse($service->verifikasi('abc', ''));
    }
}
