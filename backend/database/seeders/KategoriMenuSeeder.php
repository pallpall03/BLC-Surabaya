<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KategoriMenu;

class KategoriMenuSeeder extends Seeder
{
    public function run(): void
    {
        $kategori = [
            ['slug' => 'data', 'nama' => 'Data', 'ikon' => 'database', 'urutan' => 1, 'is_aktif' => true],
            ['slug' => 'konten', 'nama' => 'Konten', 'ikon' => 'file-text', 'urutan' => 2, 'is_aktif' => true],
            ['slug' => 'sistem', 'nama' => 'Sistem', 'ikon' => 'settings', 'urutan' => 3, 'is_aktif' => true],
            ['slug' => 'peserta', 'nama' => 'Peserta', 'ikon' => 'users', 'urutan' => 4, 'is_aktif' => true],
        ];

        foreach ($kategori as $k) {
            KategoriMenu::firstOrCreate(['slug' => $k['slug']], $k);
        }
    }
}