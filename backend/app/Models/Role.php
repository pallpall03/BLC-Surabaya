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

    /**
     * Slug di path URL (/api/v1/{slug}/...) => slug role yang berhak membukanya.
     * Dipakai middleware `role.path`. Path 'administrator' dipegang role superadmin.
     */
    public const PATH_ROLE = [
        'administrator' => self::SUPERADMIN,
        'operator' => self::OPERATOR,
        'koordinator' => self::KOORDINATOR,
        'instruktur' => self::INSTRUKTUR,
        'peserta' => self::PESERTA,
    ];

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
