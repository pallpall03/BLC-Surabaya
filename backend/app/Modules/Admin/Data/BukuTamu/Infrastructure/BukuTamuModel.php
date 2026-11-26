<?php

namespace App\Modules\Admin\Data\BukuTamu\Infrastructure;

use App\Modules\Admin\Data\BukuTamu\Domain\BukuTamu;
use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\SesiModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class BukuTamuModel extends Model
{
    protected $table = 'buku_tamu';

    public $timestamps = true;

    protected $fillable = [
        'nama',
        'instansi',
        'email',
        'telepon',
        'tanggal_kunjungan',
        'pesan',
        'rating',
        'is_aktif',
        'is_delete',
        'urutan',
        'lokasi_blc_id',
        'sesi_id',
        'jenis_kelamin',
        'tanggal_lahir',
        'alamat',
        'kategori',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_aktif' => 'boolean',
        'is_delete' => 'boolean',
        'tanggal_lahir' => 'date:Y-m-d',
        'tanggal_kunjungan' => 'date:Y-m-d',
    ];

    public function toDomain(): BukuTamu
    {
        return new BukuTamu(
            id: $this->id,
            nama: $this->nama,
            email: $this->email,
            pesan: $this->pesan,
            rating: $this->rating,
            isAktif: $this->is_aktif,
            urutan: $this->urutan,
            createdAt: $this->created_at?->toIso8601String() ?? '',
            updatedAt: $this->updated_at?->toIso8601String() ?? '',
            instansi: $this->instansi,
            telepon: $this->telepon,
            tanggalKunjungan: $this->tanggal_kunjungan?->toDateString(),
            lokasiBlcId: $this->lokasi_blc_id,
            sesiId: $this->sesi_id,
            jenisKelamin: $this->jenis_kelamin,
            tanggalLahir: $this->tanggal_lahir?->toDateString(),
            alamat: $this->alamat,
            kategori: $this->kategori,
            isDelete: $this->is_delete,
            blc: $this->relationLoaded('blc') ? $this->blc?->nama_blc : null,
            sesi: $this->relationLoaded('sesi') ? $this->sesi?->sesi : null,
        );
    }

    /** Serializer publik: jangan pernah menambahkan email atau telepon di sini. */
    public function toPublicArray(): array
    {
        return [
            'id' => (int) $this->id,
            'nama' => $this->nama,
            'instansi' => $this->instansi,
            'pesan' => $this->pesan,
            'rating' => $this->rating,
            'tanggal' => $this->tanggal_kunjungan?->toDateString() ?? $this->created_at?->toDateString(),
            'blc' => $this->blc?->nama_blc,
            'sesi' => $this->sesi?->sesi,
        ];
    }

    public function blc(): BelongsTo
    {
        return $this->belongsTo(LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function sesi(): BelongsTo
    {
        return $this->belongsTo(SesiModel::class, 'sesi_id');
    }

    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('is_delete', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan', 'asc');
    }
}