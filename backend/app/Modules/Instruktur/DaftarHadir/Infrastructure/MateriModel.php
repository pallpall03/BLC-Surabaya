<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MateriModel extends Model
{
    protected $table = 'materi';
    protected $guarded = ['id'];
    protected $casts = [
        'durasi_jam' => 'integer',
        'is_aktif' => 'boolean',
    ];

    public function sesi(): HasMany
    {
        return $this->hasMany(SesiModel::class, 'materi_id');
    }

    public function kelas(): HasMany
    {
        return $this->hasMany(KelasModel::class, 'materi_id');
    }

    public function ujian(): HasMany
    {
        return $this->hasMany(\App\Modules\Koordinator\Monitoring\Infrastructure\MasterUjianModel::class, 'materi_id');
    }
}