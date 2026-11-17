<?php

namespace App\Modules\Setting\LevelPengguna\Infrastructure;

use App\Modules\Setting\HakAkses\Infrastructure\HakAksesModel;
use App\Modules\Setting\Pengguna\Infrastructure\PenggunaModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Eloquent Model untuk Level Pengguna (Role).
 * Dipakai oleh EloquentLevelPenggunaRepository.
 */
final class LevelPenggunaModel extends Model
{
    use HasFactory;

    protected $table = 'level_pengguna';

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'urutan',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'urutan' => 'integer',
    ];

    /**
     * Relasi ke Hak Akses (permissions)
     */
    public function hakAkses(): HasMany
    {
        return $this->hasMany(HakAksesModel::class, 'level_pengguna_id');
    }

    /**
     * Relasi ke Pengguna (users)
     */
    public function pengguna(): HasMany
    {
        return $this->hasMany(PenggunaModel::class, 'level_pengguna_id');
    }

    /**
     * Scope: hanya level aktif
     */
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    /**
     * Scope: urutkan by urutan
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan')->orderBy('nama');
    }

    /**
     * Scope: cari by slug
     */
    public function scopeBySlug($query, string $slug)
    {
        return $query->where('slug', $slug);
    }
}