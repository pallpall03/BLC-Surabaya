<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * Menyiapkan akun uji login memakai akun @blc.test yang sudah ada di database (dibuat kalau belum ada).
 * NIK akun yang sudah punya NIK (mis. hasil salinan dari tim_blc) TIDAK diubah.
 * JANGAN dijalankan di produksi: password akun-akun ini di-set menjadi Password123.
 */
class LoginDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction()) {
            return;
        }

        $akun = [
            ['username' => 'demo.superadmin', 'email' => 'admin@blc.test', 'name' => 'Super Admin', 'role' => Role::SUPERADMIN, 'nik' => '3578000000000001'],
            ['username' => 'demo.koordinator', 'email' => 'koordinator@blc.test', 'name' => 'Koordinator BLC', 'role' => Role::KOORDINATOR, 'nik' => '3578000000000002'],
            ['username' => 'demo.instruktur', 'email' => 'instruktur@blc.test', 'name' => 'Instruktur BLC', 'role' => Role::INSTRUKTUR, 'nik' => '3578000000000003'],
            ['username' => 'demo.operator', 'email' => 'operator@blc.test', 'name' => 'Operator BLC', 'role' => Role::OPERATOR, 'nik' => '3578000000000004'],
            ['username' => 'demo.peserta', 'email' => 'peserta@blc.test', 'name' => 'Peserta Uji', 'role' => Role::PESERTA, 'nik' => '3578000000000005'],
        ];

        foreach ($akun as $a) {
            $role = Role::firstOrCreate(['slug' => $a['role']], ['name' => Role::daftar()[$a['role']]]);

            $user = User::query()->firstOrNew(['email' => $a['email']], ['name' => $a['name'], 'username' => $a['username']]);
            $user->username = $a['username'];
            $user->role_id = $role->id;
            $user->password = 'Password123';

            if ($user->nik === null || $user->nik === '') {
                $user->nik = $this->nikTersedia($a['nik'], $user);
            }

            $user->forceFill(['status' => 'aktif', 'is_aktif' => true, 'failed_login_attempts' => 0, 'locked_at' => null]);
            $user->save();
        }
    }

    /** NIK contoh tidak boleh bentrok dengan akun lain (mis. hasil PenggunaSeeder atau tim_blc). */
    private function nikTersedia(string $nik, User $user): string
    {
        if (! $this->nikDipakai($nik, $user)) {
            return $nik;
        }

        $prefix = substr($nik, 0, 14);

        for ($urut = 11; $urut <= 99; $urut++) {
            $kandidat = $prefix.str_pad((string) $urut, 2, '0', STR_PAD_LEFT);

            if (! $this->nikDipakai($kandidat, $user)) {
                return $kandidat;
            }
        }

        throw new RuntimeException('Tidak ada NIK demo yang kosong untuk '.$user->email.'.');
    }

    private function nikDipakai(string $nik, User $user): bool
    {
        return User::query()
            ->where('nik', $nik)
            ->when($user->exists, fn ($query) => $query->whereKeyNot($user->getKey()))
            ->exists();
    }
}
