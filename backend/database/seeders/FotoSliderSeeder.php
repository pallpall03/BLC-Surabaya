<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Admin\Data\FotoSlider\Infrastructure\FotoSliderModel;

class FotoSliderSeeder extends Seeder
{
    public function run(): void
    {
        $slider = [
            [
                'file_brosur' => 'slider1.jpg',
                'ket_brosur' => 'Selamat Datang di BLC Surabaya',
                'tgl' => now(),
                'tipe' => 'banner',
                'status' => '1',
                'urutan' => 1,
            ],
            [
                'file_brosur' => 'slider2.jpg',
                'ket_brosur' => 'Daftar Sekarang',
                'tgl' => now(),
                'tipe' => 'banner',
                'status' => '1',
                'urutan' => 2,
            ],
            [
                'file_brosur' => 'slider3.jpg',
                'ket_brosur' => 'Kegiatan Terbaru',
                'tgl' => now(),
                'tipe' => 'banner',
                'status' => '1',
                'urutan' => 3,
            ],
            [
                'file_brosur' => 'brochure1.pdf',
                'ket_brosur' => 'Brosur Informasi',
                'tgl' => now(),
                'tipe' => 'brosur',
                'status' => '1',
                'urutan' => 1,
            ],
            [
                'file_brosur' => 'brochure2.pdf',
                'ket_brosur' => 'Panduan Peserta',
                'tgl' => now(),
                'tipe' => 'brosur',
                'status' => '1',
                'urutan' => 2,
            ],
        ];

        foreach ($slider as $item) {
            FotoSliderModel::firstOrCreate(
                ['file_brosur' => $item['file_brosur']],
                $item
            );
        }
    }
}