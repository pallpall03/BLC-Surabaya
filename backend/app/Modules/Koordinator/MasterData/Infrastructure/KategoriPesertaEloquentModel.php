<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Domain\KategoriPeserta;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\KategoriPesertaId;
use Illuminate\Database\Eloquent\Model;

class KategoriPesertaEloquentModel extends Model
{
    protected $table = 'kategori_pesertas';
    protected $fillable = ['nama', 'deskripsi', 'is_aktif'];
    protected $casts = ['is_aktif' => 'boolean'];
    public $timestamps = true;
}