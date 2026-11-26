<?php

namespace App\Modules\Admin\Data\TimBlc\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class TimBlcModel extends Model
{
    use HasFactory;

    protected $table = 'tim_blc';

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'gender',
        'email',
        'role',
        'avatar',
        'phone',
        'lokasi_blc_id',
        'username',
        'is_delete',
    ];

    protected $casts = [
        'is_delete' => 'boolean',
        'lokasi_blc_id' => 'integer',
    ];

    public function lokasi(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel::class, 'lokasi_blc_id');
    }

    public function scopeAktif($query)
    {
        return $query->where('is_delete', false);
    }

    public function scopeInstruktur($query)
    {
        return $query->where('role', 'instruktur');
    }

    public function scopeKoordinator($query)
    {
        return $query->where('role', 'koordinator');
    }
}