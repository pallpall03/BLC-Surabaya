<?php

namespace App\Modules\Admin\Data\Testimoni\Infrastructure;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class TestimoniModel extends Model
{
    use HasFactory;

    public const PENDING = 'pending';
    public const TAMPIL = 'tampil';
    public const DITOLAK = 'ditolak';
    public const STATUS = [self::PENDING, self::TAMPIL, self::DITOLAK];

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
    ];

    public function lokasi(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel::class, 'lokasi_blc_id');
    }

    /** Hanya testimoni yang boleh tayang di website. */
    public function scopeTampil($query)
    {
        return $query->where('status', self::TAMPIL);
    }
}