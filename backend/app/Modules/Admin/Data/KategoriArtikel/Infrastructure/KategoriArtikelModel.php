<?php

namespace App\Modules\Admin\Data\KategoriArtikel\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class KategoriArtikelModel extends Model
{
    use HasFactory;

    protected $table = 'kategori_artikel';

    protected $fillable = [
        'jenis_kategori',
        'nama_kelompok',
        'urutan',
        'is_delete',
    ];

    protected $casts = [
        'is_delete' => 'boolean',
        'urutan' => 'integer',
    ];

    public function artikel(): HasMany
    {
        return $this->hasMany(ArtikelModel::class, 'kategori_artikel_id');
    }

    public function scopeAktif($query)
    {
        return $query->where('is_delete', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan')->orderBy('nama_kelompok');
    }
}