<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Admin\Data\Testimoni\Infrastructure\TestimoniModel;
use App\Modules\Admin\Data\KategoriArtikel\Infrastructure\KategoriArtikelModel;
use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;

class TestimoniSeeder extends Seeder
{
    public function run(): void
    {
        $kategori = KategoriArtikelModel::where('is_delete', false)->pluck('id')->toArray();
        $lokasi = LokasiBlcModel::where('is_delete', false)->where('aktif', true)->pluck('id')->toArray();

        $testimoni = [
            [
                'nama' => 'Andi Pratama',
                'alamat' => 'Jl. Mawar No. 1, Surabaya',
                'phone' => '081234567890',
                'gender' => 'L',
                'email' => 'andi@email.com',
                'kategori_id' => $kategori[0] ?? 1,
                'keperluan' => 'Mengikuti pelatihan',
                'lokasi_blc_id' => $lokasi[0] ?? 1,
                'materi_id' => 1,
                'is_surabaya' => true,
                'tanggal_lahir' => '1995-05-15',
                'kecamatan' => 'Tegalsari',
                'kelurahan' => 'Kebonsari',
            ],
            [
                'nama' => 'Siti Rahmawati',
                'alamat' => 'Jl. Melati No. 5, Surabaya',
                'phone' => '081234567891',
                'gender' => 'P',
                'email' => 'siti@email.com',
                'kategori_id' => $kategori[1] ?? 1,
                'keperluan' => 'Sertifikasi',
                'lokasi_blc_id' => $lokasi[1] ?? 1,
                'materi_id' => 2,
                'is_surabaya' => true,
                'tanggal_lahir' => '1998-08-22',
                'kecamatan' => 'Wonokromo',
                'kelurahan' => 'Ngagel',
            ],
            [
                'nama' => 'Budi Santoso',
                'alamat' => 'Jl. Anggrek No. 10, Surabaya',
                'phone' => '081234567892',
                'gender' => 'L',
                'email' => 'budi@email.com',
                'kategori_id' => $kategori[2] ?? 1,
                'keperluan' => 'Pelatihan kerja',
                'lokasi_blc_id' => $lokasi[2] ?? 1,
                'materi_id' => 3,
                'is_surabaya' => true,
                'tanggal_lahir' => '1992-11-30',
                'kecamatan' => 'Gubeng',
                'kelurahan' => 'Baratajaya',
            ],
            [
                'nama' => 'Dewi Lestari',
                'alamat' => 'Jl. Kenanga No. 15, Surabaya',
                'phone' => '081234567893',
                'gender' => 'P',
                'email' => 'dewi@email.com',
                'kategori_id' => $kategori[3] ?? 1,
                'keperluan' => 'Keterampilan',
                'lokasi_blc_id' => $lokasi[3] ?? 1,
                'materi_id' => 1,
                'is_surabaya' => true,
                'tanggal_lahir' => '2000-02-18',
                'kecamatan' => 'Sukolilo',
                'kelurahan' => 'Menur Pumpungan',
            ],
            [
                'nama' => 'Rudi Hermawan',
                'alamat' => 'Jl. Cempaka No. 20, Surabaya',
                'phone' => '081234567894',
                'gender' => 'L',
                'email' => 'rudi@email.com',
                'kategori_id' => $kategori[4] ?? 1,
                'keperluan' => 'Upskilling',
                'lokasi_blc_id' => $lokasi[4] ?? 1,
                'materi_id' => 2,
                'is_surabaya' => true,
                'tanggal_lahir' => '1988-07-25',
                'kecamatan' => 'Rungkut',
                'kelurahan' => 'Wonorejo',
            ],
        ];

        foreach ($testimoni as $item) {
            TestimoniModel::firstOrCreate(
                ['email' => $item['email']],
                $item
            );
        }
    }
}