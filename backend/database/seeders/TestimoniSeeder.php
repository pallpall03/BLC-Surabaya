<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Admin\Data\Testimoni\Infrastructure\TestimoniModel;
use Illuminate\Support\Facades\DB;
use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;

class TestimoniSeeder extends Seeder
{
    public function run(): void
    {
        $kategori = DB::table('kategori')->pluck('id')->toArray();
        $lokasi = LokasiBlcModel::where('is_delete', false)->where('aktif', true)->pluck('id')->toArray();

        $testimoni = [
            [
                'nama' => 'Andi Pratama',
                'email' => 'andi@email.com',
                'kategori_id' => $kategori[0] ?? null,
                'lokasi_blc_id' => $lokasi[0] ?? 1,
            ],
            [
                'nama' => 'Siti Rahmawati',
                'email' => 'siti@email.com',
                'kategori_id' => $kategori[1] ?? null,
                'lokasi_blc_id' => $lokasi[1] ?? 1,
            ],
            [
                'nama' => 'Budi Santoso',
                'email' => 'budi@email.com',
                'kategori_id' => $kategori[2] ?? null,
                'lokasi_blc_id' => $lokasi[2] ?? 1,
            ],
            [
                'nama' => 'Dewi Lestari',
                'email' => 'dewi@email.com',
                'kategori_id' => $kategori[3] ?? null,
                'lokasi_blc_id' => $lokasi[3] ?? 1,
            ],
            [
                'nama' => 'Rudi Hermawan',
                'email' => 'rudi@email.com',
                'kategori_id' => $kategori[4] ?? null,
                'lokasi_blc_id' => $lokasi[4] ?? 1,
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