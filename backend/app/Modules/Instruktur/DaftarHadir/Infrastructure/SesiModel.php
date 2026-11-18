<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SesiModel extends Model
{
    protected $table = 'sesi';
    protected $guarded = ['id'];
    protected $casts = [
        'nomor' => 'integer',
    ];

    public function materi(): BelongsTo
    {
        return $this->belongsTo(MateriModel::class, 'materi_id');
    }
}