<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Admin\System\LevelPengguna\Infrastructure\LevelPenggunaModel;

class LevelPenggunaSeeder extends Seeder
{
    public function run(): void
    {
        LevelPenggunaModel::insert([
            [
                'nama' => 'Admin',
                'slug' => LevelPenggunaModel::ADMIN,
                'deskripsi' => 'Administrator dengan akses penuh pada modul',
                'urutan' => 1,
                'is_aktif' => true,
            ],
            [
                'nama' => 'Operator',
                'slug' => LevelPenggunaModel::OPERATOR,
                'deskripsi' => 'Operator sistem untuk pengelolaan data',
                'urutan' => 2,
                'is_aktif' => true,
            ],
            [
                'nama' => 'Koordinator',
                'slug' => LevelPenggunaModel::KOORDINATOR,
                'deskripsi' => 'Koordinator monitoring beberapa BLC',
                'urutan' => 3,
                'is_aktif' => true,
            ],
            [
                'nama' => 'Instruktur',
                'slug' => LevelPenggunaModel::INSTRUKTUR,
                'deskripsi' => 'Instruktur pengajar di BLC',
                'urutan' => 4,
                'is_aktif' => true,
            ],
            [
                'nama' => 'User',
                'slug' => LevelPenggunaModel::USER,
                'deskripsi' => 'Peserta pelatihan dan pengunjung',
                'urutan' => 5,
                'is_aktif' => true,
            ],
        ]);
    }
}