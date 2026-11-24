<?php

namespace App\Modules\Auth\Application\Exceptions;

use RuntimeException;

/**
 * Login ditolak. Membawa status HTTP dan petunjuk untuk frontend
 * (perlu captcha atau tidak, sisa percobaan, akun terkunci).
 */
final class LoginDitolak extends RuntimeException
{
    private function __construct(
        string $message,
        public readonly int $status,
        public readonly bool $captchaWajib = false,
        public readonly ?int $sisaPercobaan = null,
        public readonly bool $terkunci = false,
    ) {
        parent::__construct($message);
    }

    /** NIK tidak ada dan password salah dibalas sama persis, supaya NIK tidak bisa ditebak. */
    public static function kredensialSalah(int $jumlahSalah, int $batasCaptcha, int $batasKunci): self
    {
        return new self(
            'NIK atau password salah.',
            401,
            captchaWajib: $jumlahSalah >= $batasCaptcha,
            sisaPercobaan: max(0, $batasKunci - $jumlahSalah),
        );
    }

    public static function captchaTidakValid(bool $kosong): self
    {
        return new self(
            $kosong ? 'Captcha wajib diisi.' : 'Captcha salah atau kedaluwarsa.',
            422,
            captchaWajib: true,
        );
    }

    public static function terkunci(): self
    {
        return new self(
            'Akun terkunci karena terlalu banyak salah password. Hubungi admin untuk membukanya.',
            423,
            terkunci: true,
        );
    }

    public static function tanpaRole(): self
    {
        return new self('Akun ini belum memiliki role. Hubungi admin.', 403);
    }

    public static function nonaktif(): self
    {
        return new self('Akun tidak aktif. Hubungi admin.', 403);
    }
}
