<?php

namespace App\Modules\Koordinator\PiagamPeserta\Infrastructure;

use App\Modules\Koordinator\PiagamPeserta\Domain\PiagamPeserta;
use App\Modules\Koordinator\PiagamPeserta\Domain\ValueObjects\PiagamPesertaId;
use Illuminate\Database\Eloquent\Model;

class PiagamPesertaEloquentModel extends Model
{
    protected $table = 'piagam_pesertas';
    protected $fillable = [
        'peserta_id',
        'sesi_id',
        'judul',
        'deskripsi',
        'file_path',
        'status',
        'tanggal_terbit',
    ];
    protected $casts = [
        'tanggal_terbit' => 'datetime',
    ];
    public $timestamps = true;

    public function toDomain(): PiagamPeserta
    {
        return new PiagamPeserta(
            new PiagamPesertaId($this->id),
            $this->peserta_id,
            $this->sesi_id,
            $this->judul,
            $this->deskripsi,
            $this->file_path,
            $this->status,
            $this->tanggal_terbit
        );
    }
}