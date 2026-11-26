<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Admin\Data\TimBlc\Infrastructure\TimBlcModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterPelatihanSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['SD', 'SMP', 'SMA', 'MAHASISWA', 'UMUM'] as $urutan => $nama) {
            $this->ensure('kategori_artikel', [
                'jenis_kategori' => 'Peserta',
                'nama_kelompok' => $nama,
                'is_delete' => false,
            ], [
                'urutan' => $urutan + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ([
            1 => '07.30-09.00',
            2 => '09.00-10.30',
            3 => '10.30-12.00',
            4 => '13.00-14.30',
            5 => '14.30-16.00',
        ] as $sesi => $jam) {
            $this->ensure('sesi', [
                'sesi' => $sesi,
                'jam' => $jam,
                'is_delete' => false,
            ], [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ([
            'APK' => 'APLIKASI PERKANTORAN',
            'DG' => 'DESAIN GRAFIS',
        ] as $id => $nama) {
            $this->ensure('materi', [
                'id' => $id,
                'is_delete' => false,
            ], [
                'nama_materi' => $nama,
                'id_index' => $id === 'APK' ? 1 : 2,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $lokasiId = DB::table('lokasi_blc')->where('is_delete', false)->where('aktif', true)->orderBy('id')->value('id');
        $user = User::query()->where('username', 'instruktur.baru')->first();
        if ($user !== null) {
            TimBlcModel::query()->firstOrCreate([
                'user_id' => (string) $user->id,
                'role' => 'instruktur',
                'is_delete' => false,
            ], [
                'nama_lengkap' => $user->name,
                'email' => $user->email,
                'nik' => $user->nik,
                'username' => $user->username,
                'lokasi_blc_id' => $lokasiId,
                'is_surabaya' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function ensure(string $table, array $where, array $values): void
    {
        if (! DB::table($table)->where($where)->exists()) {
            DB::table($table)->insert(array_merge($where, $values));
        }
    }
}
