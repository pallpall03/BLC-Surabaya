<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel;

class KoordinatorProfileModel extends Model
{
    protected $table = 'koordinator_profiles';
    protected $primaryKey = 'id';
    protected $fillable = [
        'pengguna_id',
        'kantor_ku_user_id',
        'lokasi_blc_ids',
        'nip',
        'bidang_keahlian',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'lokasi_blc_ids' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(PenggunaModel::class, 'pengguna_id');
    }
}