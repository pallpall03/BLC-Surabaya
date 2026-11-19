<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;

class LokasiBlcSeeder extends Seeder
{
    public function run(): void
    {
        $lokasi = [
            [
                'nama_blc' => 'BLC Headquarters',
                'alamat' => 'Jl. Pahlawan No. 1, Surabaya',
                'foto_blc' => 'hq.jpg',
                'foto2_blc' => 'hq2.jpg',
                'radius' => 500,
                'latitude' => -7.2575,
                'longitude' => 112.7521,
                'foto_absen_ins' => 'absen_hq.jpg',
                'ver_foto_absen_ins' => 1,
                'area' => ' dalam',
                'aktif' => true,
                'is_korwil' => true,
                'is_teknisi_ahli' => true,
                'is_teknisi' => true,
            ],
            [
                'nama_blc' => 'BLC Kantor Pusat 2',
                'alamat' => 'Jl. Ahmad Yani No. 5, Surabaya',
                'foto_blc' => 'pusat2.jpg',
                'foto2_blc' => 'pusat2_2.jpg',
                'radius' => 300,
                'latitude' => -7.3150,
                'longitude' => 112.7560,
                'foto_absen_ins' => 'absen_pusat2.jpg',
                'ver_foto_absen_ins' => 0,
                'area' => ' luar',
                'aktif' => true,
                'is_korwil' => false,
                'is_teknisi_ahli' => false,
                'is_teknisi' => true,
            ],
            [
                'nama_blc' => 'BLC Villa Madya',
                'alamat' => 'Jl. Basuki Rachmat No. 10, Surabaya',
                'foto_blc' => 'villa.jpg',
                'foto2_blc' => 'villa2.jpg',
                'radius' => 200,
                'latitude' => -7.2850,
                'longitude' => 112.7450,
                'foto_absen_ins' => 'absen_villa.jpg',
                'ver_foto_absen_ins' => 0,
                'area' => ' dalam',
                'aktif' => false,
                'is_korwil' => false,
                'is_teknisi_ahli' => false,
                'is_teknisi' => false,
            ],
            [
                'nama_blc' => 'BLC Kampus A',
                'alamat' => 'Jl. MT Haryono No. 1, Surabaya',
                'foto_blc' => 'kampusA.jpg',
                'foto2_blc' => 'kampusA2.jpg',
                'radius' => 400,
                'latitude' => -7.2700,
                'longitude' => 112.7500,
                'foto_absen_ins' => 'absen_kampusA.jpg',
                'ver_foto_absen_ins' => 1,
                'area' => ' dalam',
                'aktif' => true,
                'is_korwil' => false,
                'is_teknisi_ahli' => true,
                'is_teknisi' => false,
            ],
            [
                'nama_blc' => 'BLC Mall Taman',
                'alamat' => 'Jl. Jemursari No. 12, Surabaya',
                'foto_blc' => 'mall.jpg',
                'foto2_blc' => 'mall2.jpg',
                'radius' => 150,
                'latitude' => -7.2650,
                'longitude' => 112.7480,
                'foto_absen_ins' => 'absen_mall.jpg',
                'ver_foto_absen_ins' => 0,
                'area' => ' dalam',
                'aktif' => true,
                'is_korwil' => false,
                'is_teknisi_ahli' => false,
                'is_teknisi' => true,
            ],
        ];

        foreach ($lokasi as $item) {
            LokasiBlcModel::firstOrCreate(
                ['nama_blc' => $item['nama_blc']],
                $item
            );
        }
    }
}