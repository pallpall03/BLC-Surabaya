<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Domain\MateriPerPertemuan;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MateriPerPertemuanId;
use Illuminate\Database\Eloquent\Model;

class MateriPerPertemuanEloquentModel extends Model
{
    protected $table = 'materi_per_pertemuans';
    protected $fillable = ['materi_id', 'pertemuan_ke', 'judul', 'deskripsi', 'file_path'];
    protected $casts = ['pertemuan_ke' => 'integer'];
    public $timestamps = true;
}