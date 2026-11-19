<?php

namespace App\Modules\Admin\System\Menu\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class MenuModel extends Model
{
    use HasFactory;

    protected $table = 'menu';

    protected $fillable = [
        'kategori_menu_id',
        'slug',
        'nama',
        'route',
        'ikon',
        'urutan',
        'parent_id',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'urutan' => 'integer',
    ];

    public function kategoriMenu(): BelongsTo
    {
        return $this->belongsTo(KategoriMenuModel::class, 'kategori_menu_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuModel::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(MenuModel::class, 'parent_id');
    }

    public function hakAkses(): HasMany
    {
        return $this->hasMany(HakAksesModel::class, 'menu_id');
    }

    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan')->orderBy('nama');
    }
}