<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Role pengguna. Satu-satunya sumber role untuk autentikasi
 * (tabel `roles` + kolom `users.role_id` dari migrasi yang sudah ada).
 *
 * Ada 4 role: admin, koordinator, instruktur, dan pengguna.
 * "Peserta" (ikut pelatihan) dan "pengunjung" (tidak ikut pelatihan) adalah
 * status dari role pengguna, bukan role tersendiri. Statusnya ditentukan dari
 * data pendaftaran pelatihan nanti, setelah skema database ada.
 */
final class Role extends Model
{
    public const ADMIN = 'admin';
    public const KOORDINATOR = 'koordinator';
    public const INSTRUKTUR = 'instruktur';
    public const PENGGUNA = 'pengguna';

    protected $fillable = ['slug', 'name'];

    /**
     * @return array<string, string> slug => nama tampilan
     */
    public static function daftar(): array
    {
        return [
            self::ADMIN => 'Admin',
            self::KOORDINATOR => 'Koordinator',
            self::INSTRUKTUR => 'Instruktur',
            self::PENGGUNA => 'Pengguna',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
