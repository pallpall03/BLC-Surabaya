<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Domain\Modul;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\ModulId;
use Illuminate\Database\Eloquent\Model;

class ModulEloquentModel extends Model
{
    protected $table = 'moduls';
    protected $fillable = ['judul', 'deskripsi', 'tipe', 'is_aktif'];
    protected $casts = ['is_aktif' => 'boolean'];
    public $timestamps = true;
}