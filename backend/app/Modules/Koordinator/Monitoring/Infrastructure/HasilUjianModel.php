<?php

namespace App\Modules\Koordinator\Monitoring\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HasilUjianModel extends Model
{
    protected $table = 'hasil_ujian';
    protected $guarded = ['id'];
    protected $casts = [
        'jawaban' => 'array',
        'skor' => 'integer',
        'nilai' => 'integer',
        'lulus' => 'boolean',
        'waktu_mulai' => 'integer',
        'waktu_selesai' => 'integer',
        'durasi_detik' => 'integer',
    ];

    public function masterUjian(): BelongsTo
    {
        return $this->belongsTo(MasterUjianModel::class, 'master_ujian_id');
    }

    public function peserta(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Instruktur\DaftarPeserta\Infrastructure\PesertaModel::class, 'peserta_id');
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasModel::class, 'kelas_id');
    }
}