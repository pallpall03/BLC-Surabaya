<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modul extends Model
{
    use HasFactory;

    protected $table = 'modul';

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'urutan',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'urutan' => 'integer',
    ];

    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true)->where('is_delete', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan')->orderBy('nama');
    }
}
