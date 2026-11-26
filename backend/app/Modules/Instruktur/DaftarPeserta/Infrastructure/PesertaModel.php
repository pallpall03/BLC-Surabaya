<?php

namespace App\Modules\Instruktur\DaftarPeserta\Infrastructure;

use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesertaModel extends Model
{
    protected $table = 'peserta';

    /** Hanya kolom isian form. Status validasi dan soft flag diubah lewat repository. */
    protected $fillable = [
        'nik',
        'nama_lengkap',
        'gender',
        'email',
        'alamat',
        'phone',
        'kategori_id',
        'lokasi_blc_id',
        'tanggal_lahir',
        'kecamatan',
        'kelurahan',
        'kecamatan_lain',
        'kelurahan_lain',
        'is_surabaya',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'is_surabaya' => 'boolean',
        'is_delete' => 'boolean',
        'is_validated' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('is_delete', function (Builder $query): void {
            $query->where('peserta.is_delete', false);
        });
    }

    public function lokasiBlc(): BelongsTo
    {
        return $this->belongsTo(LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function kategoriPeserta(): BelongsTo
    {
        return $this->belongsTo(KategoriPesertaModel::class, 'kategori_id');
    }
}
