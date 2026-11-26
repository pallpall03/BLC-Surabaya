<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Skema akhir lokasi_blc:
 * nama_blc, alamat, foto_blc, foto2_blc, is_delete, latitude, longitude, area, aktif,
 * jumlah_slot_computer, jadwal_blc, wilayah_surabaya, timestamps.
 * Kolom radius, foto_absen_ins, ver_foto_absen_ins, is_korwil, is_teknisi_ahli, is_teknisi sudah di-drop.
 */
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
                'latitude' => '-7.2575',
                'longitude' => '112.7521',
                'area' => 'dalam',
                'aktif' => true,
                'jumlah_slot_computer' => 30,
                'jadwal_blc' => 'Senin - Jumat, 08.00 - 16.00',
                'wilayah_surabaya' => 'Pusat',
            ],
            [
                'nama_blc' => 'BLC Kantor Pusat 2',
                'alamat' => 'Jl. Ahmad Yani No. 5, Surabaya',
                'foto_blc' => 'pusat2.jpg',
                'foto2_blc' => 'pusat2_2.jpg',
                'latitude' => '-7.3150',
                'longitude' => '112.7560',
                'area' => 'luar',
                'aktif' => true,
                'jumlah_slot_computer' => 20,
                'jadwal_blc' => 'Senin - Jumat, 08.00 - 15.00',
                'wilayah_surabaya' => 'Selatan',
            ],
            [
                'nama_blc' => 'BLC Villa Madya',
                'alamat' => 'Jl. Basuki Rachmat No. 10, Surabaya',
                'foto_blc' => 'villa.jpg',
                'foto2_blc' => 'villa2.jpg',
                'latitude' => '-7.2850',
                'longitude' => '112.7450',
                'area' => 'dalam',
                'aktif' => false,
                'jumlah_slot_computer' => 15,
                'jadwal_blc' => 'Selasa - Kamis, 09.00 - 15.00',
                'wilayah_surabaya' => 'Pusat',
            ],
            [
                'nama_blc' => 'BLC Kampus A',
                'alamat' => 'Jl. MT Haryono No. 1, Surabaya',
                'foto_blc' => 'kampusA.jpg',
                'foto2_blc' => 'kampusA2.jpg',
                'latitude' => '-7.2700',
                'longitude' => '112.7500',
                'area' => 'dalam',
                'aktif' => true,
                'jumlah_slot_computer' => 25,
                'jadwal_blc' => 'Senin - Sabtu, 08.00 - 16.00',
                'wilayah_surabaya' => 'Timur',
            ],
            [
                'nama_blc' => 'BLC Mall Taman',
                'alamat' => 'Jl. Jemursari No. 12, Surabaya',
                'foto_blc' => 'mall.jpg',
                'foto2_blc' => 'mall2.jpg',
                'latitude' => '-7.2650',
                'longitude' => '112.7480',
                'area' => 'dalam',
                'aktif' => true,
                'jumlah_slot_computer' => 12,
                'jadwal_blc' => 'Setiap hari, 10.00 - 20.00',
                'wilayah_surabaya' => 'Selatan',
            ],
        ];

        foreach ($lokasi as $item) {
            // DB::table dipakai supaya tidak tergantung $fillable model
            DB::table('lokasi_blc')->updateOrInsert(
                ['nama_blc' => $item['nama_blc']],
                $item + ['is_delete' => false, 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}