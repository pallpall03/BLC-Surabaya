<?php

namespace App\Modules\Koordinator\Monitoring\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SoalUjianModel extends Model
{
    protected $table = 'soal_ujian';

    protected $fillable = [
        'master_ujian_id',
        'pertanyaan',
        'pilihan',
        'jawaban_benar',
        'nomor',
        'bobot',
        'penjelasan',
        'is_aktif',
    ];

    protected $casts = [
        'pilihan' => 'array',
        'jawaban_benar' => 'integer',
        'nomor' => 'integer',
        'bobot' => 'integer',
        'is_aktif' => 'boolean',
    ];

    public function masterUjian(): BelongsTo
    {
        return $this->belongsTo(MasterUjianModel::class, 'master_ujian_id');
    }
}