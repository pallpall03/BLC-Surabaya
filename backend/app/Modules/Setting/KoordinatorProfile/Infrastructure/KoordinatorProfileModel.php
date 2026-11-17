<?php

namespace App\Modules\Setting\KoordinatorProfile\Infrastructure;

use App\Modules\Setting\KoordinatorProfile\Domain\KoordinatorProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Eloquent Model untuk Profil Koordinator.
 */
final class KoordinatorProfileModel extends Model
{
    use HasFactory;

    protected $table = 'koordinator_profiles';

    protected $fillable = [
        'pengguna_id',
        'nip',
        'nik',
        'lokasi_blc_ids',
        'jabatan',
        'bidang_koordinasi',
        'tgl_bergabung',
        'status',
        'kantor_ku_user_id',
    ];

    protected $casts = [
        'lokasi_blc_ids' => 'array',
        'tgl_bergabung' => 'date',
    ];

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Setting\Pengguna\Infrastructure\PenggunaModel::class, 'pengguna_id');
    }

    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeByLokasiBlc($query, int $lokasiBlcId)
    {
        return $query->whereJsonContains('lokasi_blc_ids', $lokasiBlcId);
    }

    public function scopeByKantorKuUserId($query, string $kantorKuUserId)
    {
        return $query->where('kantor_ku_user_id', $kantorKuUserId);
    }
}