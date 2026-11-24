<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel;
use Illuminate\Support\Facades\Hash;

class PenggunaSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = Role::where('slug', 'superadmin')->first();
        $adminRole = Role::where('slug', 'admin')->first();

        $users = [
            [
                'role_id' => $superAdminRole?->id,
                'nik' => '3578000000000001', // NIK contoh untuk dev, ganti di produksi
                'username' => 'superadmin',
                'name' => 'Super Administrator',
                'email' => 'superadmin@blc.surabaya.go.id',
                'password' => Hash::make('password123'),
                'plain_password' => 'password123',
                'status' => 'aktif',
                'tipe' => 'superadmin',
                'is_aktif' => true,
            ],
            [
                'role_id' => $adminRole?->id,
                'nik' => '3578000000000002', // NIK contoh untuk dev, ganti di produksi
                'username' => 'admin',
                'name' => 'Administrator',
                'email' => 'admin@blc.surabaya.go.id',
                'password' => Hash::make('password123'),
                'plain_password' => 'password123',
                'status' => 'aktif',
                'tipe' => 'admin',
                'is_aktif' => true,
            ],
        ];

        foreach ($users as $user) {
            PenggunaModel::updateOrInsert(['email' => $user['email']], $user);
        }
    }
}
