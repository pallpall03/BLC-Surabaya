<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Domain\Instruktur;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\InstrukturId;
use Illuminate\Database\Eloquent\Model;

class InstrukturEloquentModel extends Model
{
    protected $table = 'instrukturs';
    protected $fillable = ['nama_lengkap', 'username', 'jenis_kelamin', 'lokasiBlcId', 'kantor_ku_user_id', 'email', 'telepon', 'alamat', 'is_aktif'];
    protected $casts = ['is_aktif' => 'boolean', 'lokasiBlcId' => 'array'];
    public $timestamps = true;
}