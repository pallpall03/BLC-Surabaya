<?php

namespace App\Modules\Instruktur\DaftarPeserta\Infrastructure;

use Illuminate\Database\Eloquent\Model;

class KategoriPesertaModel extends Model
{
    protected $table = 'kategori_peserta';
    protected $guarded = ['id'];
    protected $casts = [
        'is_aktif' => 'boolean',
    ];
}