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
        'alamat',
        'phone',
        'gender',
        'email',
        'kategori_id',
        'keperluan',
        'lokasi_blc_id',
        'materi_id',
        'is_surabaya',
        'tanggal_lahir',
        'kecamatan',
        'kelurahan',
        'status',  // ✅ Tambahin baris ini
    ];

    protected $casts = [
        'is_surabaya' => 'boolean',
        'tanggal_lahir' => 'date',
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