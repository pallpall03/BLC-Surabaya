<?php

namespace App\Modules\Auth\Application;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Captcha gambar. Jawaban hanya disimpan sebagai hash di cache, berlaku 60 detik
 * dan sekali pakai (dihapus saat dicek, benar maupun salah).
 */
final class CaptchaService
{
    // Tanpa karakter yang mudah tertukar (0/O, 1/I/L).
    private const KARAKTER = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    private const PANJANG = 5;

    /** @return array{captcha_id: string, image: string, expires_in: int} */
    public function buat(): array
    {
        $kode = '';
        for ($i = 0; $i < self::PANJANG; $i++) {
            $kode .= self::KARAKTER[random_int(0, strlen(self::KARAKTER) - 1)];
        }

        $ttl = (int) config('login.captcha_ttl', 60);
        $id = (string) Str::uuid();
        Cache::put($this->kunci($id), $this->hash($kode), $ttl);

        return [
            'captcha_id' => $id,
            'image' => function_exists('imagecreatetruecolor') ? $this->png($kode) : $this->svg($kode),
            'expires_in' => $ttl,
        ];
    }

    public function cek(?string $id, ?string $jawaban): bool
    {
        if ($id === null || $id === '' || $jawaban === null || $jawaban === '') {
            return false;
        }

        $hash = Cache::pull($this->kunci($id)); // sekali pakai

        return is_string($hash) && hash_equals($hash, $this->hash($jawaban));
    }

    private function kunci(string $id): string
    {
        return 'login_captcha:'.$id;
    }

    private function hash(string $teks): string
    {
        return hash_hmac('sha256', strtoupper(trim($teks)), (string) config('app.key'));
    }

    /** Gambar PNG via GD (bawaan Laragon). Tiap huruf diputar dan diberi derau. */
    private function png(string $kode): string
    {
        $w = 190;
        $h = 64;
        $img = imagecreatetruecolor($w, $h);
        imagefilledrectangle($img, 0, 0, $w, $h, imagecolorallocate($img, 241, 250, 255));

        for ($i = 0; $i < 7; $i++) {
            $warna = imagecolorallocate($img, random_int(150, 210), random_int(150, 210), random_int(150, 210));
            imageline($img, random_int(0, $w), random_int(0, $h), random_int(0, $w), random_int(0, $h), $warna);
        }

        $x = 12;
        foreach (str_split($kode) as $huruf) {
            $kecil = imagecreatetruecolor(16, 20);
            $latar = imagecolorallocate($kecil, 241, 250, 255);
            imagefilledrectangle($kecil, 0, 0, 16, 20, $latar);
            imagestring($kecil, 5, 2, 2, $huruf, imagecolorallocate($kecil, random_int(0, 60), random_int(0, 90), random_int(60, 140)));
            $putar = imagerotate($kecil, random_int(-25, 25), $latar);
            $ukuran = random_int(34, 44);
            imagecopyresampled($img, $putar, $x, random_int(4, 14), 0, 0, $ukuran, $ukuran + 6, imagesx($putar), imagesy($putar));
            $x += 34;
        }

        for ($i = 0; $i < 120; $i++) {
            imagesetpixel($img, random_int(0, $w - 1), random_int(0, $h - 1), imagecolorallocate($img, random_int(80, 200), random_int(80, 200), random_int(80, 200)));
        }

        ob_start();
        imagepng($img);
        $biner = (string) ob_get_clean();

        return 'data:image/png;base64,'.base64_encode($biner);
    }

    /** Cadangan bila ekstensi GD tidak aktif (cukup untuk pengembangan, bot lebih mudah membacanya). */
    private function svg(string $kode): string
    {
        $isi = '';
        foreach (str_split($kode) as $i => $huruf) {
            $isi .= sprintf(
                '<text x="%d" y="%d" font-size="34" font-family="monospace" font-weight="bold" fill="#1b4b8f" transform="rotate(%d %d 40)">%s</text>',
                14 + $i * 34, random_int(38, 50), random_int(-22, 22), 14 + $i * 34, $huruf
            );
        }
        for ($i = 0; $i < 6; $i++) {
            $isi .= sprintf('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#9db4cc" stroke-width="2"/>', random_int(0, 190), random_int(0, 64), random_int(0, 190), random_int(0, 64));
        }

        return 'data:image/svg+xml;base64,'.base64_encode(
            '<svg xmlns="http://www.w3.org/2000/svg" width="190" height="64"><rect width="190" height="64" fill="#f1faff"/>'.$isi.'</svg>'
        );
    }
}
