<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Modules\Auth\Contracts\UserRepository;
use Illuminate\Support\Facades\Hash;
use LogicException;
use Tests\TestCase;

class LoginIdentifierTest extends TestCase
{
    private object $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = new class implements UserRepository
        {
            public ?User $user = null;

            public ?string $lastLogin = null;

            public function findByLogin(string $login): ?User
            {
                $this->lastLogin = $login;

                return $this->user;
            }

            public function findByEmail(string $email): ?User
            {
                return null;
            }

            public function createWithRole(array $data, string $roleSlug): User
            {
                throw new LogicException('Tidak digunakan pada test login.');
            }
        };

        $this->app->instance(UserRepository::class, $this->repository);
    }

    public function test_login_menerima_username(): void
    {
        $this->repository->user = $this->user();

        $this->postJson('/api/v1/auth/login', [
            'login' => 'instruktur.demo',
            'password' => 'rahasia123',
        ])->assertOk()
            ->assertJsonPath('user.id', 42)
            ->assertJsonPath('user.role.slug', 'instruktur')
            ->assertJsonStructure(['token']);

        $this->assertSame('instruktur.demo', $this->repository->lastLogin);
    }

    public function test_login_menerima_nik_dan_membuang_spasi(): void
    {
        $this->repository->user = $this->user();

        $this->postJson('/api/v1/auth/login', [
            'login' => ' 3578010101900001 ',
            'password' => 'rahasia123',
        ])->assertOk()
            ->assertJsonPath('user.role.slug', 'instruktur');

        $this->assertSame('3578010101900001', $this->repository->lastLogin);
    }

    public function test_login_menolak_identifier_dan_password_kosong(): void
    {
        $this->postJson('/api/v1/auth/login', [
            'login' => '',
            'password' => '',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['login', 'password']);
    }

    private function user(): User
    {
        $user = new User;
        $user->id = 42;
        $user->name = 'Instruktur Uji';
        $user->nik = '3578010101900001';
        $user->username = 'instruktur.demo';
        $user->password = Hash::make('rahasia123');
        $user->failed_login_attempts = 0;
        $user->is_aktif = true;
        $user->setRelation('role', new Role(['slug' => 'instruktur', 'name' => 'Instruktur']));

        return $user;
    }
}
