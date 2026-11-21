<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
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

    private function buatUser(string $roleSlug, ?string $email = null, string $password = 'rahasia123'): User
    {
        return User::factory()->create([
            'email' => $email ?? $roleSlug.'@blc.test',
            'password' => $password,
            'role_id' => Role::where('slug', $roleSlug)->value('id'),
        ]);
    }

    private function dataRegister(array $override = []): array
    {
        return array_merge([
            'name' => 'Budi',
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
            'email' => 'ada@blc.test',
            'password' => 'pendek',
        ])->assertStatus(422)->assertJsonValidationErrors(['email', 'password']);
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

    public function test_semua_role_bisa_login_dan_mendapat_role_yang_benar(): void
    {
        foreach (array_keys(Role::daftar()) as $slug) {
            $this->buatUser($slug);

            $this->postJson('/api/v1/auth/login', [
                'email' => $slug.'@blc.test',
                'password' => 'rahasia123',
            ])->assertOk()
                ->assertJsonPath('user.role.slug', $slug)
                ->assertJsonStructure(['token']);
        }
    }

    public function test_login_tidak_peka_huruf_besar_pada_email(): void
    {
        $this->buatUser('instruktur', 'instruktur@blc.test');

        $this->postJson('/api/v1/auth/login', ['email' => 'Instruktur@BLC.test', 'password' => 'rahasia123'])
            ->assertOk()
            ->assertJsonPath('user.role.slug', 'instruktur');
    }

    public function test_peserta_hasil_register_bisa_login(): void
    {
        $this->postJson('/api/v1/auth/register', $this->dataRegister())->assertCreated();

        $this->postJson('/api/v1/auth/login', ['email' => 'budi@blc.test', 'password' => 'rahasia123'])
            ->assertOk()
            ->assertJsonPath('user.role.slug', 'peserta');
    }

    public function test_login_gagal_pesannya_sama_untuk_email_salah_dan_password_salah(): void
    {
        $this->buatUser('peserta');

        $a = $this->postJson('/api/v1/auth/login', ['email' => 'peserta@blc.test', 'password' => 'salah-total'])
            ->assertStatus(401);
        $b = $this->postJson('/api/v1/auth/login', ['email' => 'tidakada@blc.test', 'password' => 'salah-total'])
            ->assertStatus(401);

        $this->assertSame($a->json('message'), $b->json('message'));
    }

    public function test_login_dibatasi_setelah_5_kali_gagal(): void
    {
        $this->buatUser('peserta');

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', ['email' => 'peserta@blc.test', 'password' => 'salah'])->assertStatus(401);
        }

        // percobaan ke-6 ditolak walaupun password benar
        $this->postJson('/api/v1/auth/login', ['email' => 'peserta@blc.test', 'password' => 'rahasia123'])
            ->assertStatus(429)
            ->assertHeader('Retry-After');
    }

    public function test_akun_tanpa_role_tidak_bisa_login(): void
    {
        User::factory()->create(['email' => 'tanparole@blc.test', 'password' => 'rahasia123', 'role_id' => null]);

        $this->postJson('/api/v1/auth/login', ['email' => 'tanparole@blc.test', 'password' => 'rahasia123'])
            ->assertStatus(403);
    }

    public function test_login_menolak_input_kosong(): void
    {
        $this->postJson('/api/v1/auth/login', [])->assertStatus(422)->assertJsonValidationErrors(['email', 'password']);
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

        $token = $this->postJson('/api/v1/auth/login', ['email' => 'instruktur@blc.test', 'password' => 'rahasia123'])
            ->json('token');

        $this->withToken($token)->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'instruktur@blc.test')
            ->assertJsonPath('user.role.slug', 'instruktur');
    }

    public function test_token_login_diterima_rute_yang_dilindungi_role(): void
    {
        $this->buatUser('instruktur');

        $token = $this->postJson('/api/v1/auth/login', ['email' => 'instruktur@blc.test', 'password' => 'rahasia123'])
            ->json('token');

        // lolos auth + role (controller masih placeholder => 501), bukan 401/403
        $this->withToken($token)->getJson('/api/v1/instruktur/daftar-peserta')->assertStatus(501);
        $this->withToken($token)->getJson('/api/v1/koordinator/monitoring')->assertStatus(403);
    }

    public function test_logout_mencabut_token(): void
    {
        $this->buatUser('peserta');

        $token = $this->postJson('/api/v1/auth/login', ['email' => 'peserta@blc.test', 'password' => 'rahasia123'])
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
}
