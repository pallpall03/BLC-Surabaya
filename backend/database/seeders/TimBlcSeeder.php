<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Skema akhir tim_blc:
 * user_id (string), nama_lengkap, gender, email, role, avatar (text), phone,
 * lokasi_blc_id, username, is_delete, timestamps.
 * Kolom alamat, kecamatan, kelurahan, is_surabaya, nik, tanggal_lahir, kategori_id sudah di-drop.
 * NIK sekarang hanya ada di users.nik.
 */
class TimBlcSeeder extends Seeder
{
    public function run(): void
    {
        $lokasi = DB::table('lokasi_blc')->where('is_delete', false)->where('aktif', true)
            ->orderBy('id')->pluck('id')->values()->all();

        $tim = [
            ['Dr. Ahmad Fauzi', 'L', 'ahmad@blc.go.id', 'koordinator', 'ahmad.jpg', '08111111111', 'ahmad.fauzi', 'koordinator@blc.test'],
            ['Prof. Siti Aminah', 'P', 'siti@blc.go.id', 'instruktur', 'siti.jpg', '08111111112', 'siti.aminah', 'instruktur@blc.test'],
            ['Ir. Budi Prasetyo', 'L', 'budi@blc.go.id', 'instruktur', 'budi.jpg', '08111111113', 'budi.prasetyo', null],
            ['Drs. Dewi Sartika', 'P', 'dewi@blc.go.id', 'operator', 'dewi.jpg', '08111111114', 'dewi.sartika', 'operator@blc.test'],
            ['Rudi Hartono, S.Kom', 'L', 'rudi@blc.go.id', 'instruktur', 'rudi.jpg', '08111111115', 'rudi.hartono', null],
        ];

<<<<<<< HEAD
        // Endpoint instruktur mencari tim_blc lewat users.id. Pastikan minimal satu baris
        // instruktur tertaut ke akun instruktur demo, bukan ke id user yang kebetulan sama.
        $instrukturDemoId = User::query()->where('email', 'instruktur@blc.test')->value('id')
            ?? User::query()
                ->whereHas('role', fn ($query) => $query->where('slug', Role::INSTRUKTUR))
                ->orderBy('id')
                ->value('id');

        $sudahTertaut = false;

        foreach ($tim as $item) {
            $baris = TimBlcModel::firstOrCreate(
                ['email' => $item['email']],
                $item
=======
        foreach ($tim as $i => [$nama, $gender, $email, $role, $avatar, $phone, $username, $akunEmail]) {
            // tim_blc.user_id bertipe string = users.id; null bila akun belum ada
            $userId = $akunEmail ? DB::table('users')->where('email', $akunEmail)->value('id') : null;

            DB::table('tim_blc')->updateOrInsert(
                ['email' => $email],
                [
                    'user_id' => $userId !== null ? (string) $userId : null,
                    'nama_lengkap' => $nama,
                    'gender' => $gender,
                    'role' => $role,
                    'avatar' => $avatar,
                    'phone' => $phone,
                    'lokasi_blc_id' => $lokasi[$i % max(count($lokasi), 1)] ?? null,
                    'username' => $username,
                    'is_delete' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
            );

            if ($sudahTertaut || $item['role'] !== Role::INSTRUKTUR || $instrukturDemoId === null) {
                continue;
            }

            $pemilik = $baris->user_id !== null
                ? User::query()->with('role')->find($baris->user_id)
                : null;

            if ($pemilik === null || $pemilik->role?->slug !== Role::INSTRUKTUR) {
                $baris->user_id = (string) $instrukturDemoId;
                $baris->save();
            }

            $sudahTertaut = (string) $baris->user_id === (string) $instrukturDemoId;
        }
    }
}