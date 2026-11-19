<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PiagamSeeder extends Seeder
{
    public function run(): void
    {
        $piagam = [
            [
                'judul' => 'Sertifikat Kelulusan Dasar Programming',
                'slug' => 'sertifikat-dasar-programming',
                'deskripsi' => 'Piagam untuk lulusan modul dasar programming',
                'template_file' => 'template_programming.docx',
                'urutan' => 1,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Sertifikat Kelulusan Database Design',
                'slug' => 'sertifikat-database-design',
                'deskripsi' => 'Piagam untuk lulusan modul database design',
                'template_file' => 'template_database.docx',
                'urutan' => 2,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Sertifikat Kelulusan Web Development',
                'slug' => 'sertifikat-web-development',
                'deskripsi' => 'Piagam untuk lulusan modul web development',
                'template_file' => 'template_web.docx',
                'urutan' => 3,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Sertifikat Kelulusan Mobile App',
                'slug' => 'sertifikat-mobile-app',
                'deskripsi' => 'Piagam untuk lulusan modul mobile app',
                'template_file' => 'template_mobile.docx',
                'urutan' => 4,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Sertifikat Kelulusan Cloud Computing',
                'slug' => 'sertifikat-cloud-computing',
                'deskripsi' => 'Piagam untuk lulusan modul cloud computing',
                'template_file' => 'template_cloud.docx',
                'urutan' => 5,
                'is_aktif' => true,
                'is_delete' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($piagam as $item) {
            DB::table('piagam')->updateOrInsert(
                ['slug' => $item['slug']],
                $item
            );
        }
    }
}