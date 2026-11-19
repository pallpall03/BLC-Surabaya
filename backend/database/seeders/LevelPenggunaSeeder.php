<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LevelPengguna;

class LevelPenggunaSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            ['slug' => 'superadmin', 'nama' => 'Superadmin', 'deskripsi' => 'Akses penuh ke seluruh sistem', 'is_aktif' => true],
            ['slug' => 'koordinator', 'nama' => 'Koordinator', 'deskripsi' => 'Mengelola pelatihan dan instruktur', 'is_aktif' => true],
            ['slug' => 'instruktur', 'nama' => 'Instruktur', 'deskripsi' => 'Mengajar dan mengelola kelas', 'is_aktif' => true],
            ['slug' => 'operator', 'nama' => 'Operator', 'deskripsi' => 'Operator administrasi', 'is_aktif' => true],
        ];

        foreach ($levels as $level) {
            LevelPengguna::firstOrCreate(['slug' => $level['slug']], $level);
        }
    }
}