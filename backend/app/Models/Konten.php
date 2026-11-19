<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Konten extends Model
{
    protected $table = 'konten';

    protected $fillable = [
        'parent_id',
        'judul',
        'slug',
        'konten',
        'ikon',
        'urutan',
        'is_aktif',
        'is_delete',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'is_delete' => 'boolean',
        'urutan' => 'integer',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Konten::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Konten::class, 'parent_id')->orderBy('urutan');
    }

    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true)->where('is_delete', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan');
    }

    public function scopeParents($query)
    {
        return $query->whereNull('parent_id');
    }

    public function isParent(): bool
    {
        return $this->parent_id === null;
    }
}