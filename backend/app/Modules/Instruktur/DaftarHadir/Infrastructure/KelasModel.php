<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use App\Modules\Admin\Data\TimBlc\Infrastructure\TimBlcModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KelasModel extends Model
{
    protected $table = 'kelas';

    protected $fillable = [
        'nama_kelas',
        'materi_id',
        'instruktur_id',
        'sesi_id',
        'lokasi_blc_id',
        'hari',
        'status',
        'is_delete',
    ];

    protected $casts = [
        'status' => 'integer',
        'is_delete' => 'boolean',
    ];

    public function scopeAktif($query)
    {
        return $query->where('is_delete', false);
    }

    public function instruktur(): BelongsTo
    {
        return $this->belongsTo(TimBlcModel::class, 'instruktur_id');
    }

    public function materi(): BelongsTo
    {
        return $this->belongsTo(MateriModel::class, 'materi_id');
    }

    public function sesi(): BelongsTo
    {
        return $this->belongsTo(SesiModel::class, 'sesi_id');
    }

    public function lokasiBlc(): BelongsTo
    {
        return $this->belongsTo(LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function kelasPeserta(): HasMany
    {
        return $this->hasMany(KelasPesertaModel::class, 'kelas_id');
    }
}
