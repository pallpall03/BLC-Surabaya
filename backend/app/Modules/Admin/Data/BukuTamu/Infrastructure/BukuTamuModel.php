<?php

namespace App\Modules\Admin\Data\BukuTamu\Infrastructure;

use App\Modules\Admin\Data\BukuTamu\Domain\BukuTamu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class BukuTamuModel extends Model
{
    protected $table = 'buku_tamu';

    public $timestamps = true;

    protected $fillable = [
        'nama',
        'email',
        'pesan',
        'rating',
        'is_aktif',
        'urutan',
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
        );
    }

    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan', 'asc');
    }
}