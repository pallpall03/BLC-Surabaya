<?php

namespace App\Modules\Koordinator\Absensi\Infrastructure;

use App\Modules\Koordinator\Absensi\Domain\Absensi;
use App\Modules\Koordinator\Absensi\Domain\ValueObjects\AbsensiId;
use Illuminate\Database\Eloquent\Model;

class AbsensiEloquentModel extends Model
{
    protected $table = 'absensis';
    protected $fillable = [
        'peserta_id',
        'sesi_id',
        'instruktur_id',
        'lokasi_blc_id',
        'waktu_absen',
        'status',
        'keterangan',
    ];
    protected $casts = [
        'waktu_absen' => 'datetime',
    ];
    public $timestamps = true;

    public function toDomain(): Absensi
    {
        return new Absensi(
            new AbsensiId($this->id),
            $this->peserta_id,
            $this->sesi_id,
            $this->instruktur_id,
            $this->lokasi_blc_id,
            $this->waktu_absen,
            $this->status,
            $this->keterangan
        );
    }
}