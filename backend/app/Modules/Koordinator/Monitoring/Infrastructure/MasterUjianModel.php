<?php

namespace App\Modules\Koordinator\Monitoring\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterUjianModel extends Model
{
    protected $table = 'master_ujian';
    protected $guarded = ['id'];
    protected $casts = [
        'durasi_menit' => 'integer',
        'jumlah_soal' => 'integer',
        'nilai_minimum' => 'integer',
        'acak_soal' => 'boolean',
        'acak_jawaban' => 'boolean',
        'tampilkan_hasil' => 'boolean',
        'is_aktif' => 'boolean',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function materi(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Instruktur\DaftarHadir\Infrastructure\MateriModel::class, 'materi_id');
    }

    public function soal(): HasMany
    {
        return $this->hasMany(SoalUjianModel::class, 'master_ujian_id');
    }

    public function hasil(): HasMany
    {
        return $this->hasMany(HasilUjianModel::class, 'master_ujian_id');
    }

    public function piagam(): HasMany
    {
        return $this->hasMany(\App\Modules\Koordinator\Laporan\Infrastructure\PiagamModel::class, 'master_ujian_id');
    }
}