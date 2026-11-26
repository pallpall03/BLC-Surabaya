<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use App\Modules\Admin\Data\TimBlc\Infrastructure\TimBlcModel;
use App\Modules\Instruktur\DaftarPeserta\Infrastructure\PesertaModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KelasPesertaModel extends Model
{
    protected $table = 'kelas_peserta';

    protected $fillable = [
        'kelas_id',
        'peserta_id',
        'instruktur_id',
        'is_delete',
    ];

    protected $casts = [
        'is_delete' => 'boolean',
    ];

    public function scopeAktif($query)
    {
        return $query->where('is_delete', false);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(KelasModel::class, 'kelas_id');
    }

    public function peserta(): BelongsTo
    {
        return $this->belongsTo(PesertaModel::class, 'peserta_id');
    }

    public function instruktur(): BelongsTo
    {
        return $this->belongsTo(TimBlcModel::class, 'instruktur_id');
    }
}
