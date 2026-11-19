<?php

namespace App\Modules\Admin\Data\FotoSlider\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class FotoSliderModel extends Model
{
    use HasFactory;

    protected $table = 'foto_slider';

    protected $fillable = [
        'file_brosur',
        'ket_brosur',
        'tgl',
        'tipe',
        'status',
        'urutan',
    ];

    protected $casts = [
        'tgl' => 'datetime',
        'urutan' => 'integer',
    ];

    public function scopeAktif($query)
    {
        return $query->where('status', '1');
    }

    public function scopeTipe($query, string $tipe)
    {
        return $query->where('tipe', $tipe);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan')->orderByDesc('tgl');
    }
}