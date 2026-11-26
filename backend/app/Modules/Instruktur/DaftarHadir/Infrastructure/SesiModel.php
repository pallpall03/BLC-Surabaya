<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SesiModel extends Model
{
    protected $table = 'sesi';

    protected $fillable = [
        'sesi',
        'jam',
        'is_delete',
    ];

    protected $casts = [
        'sesi' => 'integer',
        'is_delete' => 'boolean',
    ];

    public function scopeAktif($query)
    {
        return $query->where('is_delete', false);
    }

    public function kelas(): HasMany
    {
        return $this->hasMany(KelasModel::class, 'sesi_id');
    }
}
