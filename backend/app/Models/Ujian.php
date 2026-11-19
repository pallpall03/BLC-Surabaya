<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    use HasFactory;

    protected $table = 'ujian';

    protected $fillable = [
        'judul',
        'slug',
        'deskripsi',
        'durasi_menit',
        'urutan',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'urutan' => 'integer',
        'durasi_menit' => 'integer',
    ];

    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true)->where('is_delete', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan')->orderBy('judul');
    }
}
