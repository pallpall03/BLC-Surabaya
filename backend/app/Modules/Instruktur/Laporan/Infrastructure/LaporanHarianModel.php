<?php

namespace App\Modules\Instruktur\Laporan\Infrastructure;

use App\Modules\Admin\Data\TimBlc\Infrastructure\TimBlcModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasModel;
use App\Modules\Instruktur\Laporan\Domain\Laporan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class LaporanHarianModel extends Model
{
    protected $table = 'laporan_harian';

    protected $fillable = [
        'instruktur_id',
        'tanggal',
        'kelas_id',
        'aktivitas',
        'foto',
        'foto_deskripsi',
        'hadir',
        'total',
    ];

    protected $casts = [
        'instruktur_id' => 'integer',
        'tanggal' => 'date:Y-m-d',
        'kelas_id' => 'integer',
        'hadir' => 'integer',
        'total' => 'integer',
        'foto' => 'array',
        'foto_deskripsi' => 'array',
    ];

    public function instruktur(): BelongsTo
    {
        return $this->belongsTo(TimBlcModel::class, 'instruktur_id');
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(KelasModel::class, 'kelas_id');
    }

    public function toDomain(): Laporan
    {
        return new Laporan(
            id: (int) $this->id,
            tanggal: $this->tanggal->toDateString(),
            kelasId: $this->kelas_id === null ? null : (int) $this->kelas_id,
            kelas: $this->kelas?->nama_kelas,
            materi: $this->kelas?->materi?->nama_materi,
            hadir: (int) $this->hadir,
            total: (int) $this->total,
            aktivitas: $this->aktivitas,
            foto: array_values($this->foto ?? []),
            fotoDeskripsi: array_values($this->foto_deskripsi ?? []),
        );
    }
}
