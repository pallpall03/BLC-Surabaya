<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Shared\Support\DashboardAccess;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    private const NIK = '3578010101900001';

    private function buatUser(string $roleSlug, ?string $email = null, string $password = 'rahasia123', ?string $nik = null): User
    {
        return User::factory()->create([
            'nik' => $nik ?? self::NIK,
            'email' => $email ?? $roleSlug.'@blc.test',
            'password' => $password,
            'role_id' => Role::where('slug', $roleSlug)->value('id'),
        ]);
    }

    private function dataRegister(array $override = []): array
    {
        return array_merge([
            'name' => 'Budi',
            'nik' => '3578010101900099',
            'email' => 'budi@blc.test',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
        ], $override);
    }

    public function test_register_membuat_peserta_dan_mengembalikan_token(): void
    {
        $res = $this->postJson('/api/v1/auth/register', $this->dataRegister());

        $res->assertCreated()
            ->assertJsonPath('user.role.slug', 'peserta')
            ->assertJsonPath('user.email', 'budi@blc.test')
            ->assertJsonStructure(['token', 'token_type', 'user' => ['id', 'name', 'email', 'role']]);

        $this->assertDatabaseHas('users', ['email' => 'budi@blc.test']);
        $this->assertNotSame('rahasia123', User::first()->password, 'password harus tersimpan dalam bentuk hash');
    }

    public function test_token_dari_register_langsung_bisa_dipakai(): void
    {
        $token = $this->postJson('/api/v1/auth/register', $this->dataRegister())->json('token');

        $this->withToken($token)->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'budi@blc.test');
    }

    public function test_register_tidak_bisa_memilih_role_sendiri(): void
    {
        $this->postJson('/api/v1/auth/register', $this->dataRegister([
            'email' => 'nakal@blc.test',
            'role' => 'superadmin',
            'role_id' => Role::where('slug', 'superadmin')->value('id'),
        ]))->assertCreated()->assertJsonPath('user.role.slug', 'peserta');
    }

    public function test_register_menolak_data_tidak_valid(): void
    {
        $this->buatUser('peserta', 'ada@blc.test');

        $this->postJson('/api/v1/auth/register', [
            'name' => 'X',
            'nik' => '123',
            'email' => 'ada@blc.test',
            'password' => 'pendek',
        ])->assertStatus(422)->assertJsonValidationErrors(['nik', 'email', 'password']);
    }

    public function test_register_menolak_email_kembar_walau_beda_huruf_besar(): void
    {
        $this->buatUser('peserta', 'ada@blc.test');

        $this->postJson('/api/v1/auth/register', $this->dataRegister(['email' => 'ADA@BLC.test']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_menolak_password_lebih_dari_12_karakter(): void
    {
        $this->postJson('/api/v1/auth/register', $this->dataRegister([
            'password' => 'abcdefghijklm',
            'password_confirmation' => 'abcdefghijklm',
        ]))->assertStatus(422)->assertJsonValidationErrors(['password']);
    }

    public function test_register_menerima_password_tepat_12_karakter(): void
    {
        $this->postJson('/api/v1/auth/register', $this->dataRegister([
            'password' => 'abcdefghijkl',
            'password_confirmation' => 'abcdefghijkl',
        ]))->assertCreated();
    }

    public function test_register_tidak_menyimpan_telepon_dan_alamat(): void
    {
        $this->postJson('/api/v1/auth/register', $this->dataRegister(['telepon' => '0812', 'alamat' => 'Surabaya']))
            ->assertCreated();

        $this->assertArrayNotHasKey('telepon', User::first()->getAttributes());
    }

    public function test_register_menolak_konfirmasi_password_beda(): void
    {
        $this->postJson('/api/v1/auth/register', $this->dataRegister(['password_confirmation' => 'beda12345']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_semua_role_bisa_login_dengan_username_dan_mendapat_role_yang_benar(): void
    {
        foreach (array_keys(Role::daftar()) as $urut => $slug) {
            $nik = '357801010190010'.$urut;
            $username = $slug.'.demo';
            $user = $this->buatUser($slug, nik: $nik);
            $user->forceFill(['username' => $username])->save();

            $this->postJson('/api/v1/auth/login', [
                'login' => $username,
                'password' => 'rahasia123',
            ])->assertOk()
                ->assertJsonPath('user.id', $user->id)
                ->assertJsonPath('user.role.slug', $slug)
                ->assertJsonStructure(['token']);
        }
    }

    public function test_login_dengan_nik_username_atau_email_mengembalikan_user_yang_sama(): void
    {
        $user = $this->buatUser('instruktur', 'instruktur@blc.test');
        $user->forceFill(['username' => 'instruktur.demo'])->save();

        $withNik = $this->postJson('/api/v1/auth/login', ['login' => self::NIK, 'password' => 'rahasia123'])->assertOk();
        $withUsername = $this->postJson('/api/v1/auth/login', ['login' => 'instruktur.demo', 'password' => 'rahasia123'])->assertOk();
        $withEmail = $this->postJson('/api/v1/auth/login', ['login' => 'INSTRUKTUR@BLC.TEST', 'password' => 'rahasia123'])->assertOk();

        $this->assertSame($withNik->json('user.id'), $withUsername->json('user.id'));
        $this->assertSame($withNik->json('user.id'), $withEmail->json('user.id'));
    }

    public function test_peserta_hasil_register_bisa_login(): void
    {
        $this->postJson('/api/v1/auth/register', $this->dataRegister())->assertCreated();

        $this->postJson('/api/v1/auth/login', ['login' => '3578010101900099', 'password' => 'rahasia123'])
            ->assertOk()
            ->assertJsonPath('user.role.slug', 'peserta');
    }

    public function test_login_gagal_pesannya_sama_untuk_nik_salah_dan_password_salah(): void
    {
        $this->buatUser('peserta');

        $a = $this->postJson('/api/v1/auth/login', ['login' => self::NIK, 'password' => 'salah-total'])
            ->assertStatus(401);
        $b = $this->postJson('/api/v1/auth/login', ['login' => '3578010101900777', 'password' => 'salah-total'])
            ->assertStatus(401);

        $this->assertSame($a->json('message'), $b->json('message'));
        $this->assertSame($a->json('captcha_required'), $b->json('captcha_required'));
        $this->assertSame($a->json('attempts_left'), $b->json('attempts_left'));
    }

    public function test_akun_tanpa_role_tidak_bisa_login(): void
    {
        User::factory()->create(['nik' => self::NIK, 'password' => 'rahasia123', 'role_id' => null]);

        $this->postJson('/api/v1/auth/login', ['login' => self::NIK, 'password' => 'rahasia123'])
            ->assertStatus(403);
    }

    public function test_login_menolak_input_kosong(): void
    {
        $this->postJson('/api/v1/auth/login', [])->assertStatus(422)->assertJsonValidationErrors(['login', 'password']);
    }

    public function test_me_butuh_login_dan_selalu_json(): void
    {
        $this->getJson('/api/v1/auth/me')->assertStatus(401);
        // tanpa header Accept: application/json pun tetap JSON, bukan redirect
        $this->get('/api/v1/auth/me')->assertStatus(401)->assertJsonStructure(['message']);
    }

    public function test_me_mengembalikan_user_dengan_token_asli(): void
    {
        $this->buatUser('instruktur');

        $token = $this->postJson('/api/v1/auth/login', ['login' => self::NIK, 'password' => 'rahasia123'])
            ->json('token');

        $this->withToken($token)->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'instruktur@blc.test')
            ->assertJsonPath('user.role.slug', 'instruktur');
    }

    public function test_token_login_diterima_rute_yang_dilindungi_role(): void
    {
        $this->buatUser('instruktur');

        $token = $this->postJson('/api/v1/auth/login', ['login' => self::NIK, 'password' => 'rahasia123'])
            ->json('token');

        // lolos auth + role: daftar-peserta sudah jalan (200), daftar-hadir masih placeholder (501), bukan 401/403
        $this->withToken($token)->getJson('/api/v1/instruktur/daftar-peserta')->assertOk();
        $this->withToken($token)->getJson('/api/v1/instruktur/daftar-hadir')->assertStatus(501);
        $this->withToken($token)->getJson('/api/v1/koordinator/monitoring')->assertStatus(403);
    }

    public function test_logout_mencabut_token(): void
    {
        $this->buatUser('peserta');

        $token = $this->postJson('/api/v1/auth/login', ['login' => self::NIK, 'password' => 'rahasia123'])
            ->json('token');

        $this->withToken($token)->getJson('/api/v1/auth/me')->assertOk();
        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertOk();

        // tiap request nyata memakai proses baru; di test, buang cache guard dulu
        Auth::forgetGuards();

        $this->withToken($token)->getJson('/api/v1/auth/me')->assertStatus(401);
    }

    public function test_token_palsu_ditolak(): void
    {
        $this->withToken('bukan.token.jwt')->getJson('/api/v1/auth/me')->assertStatus(401);
    }

    public function test_cookie_dashboard_bisa_dipakai_tanpa_header_bearer(): void
    {
        // Cookie dashboard berisi JWT mentah; request JSON tes perlu withCredentials().
        $this->buatUser('instruktur');

        $token = $this->postJson('/api/v1/auth/login', [
            'login' => self::NIK,
            'password' => 'rahasia123',
        ])->assertOk()->json('token');

        $this->withCredentials()
            ->withUnencryptedCookie(DashboardAccess::COOKIE, $token)
            ->getJson('/api/v1/auth/akses-dashboard/instruktur')
            ->assertOk()
            ->assertJsonPath('allowed', true)
            ->assertJsonPath('redirect_to', '/instruktur');
    }

    public function test_dashboard_gate_mengambil_role_dari_database(): void
    {
        $this->buatUser('instruktur');

        $token = $this->postJson('/api/v1/auth/login', [
            'login' => self::NIK,
            'password' => 'rahasia123',
        ])->assertOk()->json('token');

        $this->withUnencryptedCookie(DashboardAccess::COOKIE, $token)
            ->get('/api/v1/auth/dashboard-gate?path=/instruktur/daftar_peserta')
            ->assertNoContent();

        $this->withUnencryptedCookie(DashboardAccess::COOKIE, $token)
            ->get('/api/v1/auth/dashboard-gate?path=/operator')
            ->assertRedirect('/login');

        $this->get('/api/v1/auth/dashboard-gate?path=/administrator')
            ->assertRedirect('/login');
    }

    public function test_akses_dashboard_menolak_role_yang_berbeda(): void
    {
        $this->buatUser('instruktur');

        $token = $this->postJson('/api/v1/auth/login', [
            'login' => self::NIK,
            'password' => 'rahasia123',
        ])->assertOk()->json('token');

        $this->withCredentials()
            ->withUnencryptedCookie(DashboardAccess::COOKIE, $token)
            ->getJson('/api/v1/auth/akses-dashboard/operator')
            ->assertForbidden()
            ->assertJsonPath('redirect_to', '/login');
    }
}
