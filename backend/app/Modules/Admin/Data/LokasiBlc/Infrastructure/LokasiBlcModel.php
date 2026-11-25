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
        'latitude',
        'longitude',
        'area',
        'aktif',
        'jumlah_slot_computer',
        'jadwal_blc',
        'wilayah_surabaya',
    ];

    protected $casts = [
        'is_delete' => 'boolean',
        'aktif' => 'boolean',
        'jumlah_slot_computer' => 'integer',
    ];

    public function scopeAktif($query)
    {
        return $query->where('is_delete', false)->where('aktif', true);
    }
}