<?php

namespace App\Modules\Admin\Data\FotoSlider\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class FotoSliderModel extends Model
{
    use HasFactory;

    protected $table = 'foto_slider';

    protected $fillable = [
        'judul',
        'deskripsi',
        'gambar',
        'urutan',
        'aktif',
    ];

    protected $casts = [
        'urutan' => 'integer',
        'aktif' => 'boolean',
    ];

    public function scopeAktif($query)
    {
        return $query->where('aktif', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan');
    }
}