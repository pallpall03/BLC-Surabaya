<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Menu extends Model
{
    protected $table = 'menu';

    protected $fillable = [
        'parent_id',
        'nama',
        'slug',
        'url',
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
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('urutan');
    }

    public function menuAkses(): HasMany
    {
        return $this->hasMany(MenuAkses::class);
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