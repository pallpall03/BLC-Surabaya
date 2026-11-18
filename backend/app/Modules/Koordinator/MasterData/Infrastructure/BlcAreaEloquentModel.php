<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Domain\BlcArea;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\BlcAreaId;
use Illuminate\Database\Eloquent\Model;

class BlcAreaEloquentModel extends Model
{
    protected $table = 'blc_areas';
    protected $fillable = ['nama', 'alamat', 'koordinator_id', 'is_aktif'];
    protected $casts = ['is_aktif' => 'boolean'];
    public $timestamps = true;
}