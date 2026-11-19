<?php

namespace App\Modules\Admin\Data\TimBlc\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class TimBlcModel extends Model
{
    use HasFactory;

    protected $table = 'tim_blc';

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'gender',
        'email',
        'alamat',
        'role',
        'avatar',
        'phone',
        'kategori_id',
        'lokasi_blc_id',
        'nik',
        'tanggal_lahir',
        'kecamatan',
        'kelurahan',
        'username',
        'is_delete',
        'is_surabaya',
    ];

    protected $casts = [
        'is_delete' => 'boolean',
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
        return $query->where('is_delete', false)->where('is_surabaya', true);
    }

    public function scopeInstruktur($query)
    {
        return $query->where('role', 'instruktur');
    }

    public function scopeKoordinator($query)
    {
        return $query->where('role', 'koordinator');
    }
}