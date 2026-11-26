<?php

namespace App\Modules\Instruktur\FotoKegiatan\Infrastructure;

use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\SesiModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class FotoKegiatanPengunjungModel extends Model
{
    protected $table = 'foto_kegiatan_pengunjung';

    protected $fillable = [
        'tanggal',
        'sesi_id',
        'lokasi_blc_id',
        'keterangan',
        'foto',
        'foto_deskripsi',
        'created_by',
        'is_delete',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
        'foto' => 'array',
        'foto_deskripsi' => 'array',
        'is_delete' => 'boolean',
    ];

    public function sesi(): BelongsTo
    {
        return $this->belongsTo(SesiModel::class, 'sesi_id');
    }

    public function blc(): BelongsTo
    {
        return $this->belongsTo(LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('is_delete', false);
    }
}
