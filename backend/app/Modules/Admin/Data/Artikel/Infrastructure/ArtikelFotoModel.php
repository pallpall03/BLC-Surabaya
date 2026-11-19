<?php

namespace App\Modules\Admin\Data\Artikel\Infrastructure;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ArtikelFotoModel extends Model
{
    use HasFactory;

    protected $table = 'artikel_foto';

    protected $fillable = [
        'artikel_id',
        'foto',
    ];

    public function artikel(): BelongsTo
    {
        return $this->belongsTo(ArtikelModel::class, 'artikel_id');
    }
}