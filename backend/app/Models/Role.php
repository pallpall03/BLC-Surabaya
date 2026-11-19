<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Role pengguna. Satu-satunya sumber role untuk autentikasi
 * (tabel `roles` + kolom `users.role_id` dari migrasi yang sudah ada).
 *
 * Ada 5 role: superadmin, koordinator, instruktur, operator, peserta.
 */
final class Role extends Model
{
    public const SUPERADMIN = 'superadmin';
    public const KOORDINATOR = 'koordinator';
    public const INSTRUKTUR = 'instruktur';
    public const OPERATOR = 'operator';
    public const PESERTA = 'peserta';

    protected $fillable = ['slug', 'name'];

    /**
     * @return array<string, string> slug => nama tampilan
     */
    public static function daftar(): array
    {
        return [
            self::SUPERADMIN => 'Super Admin',
            self::KOORDINATOR => 'Koordinator',
            self::INSTRUKTUR => 'Instruktur',
            self::OPERATOR => 'Operator',
            self::PESERTA => 'Peserta',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function menuAkses(): HasMany
    {
        return $this->hasMany(MenuAkses::class);
    }
}
