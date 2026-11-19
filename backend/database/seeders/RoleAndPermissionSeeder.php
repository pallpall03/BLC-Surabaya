<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Tambah role yang hilang: operator & user
        $roles = [
            [
                'slug' => 'operator',
                'nama' => 'Operator',
                'deskripsi' => 'Operator sistem - kelola data master & monitoring',
                'urutan' => 3,
            ],
            [
                'slug' => 'user',
                'nama' => 'User',
                'deskripsi' => 'Peserta pelatihan & pengunjung BLC',
                'urutan' => 6,
            ],
        ];

        foreach ($roles as $role) {
            DB::table('level_pengguna')->updateOrInsert(
                ['slug' => $role['slug']],
                array_merge($role, ['is_aktif' => true, 'created_at' => now(), 'updated_at' => now()])
            );
        }

        // Ambil ID role
        $roleIds = DB::table('level_pengguna')->pluck('id', 'slug');

        // Hak akses untuk OPERATOR (level 3 - antara admin & koordinator)
        if (isset($roleIds['operator'])) {
            $operatorPermissions = [
                ['modul' => 'artikel', 'aksi' => 'create'],
                ['modul' => 'artikel', 'aksi' => 'read'],
                ['modul' => 'artikel', 'aksi' => 'update'],
                ['modul' => 'kategori_artikel', 'aksi' => 'read'],
                ['modul' => 'buku_tamu', 'aksi' => 'read'],
                ['modul' => 'lokasi', 'aksi' => 'read'],
                ['modul' => 'testimoni', 'aksi' => 'read'],
                ['modul' => 'tim_blc', 'aksi' => 'read'],
                ['modul' => 'foto_slider', 'aksi' => 'read'],
                ['modul' => 'faq', 'aksi' => 'read'],
                ['modul' => 'pengguna', 'aksi' => 'read'],
                ['modul' => 'monitoring', 'aksi' => 'read'],
                ['modul' => 'laporan', 'aksi' => 'read'],
                ['modul' => 'rekap', 'aksi' => 'read'],
                ['modul' => 'master_data', 'aksi' => 'read'],
                ['modul' => 'master_data', 'aksi' => 'create'],
                ['modul' => 'master_data', 'aksi' => 'update'],
            ];

            foreach ($operatorPermissions as $perm) {
                DB::table('hak_akses')->updateOrInsert(
                    [
                        'level_pengguna_id' => $roleIds['operator'],
                        'modul' => $perm['modul'],
                        'aksi' => $perm['aksi'],
                    ],
                    ['diizinkan' => true, 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }

        // Hak akses untuk USER (peserta pelatihan & pengunjung) - MINIMAL
        if (isset($roleIds['user'])) {
            $userPermissions = [
                ['modul' => 'profil', 'aksi' => 'read'],
                ['modul' => 'profil', 'aksi' => 'update'],
                ['modul' => 'modul', 'aksi' => 'read'],
                ['modul' => 'ujian', 'aksi' => 'read'],
                ['modul' => 'ujian', 'aksi' => 'create'],
                ['modul' => 'piagam', 'aksi' => 'read'],
                ['modul' => 'absensi', 'aksi' => 'read'],
                ['modul' => 'jadwal', 'aksi' => 'read'],
                ['modul' => 'pengunjung', 'aksi' => 'create'],
                ['modul' => 'pengunjung', 'aksi' => 'read'],
            ];

            foreach ($userPermissions as $perm) {
                DB::table('hak_akses')->updateOrInsert(
                    [
                        'level_pengguna_id' => $roleIds['user'],
                        'modul' => $perm['modul'],
                        'aksi' => $perm['aksi'],
                    ],
                    ['diizinkan' => true, 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }

        $this->command->info('Role "operator" & "user" + permissions seeded successfully.');
    }
}