<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Admin\Data\TimBlc\Infrastructure\TimBlcModel;
use App\Modules\Admin\Data\KategoriArtikel\Infrastructure\KategoriArtikelModel;
use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;

class TimBlcSeeder extends Seeder
{
    public function run(): void
    {
        $kategori = KategoriArtikelModel::where('is_delete', false)->pluck('id')->toArray();
        $lokasi = LokasiBlcModel::where('is_delete', false)->where('aktif', true)->pluck('id')->toArray();

        $tim = [
            [
                'user_id' => 1,
                'nama_lengkap' => 'Dr. Ahmad Fauzi',
                'gender' => 'L',
                'email' => 'ahmad@blc.go.id',
                'alamat' => 'Jl. Veteran No. 1, Surabaya',
                'role' => 'koordinator',
                'avatar' => 'ahmad.jpg',
                'phone' => '08111111111',
                'kategori_id' => $kategori[0] ?? 1,
                'lokasi_blc_id' => $lokasi[0] ?? 1,
                'nik' => '197501011998031001',
                'tanggal_lahir' => '1975-01-01',
                'kecamatan' => 'Tegalsari',
                'kelurahan' => 'Kebonsari',
                'username' => 'ahmad.fauzi',
                'is_delete' => false,
                'is_surabaya' => true,
            ],
            [
                'user_id' => 2,
                'nama_lengkap' => 'Prof. Siti Aminah',
                'gender' => 'P',
                'email' => 'siti@blc.go.id',
                'alamat' => 'Jl. Diponegoro No. 5, Surabaya',
                'role' => 'instruktur',
                'avatar' => 'siti.jpg',
                'phone' => '08111111112',
                'kategori_id' => $kategori[1] ?? 1,
                'lokasi_blc_id' => $lokasi[1] ?? 1,
                'nik' => '198002021999032002',
                'tanggal_lahir' => '1980-02-02',
                'kecamatan' => 'Gubeng',
                'kelurahan' => 'Baratajaya',
                'username' => 'siti.aminah',
                'is_delete' => false,
                'is_surabaya' => true,
            ],
            [
                'user_id' => 3,
                'nama_lengkap' => 'Ir. Budi Prasetyo',
                'gender' => 'L',
                'email' => 'budi@blc.go.id',
                'alamat' => 'Jl. Sudirman No. 10, Surabaya',
                'role' => 'instruktur',
                'avatar' => 'budi.jpg',
                'phone' => '08111111113',
                'kategori_id' => $kategori[2] ?? 1,
                'lokasi_blc_id' => $lokasi[2] ?? 1,
                'nik' => '198503032000031003',
                'tanggal_lahir' => '1985-03-03',
                'kecamatan' => 'Wonokromo',
                'kelurahan' => 'Ngagel',
                'username' => 'budi.prasetyo',
                'is_delete' => false,
                'is_surabaya' => true,
            ],
            [
                'user_id' => 4,
                'nama_lengkap' => 'Drs. Dewi Sartika',
                'gender' => 'P',
                'email' => 'dewi@blc.go.id',
                'alamat' => 'Jl. Thamrin No. 15, Surabaya',
                'role' => 'operator',
                'avatar' => 'dewi.jpg',
                'phone' => '08111111114',
                'kategori_id' => $kategori[3] ?? 1,
                'lokasi_blc_id' => $lokasi[3] ?? 1,
                'nik' => '199004042001032004',
                'tanggal_lahir' => '1990-04-04',
                'kecamatan' => 'Sukolilo',
                'kelurahan' => 'Menur Pumpungan',
                'username' => 'dewi.sartika',
                'is_delete' => false,
                'is_surabaya' => true,
            ],
            [
                'user_id' => 5,
                'nama_lengkap' => 'Rudi Hartono, S.Kom',
                'gender' => 'L',
                'email' => 'rudi@blc.go.id',
                'alamat' => 'Jl. Gatot Subroto No. 20, Surabaya',
                'role' => 'instruktur',
                'avatar' => 'rudi.jpg',
                'phone' => '08111111115',
                'kategori_id' => $kategori[4] ?? 1,
                'lokasi_blc_id' => $lokasi[4] ?? 1,
                'nik' => '199505052002031005',
                'tanggal_lahir' => '1995-05-05',
                'kecamatan' => 'Rungkut',
                'kelurahan' => 'Wonorejo',
                'username' => 'rudi.hartono',
                'is_delete' => false,
                'is_surabaya' => true,
            ],
        ];

        foreach ($tim as $item) {
            TimBlcModel::firstOrCreate(
                ['email' => $item['email']],
                $item
            );
        }
    }
}