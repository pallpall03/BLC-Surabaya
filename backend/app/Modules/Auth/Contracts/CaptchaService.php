<?php

namespace App\Modules\Auth\Contracts;

interface CaptchaService
{
    /**
     * Buat captcha baru.
     *
     * @return array{id: string, image: string, refresh_in: int}
     */
    public function buat(): array;

    /** Cek jawaban. Captcha hanya berlaku sekali pakai: salah pun langsung hangus. */
    public function verifikasi(?string $id, ?string $jawaban): bool;
}
