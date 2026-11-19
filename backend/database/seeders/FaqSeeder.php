<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Admin\Data\Faq\Infrastructure\FaqModel;
use App\Modules\Admin\Data\KategoriArtikel\Infrastructure\KategoriArtikelModel;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $kategori = KategoriArtikelModel::where('is_delete', false)->pluck('id')->toArray();

        $faq = [
            [
                'pertanyaan' => 'Bagaimana cara mendaftar di BLC?',
                'jawaban' => 'Anda bisa mendaftar melalui website resmi BLC Surabaya atau datang langsung ke kantor.',
                'kategori_id' => $kategori[0] ?? 1,
                'urutan' => 1,
                'is_aktif' => true,
            ],
            [
                'pertanyaan' => 'Apa syarat mengikuti pelatihan?',
                'jawaban' => 'Syaratnya adalah berusia minimal 17 tahun, memiliki KTP, dan lulus seleksi administrasi.',
                'kategori_id' => $kategori[1] ?? 1,
                'urutan' => 2,
                'is_aktif' => true,
            ],
            [
                'pertanyaan' => 'Berapa biaya pelatihan?',
                'jawaban' => 'Biaya bervariasi tergantung program. Silakan hubungi admin untuk informasi detail.',
                'kategori_id' => $kategori[2] ?? 1,
                'urutan' => 3,
                'is_aktif' => true,
            ],
            [
                'pertanyaan' => 'Apakah ada sertifikat setelah lulus?',
                'jawaban' => 'Ya, peserta yang lulus akan mendapat sertifikat resmi dari BLC Surabaya.',
                'kategori_id' => $kategori[3] ?? 1,
                'urutan' => 4,
                'is_aktif' => true,
            ],
            [
                'pertanyaan' => 'Kapan jadwal pelatihan dimulai?',
                'jawaban' => 'Jadwal bervariasi per program. Cek halaman "Jadwal" di website untuk info terbaru.',
                'kategori_id' => $kategori[4] ?? 1,
                'urutan' => 5,
                'is_aktif' => true,
            ],
        ];

        foreach ($faq as $item) {
            FaqModel::firstOrCreate(
                ['pertanyaan' => $item['pertanyaan']],
                $item
            );
        }
    }
}