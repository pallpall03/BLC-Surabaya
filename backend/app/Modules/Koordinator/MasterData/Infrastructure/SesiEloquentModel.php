<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Domain\Sesi;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\SesiId;
use Illuminate\Database\Eloquent\Model;

class SesiEloquentModel extends Model
{
    protected $table = 'sesi';
    protected $fillable = ['judul', 'deskripsi', 'tanggal_mulai', 'tanggal_akhir', 'is_aktif'];
    protected $casts = ['is_aktif' => 'boolean'];
    public $timestamps = true;
}