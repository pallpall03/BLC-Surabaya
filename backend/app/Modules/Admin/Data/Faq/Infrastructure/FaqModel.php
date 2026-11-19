<?php

namespace App\Modules\Admin\Data\Faq\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class FaqModel extends Model
{
    use HasFactory;

    protected $table = 'faq';

    protected $fillable = [
        'pertanyaan',
        'jawaban',
        'kategori_id',
        'urutan',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'urutan' => 'integer',
    ];

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\Data\KategoriArtikel\Infrastructure\KategoriArtikelModel::class, 'kategori_id');
    }

    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan')->orderBy('pertanyaan');
    }
}