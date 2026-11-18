<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Domain\Soal;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\SoalId;
use Illuminate\Database\Eloquent\Model;

class SoalEloquentModel extends Model
{
    protected $table = 'soals';
    protected $fillable = ['judul', 'deskripsi', 'tipe_soal', 'is_aktif'];
    protected $casts = ['is_aktif' => 'boolean'];
    public $timestamps = true;
}