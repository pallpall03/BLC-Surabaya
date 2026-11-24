<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Menyiapkan akun uji login memakai akun @blc.test yang sudah ada di database (dibuat kalau belum ada).
 * NIK akun yang sudah punya NIK (mis. hasil salinan dari tim_blc) TIDAK diubah.
 * JANGAN dijalankan di produksi: password akun-akun ini di-set menjadi Password123.
 */
class LoginDemoSeeder extends Seeder
{
    public function run(): void
    {
        $akun = [
            ['email' => 'admin@blc.test', 'name' => 'Super Admin', 'role' => Role::SUPERADMIN, 'nik' => '3578000000000001'],
            ['email' => 'koordinator@blc.test', 'name' => 'Koordinator BLC', 'role' => Role::KOORDINATOR, 'nik' => '3578000000000002'],
            ['email' => 'instruktur@blc.test', 'name' => 'Instruktur BLC', 'role' => Role::INSTRUKTUR, 'nik' => '3578000000000003'],
            ['email' => 'operator@blc.test', 'name' => 'Operator BLC', 'role' => Role::OPERATOR, 'nik' => '3578000000000004'],
            ['email' => 'peserta@blc.test', 'name' => 'Peserta Uji', 'role' => Role::PESERTA, 'nik' => '3578000000000005'],
        ];

        foreach ($akun as $a) {
            $role = Role::firstOrCreate(['slug' => $a['role']], ['name' => Role::daftar()[$a['role']]]);

            $user = User::query()->where('email', $a['email'])->first() ?? new User(['email' => $a['email'], 'name' => $a['name']]);
            $user->role_id = $role->id;
            $user->password = 'Password123';
            $user->nik = $user->nik ?: $a['nik'];
            $user->forceFill(['status' => 'aktif', 'is_aktif' => true, 'failed_login_attempts' => 0, 'locked_at' => null]);
            $user->save();
        }
    }
}
