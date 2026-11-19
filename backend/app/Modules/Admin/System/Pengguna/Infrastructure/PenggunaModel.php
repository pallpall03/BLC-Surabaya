<?php

namespace App\Modules\Admin\System\Pengguna\Infrastructure;

use App\Models\User as BaseUser;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Proxy model untuk User (tabel users).
 * Dipakai oleh EloquentPenggunaRepository.
 */
final class PenggunaModel extends BaseUser
{
    protected $table = 'users';

    protected $fillable = [
        'role_id',
        'username',
        'password',
        'name',
        'email',
        'status',
        'tipe',
        'plain_password',
        'last_login_at',
        'is_aktif',
    ];

    protected $hidden = [
        'password',
        'plain_password',
        'remember_token',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'last_login_at' => 'datetime',
        'password' => 'hashed',
        'email_verified_at' => 'datetime',
    ];

    /**
     * Relasi ke Role
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Role::class, 'role_id');
    }

    /**
     * Scope: hanya pengguna aktif
     */
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    /**
     * Scope: dengan role (eager load)
     */
    public function scopeWithRole($query)
    {
        return $query->with('role');
    }

    /**
     * Scope: cari by email
     */
    public function scopeByEmail($query, string $email)
    {
        return $query->where('email', $email);
    }

    /**
     * Scope: filter by role slug
     */
    public function scopeByRole($query, string $roleSlug)
    {
        return $query->whereHas('role', fn ($q) => $q->where('slug', $roleSlug));
    }

    /**
     * Get nama singkat untuk display
     */
    public function getInitialsAttribute(): string
    {
        $words = explode(' ', trim($this->name));
        $initials = '';
        foreach ($words as $word) {
            $initials .= mb_strtoupper($word[0]);
        }
        return $initials;
    }

    /**
     * Cek apakah pengguna adalah Super Admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role?->slug === 'superadmin';
    }

    /**
     * Cek apakah pengguna adalah Admin
     */
    public function isAdmin(): bool
    {
        return $this->role?->slug === 'admin';
    }

    /**
     * Cek apakah pengguna adalah Koordinator
     */
    public function isKoordinator(): bool
    {
        return $this->role?->slug === 'koordinator';
    }

    /**
     * Cek apakah pengguna adalah Instruktur
     */
    public function isInstruktur(): bool
    {
        return $this->role?->slug === 'instruktur';
    }

    /**
     * Cek apakah pengguna bisa mengelola (admin level)
     */
    public function canManage(): bool
    {
        return in_array($this->role?->slug, ['superadmin', 'admin']);
    }
}
