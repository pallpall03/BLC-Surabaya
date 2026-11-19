<?php

namespace App\Modules\Admin\Data\Artikel\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ArtikelModel extends Model
{
    use HasFactory;

    protected $table = 'artikel';

    protected $fillable = [
        'kategori_artikel_id',
        'judul',
        'keterangan',
        'lokasi',
        'created_by',
        'sesi_id',
        'is_delete',
    ];

    protected $casts = [
        'is_delete' => 'boolean',
    ];

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriArtikelModel::class, 'kategori_artikel_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel::class, 'created_by');
    }

    public function fotos(): HasMany
    {
        return $this->hasMany(ArtikelFotoModel::class, 'artikel_id');
    }

    public function scopeAktif($query)
    {
        return $query->where('is_delete', false);
    }

    public function scopeLatest($query)
    {
        return $query->orderByDesc('created_at');
    }
}