<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AbsensiModel extends Model
{
    protected $table = 'absensi';
    protected $guarded = ['id'];
    protected $casts = [
        'tanggal' => 'date',
    ];

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(KelasModel::class, 'kelas_id');
    }

    public function peserta(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Instruktur\DaftarPeserta\Infrastructure\PesertaModel::class, 'peserta_id');
    }

    public function dicatatOleh(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel::class, 'dicatat_oleh');
    }

    public function foto(): HasMany
    {
        return $this->hasMany(AbsensiFotoModel::class, 'absensi_id');
    }
}