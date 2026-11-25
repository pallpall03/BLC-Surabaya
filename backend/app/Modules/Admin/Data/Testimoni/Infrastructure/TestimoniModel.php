<?php

namespace App\Modules\Admin\Data\Testimoni\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class TestimoniModel extends Model
{
    use HasFactory;

    protected $table = 'testimoni';

    protected $fillable = [
        'nama',
        'phone',
        'email',
        'kategori_id',
        'lokasi_blc_id',
        'isi_testimoni',
        'rating',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
        'kategori_id' => 'integer',
        'lokasi_blc_id' => 'integer',
    ];

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\Data\KategoriArtikel\Infrastructure\KategoriArtikelModel::class, 'kategori_id');
    }

    public function lokasi(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');  // ✅ Ganti filter is_surabaya jadi status
    }

    public function scopeLatest($query)
    {
        return $query->orderByDesc('created_at');
    }
}