<?php

namespace App\Modules\Koordinator\Pengguna\Infrastructure;

use App\Modules\Koordinator\Pengguna\Domain\Pengguna;
use App\Modules\Koordinator\Pengguna\Domain\ValueObjects\PenggunaId;
use Illuminate\Database\Eloquent\Model;

class PenggunaEloquentModel extends Model
{
    protected $table = 'pengguna';
    protected $fillable = [
        'username',
        'email',
        'password_hash',
        'nama_lengkap',
        'tanggal_masuk',
        'last_login_at',
        'peran',
    ];
    protected $casts = [
        'tanggal_masuk' => 'datetime',
        'last_login_at' => 'datetime',
    ];
    public $timestamps = true;

    public function toDomain(): Pengguna
    {
        return new Pengguna(
            new PenggunaId($this->id),
            $this->username,
            $this->email,
            $this->password_hash,
            $this->nama_lengkap,
            $this->tanggal_masuk,
            $this->last_login_at,
            $this->peran
        );
    }
}