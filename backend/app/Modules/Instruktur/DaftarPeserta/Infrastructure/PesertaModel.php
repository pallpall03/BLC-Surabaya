<?php

namespace App\Modules\Instruktur\DaftarPeserta\Infrastructure;

use App\Models\User;
use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PesertaModel extends Model
{
    use SoftDeletes;

    protected $table = 'peserta';

    /** Hanya kolom isian form. Status validasi diubah lewat SetValidasiPeserta (forceFill). */
    protected $fillable = [
        'nik',
        'nama',
        'jk',
        'tanggal_lahir',
        'telepon',
        'alamat',
        'lokasi_blc_id',
        'kategori_peserta_id',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tervalidasi' => 'boolean',
        'tanggal_validasi' => 'datetime',
    ];

    public function lokasiBlc(): BelongsTo
    {
        return $this->belongsTo(LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function kategoriPeserta(): BelongsTo
    {
        return $this->belongsTo(KategoriPesertaModel::class, 'kategori_peserta_id');
    }

    public function divalidasiOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'divalidasi_oleh');
    }
}
