<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Domain\InstrukturArea;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\InstrukturAreaId;
use Illuminate\Database\Eloquent\Model;

class InstrukturAreaEloquentModel extends Model
{
    protected $table = 'instruktur_areas';
    protected $fillable = ['nama_area', 'instruktur_id', 'lokasi_blc_id', 'lokasi_blc_nama'];
    protected $casts = ['is_aktif' => 'boolean'];
    public $timestamps = true;
}