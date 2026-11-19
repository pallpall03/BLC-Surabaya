<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Piagam extends Model
{
    use HasFactory;

    protected $table = 'piagam';

    protected $fillable = [
        'judul',
        'slug',
        'deskripsi',
        'template_file',
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
        return $query->orderBy('urutan')->orderBy('judul');
    }
}
