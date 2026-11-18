<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

    public function test_register_membuat_pengguna_dan_mengembalikan_token(): void
    {
        $res = $this->postJson('/api/v1/auth/register', [
            'name' => 'Budi',
            'email' => 'budi@blc.test',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
        ]);

        $res->assertCreated()
            ->assertJsonPath('user.role.slug', 'pengguna')
            ->assertJsonStructure(['token', 'token_type', 'user' => ['id', 'name', 'email', 'role']]);

        $this->assertDatabaseHas('users', ['email' => 'budi@blc.test']);
    }

    public function test_register_tidak_bisa_memilih_role_sendiri(): void
    {
        $res = $this->postJson('/api/v1/auth/register', [
            'name' => 'Nakal',
            'email' => 'nakal@blc.test',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
            'role' => 'admin',
            'role_id' => Role::where('slug', 'admin')->value('id'),
        ]);

        $res->assertCreated()->assertJsonPath('user.role.slug', 'pengguna');
    }

    public function test_register_menolak_data_tidak_valid(): void
    {
        $this->buatUser('pengguna', 'ada@blc.test');

        $this->postJson('/api/v1/auth/register', [
            'name' => 'X',
            'email' => 'ada@blc.test',
            'password' => 'pendek',
        ])->assertStatus(422)->assertJsonValidationErrors(['email', 'password']);
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

    public function test_login_gagal_pesannya_sama_untuk_email_salah_dan_password_salah(): void
    {
        $this->buatUser('pengguna');

        $a = $this->postJson('/api/v1/auth/login', ['email' => 'pengguna@blc.test', 'password' => 'salah-total'])
            ->assertStatus(401);
        $b = $this->postJson('/api/v1/auth/login', ['email' => 'tidakada@blc.test', 'password' => 'salah-total'])
            ->assertStatus(401);

        $this->assertSame($a->json('message'), $b->json('message'));
    }

    public function test_login_dibatasi_setelah_5_kali_gagal(): void
    {
        $this->buatUser('pengguna');

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', ['email' => 'pengguna@blc.test', 'password' => 'salah'])->assertStatus(401);
        }

        // percobaan ke-6 ditolak walaupun password benar
        $this->postJson('/api/v1/auth/login', ['email' => 'pengguna@blc.test', 'password' => 'rahasia123'])
            ->assertStatus(429);
    }

    public function test_akun_tanpa_role_tidak_bisa_login(): void
    {
        User::factory()->create(['email' => 'tanparole@blc.test', 'password' => 'rahasia123', 'role_id' => null]);

        $this->postJson('/api/v1/auth/login', ['email' => 'tanparole@blc.test', 'password' => 'rahasia123'])
            ->assertStatus(403);
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

    public function test_logout_mencabut_token(): void
    {
        $user = $this->buatUser('pengguna');

        $token = $this->postJson('/api/v1/auth/login', ['email' => 'pengguna@blc.test', 'password' => 'rahasia123'])
            ->json('token');
        $this->assertSame(1, $user->tokens()->count());

        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertOk();

        $this->assertSame(0, $user->fresh()->tokens()->count());
    }
}
