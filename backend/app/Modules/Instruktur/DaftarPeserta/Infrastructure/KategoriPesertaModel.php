<?php

namespace App\Modules\Instruktur\DaftarPeserta\Infrastructure;

use Illuminate\Database\Eloquent\Model;

class KategoriPesertaModel extends Model
{
    protected $table = 'kategori_artikel';
    protected $guarded = ['id'];
    protected $casts = [
        'urutan' => 'integer',
        'is_delete' => 'boolean',
    ];
}
