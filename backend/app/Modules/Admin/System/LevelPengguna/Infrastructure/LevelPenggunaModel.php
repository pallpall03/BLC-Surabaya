<?php

namespace App\Modules\Admin\System\LevelPengguna\Infrastructure;

use App\Modules\Admin\System\HakAkses\Infrastructure\HakAksesModel;
use App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel;
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

    public const ADMIN = 'admin';
    public const OPERATOR = 'operator';
    public const KOORDINATOR = 'koordinator';
    public const INSTRUKTUR = 'instruktur';
    public const USER = 'user';

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

    /**
     * @return array<string, string> slug => nama tampilan
     */
    public static function daftar(): array
    {
        return [
            self::ADMIN => 'Admin',
            self::OPERATOR => 'Operator',
            self::KOORDINATOR => 'Koordinator',
            self::INSTRUKTUR => 'Instruktur',
            self::USER => 'User',
        ];
    }
}