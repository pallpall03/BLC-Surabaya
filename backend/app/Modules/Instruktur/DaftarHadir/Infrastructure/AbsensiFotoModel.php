<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AbsensiFotoModel extends Model
{
    protected $table = 'absensi_foto';
    protected $guarded = ['id'];
    protected $casts = [
        'ukuran' => 'integer',
    ];

    public function absensi(): BelongsTo
    {
        return $this->belongsTo(AbsensiModel::class, 'absensi_id');
    }

    public function diunggahOleh(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel::class, 'diunggah_oleh');
    }
}