<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MateriModel extends Model
{
    protected $table = 'materi';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'nama_materi',
        'id_index',
        'is_delete',
    ];

    protected $casts = [
        'id_index' => 'integer',
        'is_delete' => 'boolean',
    ];

    public function scopeAktif($query)
    {
        return $query->where('is_delete', false);
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
