<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

#[Fillable(['name', 'nik', 'email', 'password', 'role_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'locked_at' => 'datetime',
        ];
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /** Klaim tambahan sengaja kosong: role dibaca dari database, bukan dari isi token. */
    public function getJWTCustomClaims(): array
    {
        return [];
    }

    /** Akun terkunci setelah terlalu banyak salah password; hanya admin yang bisa membuka. */
    public function terkunci(): bool
    {
        return $this->locked_at !== null;
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Cek apakah pengguna memiliki salah satu dari role yang diberikan (berdasarkan slug).
     */
    public function hasRole(string ...$slugs): bool
    {
        $slug = $this->role?->slug;

        return $slug !== null && in_array($slug, $slugs, true);
    }
}
