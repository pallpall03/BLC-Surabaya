<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UjianSeeder extends Seeder
{
    public function run(): void
    {
        $ujian = [
            [
                'judul' => 'Ujian Dasar Programming',
                'slug' => 'ujian-dasar-programming',
                'deskripsi' => 'Ujian pemahaman konsep dasar pemrograman',
                'durasi_menit' => 90,
                'urutan' => 1,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Ujian Database Design',
                'slug' => 'ujian-database-design',
                'deskripsi' => 'Ujian perancangan dan normalisasi database',
                'durasi_menit' => 120,
                'urutan' => 2,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Ujian Web Development',
                'slug' => 'ujian-web-development',
                'deskripsi' => 'Ujian pembuatan aplikasi web sederhana',
                'durasi_menit' => 180,
                'urutan' => 3,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Ujian Mobile App',
                'slug' => 'ujian-mobile-app',
                'deskripsi' => 'Ujian pengembangan aplikasi mobile',
                'durasi_menit' => 150,
                'urutan' => 4,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Ujian Cloud Computing',
                'slug' => 'ujian-cloud-computing',
                'deskripsi' => 'Ujian konsep dan implementasi cloud',
                'durasi_menit' => 90,
                'urutan' => 5,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($ujian as $item) {
            DB::table('ujian')->updateOrInsert(
                ['slug' => $item['slug']],
                $item
            );
        }
    }
}