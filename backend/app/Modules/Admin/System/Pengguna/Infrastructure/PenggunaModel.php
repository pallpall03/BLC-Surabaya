<?php

namespace App\Modules\Setting\Pengguna\Infrastructure;

use App\Modules\Setting\LevelPengguna\Infrastructure\LevelPenggunaModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

/**
 * Eloquent Model untuk Pengguna (User).
 * Dipakai oleh EloquentPenggunaRepository.
 * Menggunakan Sanctum HasApiTokens untuk API authentication.
 */
final class PenggunaModel extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'pengguna';

    protected $fillable = [
        'level_pengguna_id',
        'nama_lengkap',
        'email',
        'password',
        'telepon',
        'alamat',
        'foto_profil',
        'is_aktif',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_aktif' => 'boolean',
        'password' => 'hashed',
    ];

    /**
     * Relasi ke Level Pengguna (Role)
     */
    public function levelPengguna(): BelongsTo
    {
        return $this->belongsTo(LevelPenggunaModel::class, 'level_pengguna_id');
    }

    /**
     * Scope: hanya pengguna aktif
     */
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    /**
     * Scope: dengan level pengguna (eager load)
     */
    public function scopeWithLevel($query)
    {
        return $query->with('levelPengguna');
    }

    /**
     * Scope: cari by email
     */
    public function scopeByEmail($query, string $email)
    {
        return $query->where('email', $email);
    }

    /**
     * Scope: filter by level
     */
    public function scopeByLevel($query, string $levelSlug)
    {
        return $query->whereHas('levelPengguna', fn ($q) => $q->where('slug', $levelSlug));
    }

    /**
     * Get nama singkat untuk display
     */
    public function getInitialsAttribute(): string
    {
        $words = explode(' ', trim($this->nama_lengkap));
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
        return $this->levelPengguna?->slug === 'super_admin';
    }

    /**
     * Cek apakah pengguna adalah Admin
     */
    public function isAdmin(): bool
    {
        return $this->levelPengguna?->slug === 'admin';
    }

    /**
     * Cek apakah pengguna adalah Koordinator
     */
    public function isKoordinator(): bool
    {
        return $this->levelPengguna?->slug === 'koordinator';
    }

    /**
     * Cek apakah pengguna adalah Instruktur
     */
    public function isInstruktur(): bool
    {
        return $this->levelPengguna?->slug === 'instruktur';
    }

    /**
     * Cek apakah pengguna bisa mengelola (admin level)
     */
    public function canManage(): bool
    {
        return in_array($this->levelPengguna?->slug, ['super_admin', 'admin']);
    }
}