<?php

namespace App\Modules\Koordinator\Monitoring\Infrastructure;

use App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JadwalUjianModel extends Model
{
    protected $table = 'jadwal_ujian';

    protected $fillable = [
        'master_ujian_id',
        'kelas_id',
        'mulai',
        'selesai',
        'token',
        'is_delete',
    ];

    protected $casts = [
        'mulai' => 'datetime',
        'selesai' => 'datetime',
        'is_delete' => 'boolean',
    ];

    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('jadwal_ujian.is_delete', false);
    }

    public function masterUjian(): BelongsTo
    {
        return $this->belongsTo(MasterUjianModel::class, 'master_ujian_id');
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(KelasModel::class, 'kelas_id');
    }
}
