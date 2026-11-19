<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Admin\Data\KategoriArtikel\Infrastructure\KategoriArtikelModel;

class KategoriArtikelSeeder extends Seeder
{
    public function run(): void
    {
        $kategori = [
            [
                'jenis_kategori' => 'Berita',
                'nama_kelompok' => 'Berita Terkini',
                'urutan' => 1,
                'is_delete' => false,
            ],
            [
                'jenis_kategori' => 'Berita',
                'nama_kelompok' => 'Pengumuman',
                'urutan' => 2,
                'is_delete' => false,
            ],
            [
                'jenis_kategori' => 'Artikel',
                'nama_kelompok' => 'Tips & Trik',
                'urutan' => 3,
                'is_delete' => false,
            ],
            [
                'jenis_kategori' => 'Artikel',
                'nama_kelompok' => 'Panduan',
                'urutan' => 4,
                'is_delete' => false,
            ],
            [
                'jenis_kategori' => 'Event',
                'nama_kelompok' => 'Kegiatan BLC',
                'urutan' => 5,
                'is_delete' => false,
            ],
        ];

        foreach ($kategori as $item) {
            KategoriArtikelModel::firstOrCreate(
                ['jenis_kategori' => $item['jenis_kategori'], 'nama_kelompok' => $item['nama_kelompok']],
                $item
            );
        }
    }
}