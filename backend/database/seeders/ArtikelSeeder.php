<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Admin\Data\Artikel\Infrastructure\ArtikelModel;
use App\Modules\Admin\Data\KategoriArtikel\Infrastructure\KategoriArtikelModel;

class ArtikelSeeder extends Seeder
{
    public function run(): void
    {
        $kategori = KategoriArtikelModel::where('is_delete', false)->pluck('id')->toArray();

        $artikel = [
            [
                'kategori_artikel_id' => $kategori[0] ?? 1,
                'judul' => 'Cara Daftar di BLC Surabaya',
                'keterangan' => 'Langkah-langkah mendaftar untuk acara BLC',
                'lokasi' => 'Surabaya',
                'is_delete' => false,
            ],
            [
                'kategori_artikel_id' => $kategori[1] ?? 1,
                'judul' => 'Jadwal Acara Bulanan',
                'keterangan' => 'Jadwal lengkap kegiatan BLC bulan ini',
                'lokasi' => 'Surabaya',
                'is_delete' => false,
            ],
            [
                'kategori_artikel_id' => $kategori[2] ?? 1,
                'judul' => 'Tips Menggunakan Aplikasi BLC',
                'keterangan' => 'Panduan singkat fitur-fitur aplikasi',
                'lokasi' => 'Surabaya',
                'is_delete' => false,
            ],
            [
                'kategori_artikel_id' => $kategori[3] ?? 1,
                'judul' => 'FAQ Umum',
                'keterangan' => 'Pertanyaan yang sering diajukan',
                'lokasi' => 'Surabaya',
                'is_delete' => false,
            ],
            [
                'kategori_artikel_id' => end($kategori) ?? 1,
                'judul' => 'Kontak Kami',
                'keterangan' => 'Informasi kontak tim BLC',
                'lokasi' => 'Surabaya',
                'is_delete' => false,
            ],
        ];

        foreach ($artikel as $item) {
            ArtikelModel::firstOrCreate(
                ['judul' => $item['judul']],
                $item
            );
        }
    }
}