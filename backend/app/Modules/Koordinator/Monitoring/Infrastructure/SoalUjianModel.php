<?php

namespace App\Modules\Koordinator\Monitoring\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SoalUjianModel extends Model
{
    protected $table = 'soal_ujian';
    protected $guarded = ['id'];
    protected $casts = [
        'pilihan' => 'array',
        'bobot' => 'integer',
        'is_aktif' => 'boolean',
    ];

    public function masterUjian(): BelongsTo
    {
        return $this->belongsTo(MasterUjianModel::class, 'master_ujian_id');
    }
}