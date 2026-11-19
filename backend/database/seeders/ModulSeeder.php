<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModulSeeder extends Seeder
{
    public function run(): void
    {
        $modul = [
            [
                'nama' => 'Modul Dasar Programming',
                'slug' => 'modul-dasar-programming',
                'deskripsi' => 'Materi dasar pemrograman untuk pemula',
                'urutan' => 1,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Modul Database Design',
                'slug' => 'modul-database-design',
                'deskripsi' => 'Perancangan database relasional',
                'urutan' => 2,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Modul Web Development',
                'slug' => 'modul-web-development',
                'deskripsi' => 'Pengembangan web fullstack',
                'urutan' => 3,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Modul Mobile App',
                'slug' => 'modul-mobile-app',
                'deskripsi' => 'Pengembangan aplikasi mobile',
                'urutan' => 4,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Modul Cloud Computing',
                'slug' => 'modul-cloud-computing',
                'deskripsi' => 'Dasar-dasar cloud computing',
                'urutan' => 5,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($modul as $item) {
            DB::table('modul')->updateOrInsert(
                ['slug' => $item['slug']],
                $item
            );
        }
    }
}