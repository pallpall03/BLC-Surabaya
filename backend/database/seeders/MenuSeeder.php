<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Parent menus (categories)
        $data = Menu::firstOrCreate(['slug' => 'data'], [
            'parent_id' => null,
            'nama' => 'Data',
            'slug' => 'data',
            'url' => null,
            'ikon' => 'database',
            'urutan' => 1,
            'is_aktif' => true,
        ]);

        $konten = Menu::firstOrCreate(['slug' => 'konten'], [
            'parent_id' => null,
            'nama' => 'Konten',
            'slug' => 'konten',
            'url' => null,
            'ikon' => 'file-text',
            'urutan' => 2,
            'is_aktif' => true,
        ]);

        // Data children
        $dataChildren = [
            ['slug' => 'user-management', 'nama' => 'Manajemen User', 'url' => '/admin/user-management', 'ikon' => 'users', 'urutan' => 1],
            ['slug' => 'menu-management', 'nama' => 'Manajemen Menu', 'url' => '/admin/menu-management', 'ikon' => 'menu', 'urutan' => 2],
            ['slug' => 'change-password', 'nama' => 'Ubah Password', 'url' => '/admin/change-password', 'ikon' => 'lock', 'urutan' => 3],
        ];

        foreach ($dataChildren as $item) {
            Menu::firstOrCreate(['slug' => $item['slug']], [
                'parent_id' => $data->id,
                'nama' => $item['nama'],
                'slug' => $item['slug'],
                'url' => $item['url'],
                'ikon' => $item['ikon'],
                'urutan' => $item['urutan'],
                'is_aktif' => true,
            ]);
        }

        // Konten children (sesuai gambar)
        $kontenChildren = [
            ['slug' => 'artikel', 'nama' => 'Artikel', 'url' => '/admin/artikel', 'ikon' => 'file-text', 'urutan' => 1],
            ['slug' => 'faq', 'nama' => 'FAQ', 'url' => '/admin/faq', 'ikon' => 'help-circle', 'urutan' => 2],
            ['slug' => 'foto-slider', 'nama' => 'Foto Slider', 'url' => '/admin/foto-slider', 'ikon' => 'image', 'urutan' => 3],
            ['slug' => 'kategori-artikel', 'nama' => 'Kategori Artikel', 'url' => '/admin/kategori-artikel', 'ikon' => 'folder', 'urutan' => 4],
            ['slug' => 'lokasi-blc', 'nama' => 'Lokasi BLC', 'url' => '/admin/lokasi-blc', 'ikon' => 'map-pin', 'urutan' => 5],
            ['slug' => 'testimoni', 'nama' => 'Testimoni', 'url' => '/admin/testimoni', 'ikon' => 'message-square', 'urutan' => 6],
            ['slug' => 'tim-blc', 'nama' => 'Tim BLC', 'url' => '/admin/tim-blc', 'ikon' => 'users', 'urutan' => 7],
        ];

        foreach ($kontenChildren as $item) {
            Menu::firstOrCreate(['slug' => $item['slug']], [
                'parent_id' => $konten->id,
                'nama' => $item['nama'],
                'slug' => $item['slug'],
                'url' => $item['url'],
                'ikon' => $item['ikon'],
                'urutan' => $item['urutan'],
                'is_aktif' => true,
            ]);
        }
    }
}