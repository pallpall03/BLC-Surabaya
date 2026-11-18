<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Domain\Materi;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MateriId;
use Illuminate\Database\Eloquent\Model;

class MateriEloquentModel extends Model
{
    protected $table = 'materis';
    protected $fillable = ['judul', 'deskripsi', 'file_path', 'tipe', 'is_aktif'];
    protected $casts = ['is_aktif' => 'boolean'];
    public $timestamps = true;
}