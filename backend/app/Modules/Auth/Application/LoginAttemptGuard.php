<?php

namespace App\Modules\Auth\Application;

use App\Models\User;
use Illuminate\Support\Facades\Cache;

/**
 * Menghitung percobaan login yang salah per NIK.
 * Akun nyata dihitung di database (kolom users.failed_login_attempts / locked_at) supaya admin bisa melihat
 * dan membukanya. NIK yang tidak terdaftar dihitung di cache dengan aturan yang sama, sehingga respons
 * (captcha muncul, terkunci) identik dan keberadaan NIK tidak bisa ditebak.
 */
final class LoginAttemptGuard
{
    private const TTL_CACHE_DETIK = 86400;

    public function gagal(string $nik, ?User $user): int
    {
        return $user !== null ? (int) $user->failed_login_attempts : (int) Cache::get($this->kunci($nik), 0);
    }

    public function terkunci(string $nik, ?User $user): bool
    {
        if ($user !== null) {
            return $user->locked_at !== null;
        }

        return $this->gagal($nik, null) >= (int) config('login.lock_after');
    }

    public function captchaDiperlukan(string $nik, ?User $user): bool
    {
        return $this->gagal($nik, $user) >= (int) config('login.captcha_after');
    }

    public function sisaPercobaan(string $nik, ?User $user): int
    {
        return max(0, (int) config('login.lock_after') - $this->gagal($nik, $user));
    }

    /** Catat satu kegagalan; mengembalikan jumlah gagal terbaru. */
    public function catatGagal(string $nik, ?User $user): int
    {
        $batasKunci = (int) config('login.lock_after');

        if ($user === null) {
            Cache::add($this->kunci($nik), 0, self::TTL_CACHE_DETIK);

            return (int) Cache::increment($this->kunci($nik));
        }

        User::query()->whereKey($user->getKey())->increment('failed_login_attempts');
        $user->refresh();

        if ($user->failed_login_attempts >= $batasKunci && $user->locked_at === null) {
            $user->forceFill(['locked_at' => now()])->save();
        }

        return (int) $user->failed_login_attempts;
    }

    public function reset(string $nik, ?User $user): void
    {
        Cache::forget($this->kunci($nik));

        if ($user !== null && $user->failed_login_attempts > 0) {
            $user->forceFill(['failed_login_attempts' => 0])->save();
        }
    }

    private function kunci(string $nik): string
    {
        return 'login_gagal:'.$nik;
    }
}
