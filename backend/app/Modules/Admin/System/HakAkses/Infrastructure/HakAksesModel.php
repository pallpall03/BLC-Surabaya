<?php

namespace App\Modules\Admin\System\HakAkses\Infrastructure;

use App\Modules\Admin\System\LevelPengguna\Infrastructure\LevelPenggunaModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Eloquent Model untuk Hak Akses (Permission).
 * Dipakai oleh EloquentHakAksesRepository.
 */
final class HakAksesModel extends Model
{
    use HasFactory;

    protected $table = 'hak_akses';

    protected $fillable = [
        'level_pengguna_id',
        'modul',
        'aksi',
        'diizinkan',
    ];

    protected $casts = [
        'diizinkan' => 'boolean',
    ];

    /**
     * Relasi ke Level Pengguna
     */
    public function levelPengguna(): BelongsTo
    {
        return $this->belongsTo(LevelPenggunaModel::class, 'level_pengguna_id');
    }

    /**
     * Scope: filter by modul
     */
    public function scopeForModul($query, string $modul)
    {
        return $query->where(function ($q) use ($modul) {
            $q->where('modul', $modul)->orWhere('modul', '*');
        });
    }

    /**
     * Scope: filter by aksi
     */
    public function scopeForAksi($query, string $aksi)
    {
        return $query->where(function ($q) use ($aksi) {
            $q->where('aksi', $aksi)->orWhere('aksi', '*');
        });
    }

    /**
     * Scope: hanya yang diizinkan
     */
    public function scopeDiizinkan($query)
    {
        return $query->where('diizinkan', true);
    }

    /**
     * Scope: untuk level pengguna tertentu
     */
    public function scopeForLevel($query, int $levelPenggunaId)
    {
        return $query->where('level_pengguna_id', $levelPenggunaId);
    }

    /**
     * Cek apakah ini wildcard permission
     */
    public function isWildcard(): bool
    {
        return $this->modul === '*' && $this->aksi === '*';
    }
}