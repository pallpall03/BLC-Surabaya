<?php

namespace App\Modules\Koordinator\Monitoring\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterUjianModel extends Model
{
    protected $table = 'master_ujian';

    protected $fillable = [
        'judul',
        'materi_id',
        'tipe',
        'durasi_menit',
        'nilai_minimum',
        'acak_soal',
        'is_aktif',
        'is_delete',
    ];

    protected $casts = [
        'durasi_menit' => 'integer',
        'nilai_minimum' => 'integer',
        'acak_soal' => 'boolean',
        'is_aktif' => 'boolean',
        'is_delete' => 'boolean',
    ];

    public function materi(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Instruktur\DaftarHadir\Infrastructure\MateriModel::class, 'materi_id');
    }

    public function soal(): HasMany
    {
        return $this->hasMany(SoalUjianModel::class, 'master_ujian_id')->orderBy('nomor');
    }

    public function jadwal(): HasMany
    {
        return $this->hasMany(JadwalUjianModel::class, 'master_ujian_id');
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