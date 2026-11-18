<?php

namespace App\Modules\Koordinator\Laporan\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PiagamModel extends Model
{
    protected $table = 'piagam';
    protected $guarded = ['id'];
    protected $casts = [
        'nilai' => 'integer',
        'tanggal_lulus' => 'date',
        'is_dicetak' => 'boolean',
    ];

    public function hasilUjian(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Koordinator\Monitoring\Infrastructure\HasilUjianModel::class, 'hasil_ujian_id');
    }
}