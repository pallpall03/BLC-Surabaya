<?php

namespace App\Modules\Setting\InstrukturProfile\Infrastructure;

use App\Modules\Setting\InstrukturProfile\Domain\InstrukturProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Eloquent Model untuk Profil Instruktur.
 */
final class InstrukturProfileModel extends Model
{
    use HasFactory;

    protected $table = 'instruktur_profiles';

    protected $fillable = [
        'pengguna_id',
        'nip',
        'nik',
        'lokasi_blc_id',
        'jabatan',
        'bidang_keahlian',
        'pendidikan_terakhir',
        'no_sertifikat',
        'tgl_bergabung',
        'status',
        'kantor_ku_user_id',
    ];

    protected $casts = [
        'tgl_bergabung' => 'date',
    ];

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Setting\Pengguna\Infrastructure\PenggunaModel::class, 'pengguna_id');
    }

    public function lokasiBlc(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Data\LokasiBlc\Infrastructure\LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeByLokasiBlc($query, int $lokasiBlcId)
    {
        return $query->where('lokasi_blc_id', $lokasiBlcId);
    }

    public function scopeByKantorKuUserId($query, string $kantorKuUserId)
    {
        return $query->where('kantor_ku_user_id', $kantorKuUserId);
    }
}