<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KelasModel extends Model
{
    protected $table = 'kelas';
    protected $guarded = ['id'];
    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'jam_mulai' => 'datetime:H:i',
        'jam_selesai' => 'datetime:H:i',
        'kapasitas' => 'integer',
    ];

    public function instruktur(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Instruktur\InstrukturProfile\Infrastructure\InstrukturProfileModel::class, 'instruktur_id');
    }

    public function materi(): BelongsTo
    {
        return $this->belongsTo(MateriModel::class, 'materi_id');
    }

    public function lokasiBlc(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function absensi(): HasMany
    {
        return $this->hasMany(AbsensiModel::class, 'kelas_id');
    }

    public function peserta(): HasMany
    {
        return $this->hasManyThrough(
            PesertaModel::class,
            AbsensiModel::class,
            'kelas_id',
            'id',
            'id',
            'peserta_id'
        );
    }
}