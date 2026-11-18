<?php

namespace App\Modules\Instruktur\InstrukturProfile\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Pengguna;
use App\Models\LokasiBlc;

class InstrukturProfileModel extends Model
{
    protected $table = 'instruktur_profiles';
    protected $primaryKey = 'id';
    protected $fillable = [
        'pengguna_id',
        'kantor_ku_user_id',
        'lokasi_blc_id',
        'nip',
        'bidang_keahlian',
        'riwayat_pendidikan',
        'riwayat_pelatihan',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'pengguna_id');
    }

    public function lokasiBlc(): BelongsTo
    {
        return $this->belongsTo(LokasiBlc::class, 'lokasi_blc_id');
    }
}