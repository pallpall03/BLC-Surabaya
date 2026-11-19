<?php

namespace App\Modules\Koordinator\LaporanAbsensi\Infrastructure;

use App\Modules\Koordinator\LaporanAbsensi\Domain\LaporanAbsensi;
use App\Modules\Koordinator\LaporanAbsensi\Domain\ValueObjects\LaporanAbsensiId;
use Illuminate\Database\Eloquent\Model;

class LaporanAbsensiEloquentModel extends Model
{
    protected $table = 'laporan_absensis';
    protected $fillable = [
        'sesi_id',
        'instruktur_id',
        'lokasi_blc_id',
        'periode_mulai',
        'periode_akhir',
        'total_peserta',
        'total_hadir',
        'total_tidak_hadir',
        'persentase_kehadiran',
    ];
    public $timestamps = true;

    public function toDomain(): LaporanAbsensi
    {
        return new LaporanAbsensi(
            new LaporanAbsensiId($this->id),
            $this->sesi_id,
            $this->instruktur_id,
            $this->lokasi_blc_id,
            $this->periode_mulai,
            $this->periode_akhir,
            $this->total_peserta,
            $this->total_hadir,
            $this->total_tidak_hadir,
            $this->persentase_kehadiran
        );
    }
}