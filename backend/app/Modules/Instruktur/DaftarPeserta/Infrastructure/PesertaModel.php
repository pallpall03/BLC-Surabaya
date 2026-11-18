<?php

namespace App\Modules\Instruktur\DaftarPeserta\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesertaModel extends Model
{
    protected $table = 'peserta';
    protected $guarded = ['id'];
    protected $casts = [
        'tanggal_lahir' => 'date',
        'tervalidasi' => 'boolean',
        'tanggal_validasi' => 'datetime',
    ];

    public function lokasiBlc(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function kategoriPeserta(): BelongsTo
    {
        return $this->belongsTo(KategoriPesertaModel::class, 'kategori_peserta_id');
    }

    public function divalidasiOleh(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel::class, 'divalidasi_oleh');
    }
}