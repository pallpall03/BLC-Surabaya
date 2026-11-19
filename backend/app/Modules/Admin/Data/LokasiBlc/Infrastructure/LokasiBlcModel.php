<?php

namespace App\Modules\Admin\Data\LokasiBlc\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class LokasiBlcModel extends Model
{
    use HasFactory;

    protected $table = 'lokasi_blc';

    protected $fillable = [
        'nama_blc',
        'alamat',
        'foto_blc',
        'foto2_blc',
        'is_delete',
        'radius',
        'latitude',
        'longitude',
        'foto_absen_ins',
        'ver_foto_absen_ins',
        'area',
        'aktif',
        'is_korwil',
        'is_teknisi_ahli',
        'is_teknisi',
    ];

    protected $casts = [
        'is_delete' => 'boolean',
        'aktif' => 'boolean',
        'is_korwil' => 'boolean',
        'is_teknisi_ahli' => 'boolean',
        'is_teknisi' => 'boolean',
        'ver_foto_absen_ins' => 'integer',
    ];

    public function scopeAktif($query)
    {
        return $query->where('is_delete', false)->where('aktif', true);
    }
}