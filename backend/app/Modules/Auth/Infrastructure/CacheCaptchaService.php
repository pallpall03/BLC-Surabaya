<?php

namespace App\Modules\Auth\Infrastructure;

use App\Modules\Auth\Contracts\CaptchaService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Captcha 6 digit berbentuk gambar SVG. Jawaban disimpan di cache dalam bentuk hash,
 * tidak pernah dikirim ke klien. Angkanya digambar sebagai garis (bukan elemen <text>)
 * supaya jawabannya tidak bisa dibaca langsung dari isi SVG.
 *
 * Frontend memuat ulang tiap REFRESH_DETIK (mengikuti sibunda.go.id); server menerima
 * sedikit lebih lama (BERLAKU_DETIK) agar tidak gagal tepat di pergantian captcha.
 */
final class CacheCaptchaService implements CaptchaService
{
    public const REFRESH_DETIK = 60;

    public const BERLAKU_DETIK = 90;

    private const PANJANG = 6;

    private const LEBAR = 200;

    private const TINGGI = 64;

    /**
     * Garis tiap digit pada kotak 0..1 (x) dan 0..2 (y). Satu digit bisa terdiri dari beberapa garis.
     *
     * @var array<string, list<list<array{0: float, 1: float}>>>
     */
    private const GARIS = [
        '0' => [[[0, 0], [1, 0], [1, 2], [0, 2], [0, 0]]],
        '1' => [[[0.2, 0.4], [0.6, 0], [0.6, 2]]],
        '2' => [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 2], [1, 2]]],
        '3' => [[[0, 0], [1, 0], [1, 2], [0, 2]], [[0.2, 1], [1, 1]]],
        '4' => [[[0, 0], [0, 1], [1, 1]], [[1, 0], [1, 2]]],
        '5' => [[[1, 0], [0, 0], [0, 1], [1, 1], [1, 2], [0, 2]]],
        '6' => [[[1, 0], [0, 0], [0, 2], [1, 2], [1, 1], [0, 1]]],
        '7' => [[[0, 0], [1, 0], [0.4, 2]]],
        '8' => [[[0, 0], [1, 0], [1, 2], [0, 2], [0, 0]], [[0, 1], [1, 1]]],
        '9' => [[[1, 1], [0, 1], [0, 0], [1, 0], [1, 2], [0, 2]]],
    ];

    public function buat(): array
    {
        $kode = '';
        for ($i = 0; $i < self::PANJANG; $i++) {
            $kode .= (string) random_int(0, 9);
        }

        $id = Str::random(40);
        Cache::put($this->kunci($id), $this->hash($kode), self::BERLAKU_DETIK);

        return [
            'id' => $id,
            'image' => 'data:image/svg+xml;base64,'.base64_encode($this->gambar($kode)),
            'refresh_in' => self::REFRESH_DETIK,
        ];
    }

    public function verifikasi(?string $id, ?string $jawaban): bool
    {
        if ($id === null || $id === '' || $jawaban === null || trim($jawaban) === '') {
            return false;
        }

        // pull = ambil lalu hapus: satu captcha hanya boleh dicoba sekali.
        $tersimpan = Cache::pull($this->kunci($id));

        return is_string($tersimpan) && hash_equals($tersimpan, $this->hash(trim($jawaban)));
    }

    private function kunci(string $id): string
    {
        return 'captcha:'.hash('sha256', $id);
    }

    private function hash(string $kode): string
    {
        return hash_hmac('sha256', $kode, (string) config('app.key'));
    }

    private function gambar(string $kode): string
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="'.self::LEBAR.'" height="'.self::TINGGI
            .'" viewBox="0 0 '.self::LEBAR.' '.self::TINGGI.'">'
            .'<rect width="100%" height="100%" fill="#f1f5f9"/>';

        // garis pengganggu di belakang angka
        for ($i = 0; $i < 6; $i++) {
            $svg .= sprintf(
                '<path d="M%d %d Q%d %d %d %d" stroke="#94a3b8" stroke-width="1.5" fill="none"/>',
                random_int(0, self::LEBAR), random_int(0, self::TINGGI),
                random_int(0, self::LEBAR), random_int(0, self::TINGGI),
                random_int(0, self::LEBAR), random_int(0, self::TINGGI),
            );
        }

        $lebarSlot = self::LEBAR / self::PANJANG;

        foreach (str_split($kode) as $urut => $digit) {
            $skala = random_int(1300, 1700) / 100;      // 13 - 17 px per satuan
            $x = $urut * $lebarSlot + random_int(6, 12);
            $y = random_int(8, 14);
            $putar = random_int(-14, 14);
            $warna = ['#1e3a8a', '#0f766e', '#9a3412', '#4c1d95'][random_int(0, 3)];

            $svg .= sprintf('<g transform="translate(%.1f %.1f) rotate(%d) scale(%.2f)" stroke="%s" stroke-width="%.2f" fill="none" stroke-linecap="round" stroke-linejoin="round">',
                $x, $y, $putar, $skala / 10, $warna, 1.6 + random_int(0, 6) / 10);

            foreach (self::GARIS[$digit] as $garis) {
                $titik = [];
                foreach ($garis as [$gx, $gy]) {
                    // goyang sedikit tiap titik supaya bentuknya tidak persis sama
                    $titik[] = sprintf('%.1f,%.1f', $gx * 10 + random_int(-6, 6) / 10, $gy * 10 + random_int(-6, 6) / 10);
                }
                $svg .= '<polyline points="'.implode(' ', $titik).'"/>';
            }

            $svg .= '</g>';
        }

        // garis pengganggu di depan angka
        for ($i = 0; $i < 3; $i++) {
            $svg .= sprintf(
                '<line x1="0" y1="%d" x2="%d" y2="%d" stroke="#64748b" stroke-width="1" opacity="0.7"/>',
                random_int(0, self::TINGGI), self::LEBAR, random_int(0, self::TINGGI),
            );
        }

        return $svg.'</svg>';
    }
}
