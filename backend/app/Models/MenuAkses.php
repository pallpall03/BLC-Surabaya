<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class MenuAkses extends Model
{
    protected $table = 'menu_akses';

    protected $fillable = [
        'role_id',
        'menu_id',
        'bisa_lihat',
        'bisa_tambah',
        'bisa_edit',
        'bisa_hapus',
    ];

    protected $casts = [
        'bisa_lihat' => 'boolean',
        'bisa_tambah' => 'boolean',
        'bisa_edit' => 'boolean',
        'bisa_hapus' => 'boolean',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
}