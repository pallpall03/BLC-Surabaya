<?php

namespace App\Modules\Auth\Application;

use App\Models\User;
use App\Modules\Auth\Application\Exceptions\LoginDitolak;
use App\Modules\Auth\Contracts\CaptchaService;
use App\Modules\Auth\Contracts\UserRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Login untuk semua role (satu pintu) memakai NIK atau username dan password.
 *
 * Aturan salah password:
 *   - salah ke-1: tanpa captcha
 *   - salah ke-2: captcha muncul dan wajib diisi di percobaan berikutnya
 *   - salah ke-3 (lebih dari dua kali): akun terkunci, hanya admin yang bisa membuka
 *
 * Pesan gagal sama untuk "login tidak ada" dan "password salah". Login yang tidak terdaftar
 * dihitung dan dikunci lewat cache dengan aturan yang sama, jadi perilakunya tidak
 * membedakan login yang ada dan yang tidak.
 *
 * Catatan: integrasi SSO Kantorku belum ada (menunggu spesifikasi API).
 */
final class LoginUser
{
    /** Captcha wajib setelah sekian kali salah password. */
    public const BATAS_CAPTCHA = 2;

    /** Akun terkunci pada salah password ke-sekian. */
    public const BATAS_KUNCI = 3;

    /** Hitungan salah untuk login yang tidak terdaftar disimpan sekian detik. */
    private const TTL_LOGIN_TAK_DIKENAL = 1800;

    public function __construct(
        private readonly UserRepository $users,
        private readonly CaptchaService $captcha,
    ) {
    }

    /**
     * @return array{user: User, token: string, expires_in: int}
     *
     * @throws LoginDitolak
     */
    public function handle(string $login, string $password, ?string $captchaId = null, ?string $captchaJawaban = null): array
    {
        $user = $this->users->findByLogin($login);
        $jumlahSalah = $user !== null ? (int) $user->failed_login_attempts : $this->salahLoginTakDikenal($login);

        if (($user !== null && $user->terkunci()) || $jumlahSalah >= self::BATAS_KUNCI) {
            throw LoginDitolak::terkunci();
        }

        if ($jumlahSalah >= self::BATAS_CAPTCHA) {
            $kosong = $captchaId === null || $captchaId === '' || $captchaJawaban === null || trim($captchaJawaban) === '';

            if (! $this->captcha->verifikasi($captchaId, $captchaJawaban)) {
                throw LoginDitolak::captchaTidakValid($kosong);
            }
        }

        if (! $this->passwordBenar($user, $password)) {
            $jumlahSalah = $this->catatSalah($user, $login);

            if ($jumlahSalah >= self::BATAS_KUNCI) {
                throw LoginDitolak::terkunci();
            }

            throw LoginDitolak::kredensialSalah($jumlahSalah, self::BATAS_CAPTCHA, self::BATAS_KUNCI);
        }

        if ($user->role === null) {
            throw LoginDitolak::tanpaRole();
        }

        if ($user->is_aktif === false) {
            throw LoginDitolak::nonaktif();
        }

        if ($jumlahSalah > 0) {
            $user->forceFill(['failed_login_attempts' => 0])->save();
        }

        return [
            'user' => $user,
            'token' => JWTAuth::fromUser($user),
            'expires_in' => self::detikBerlaku(),
        ];
    }

    /** Masa berlaku token dalam detik (dari JWT_TTL di .env, satuan menit). */
    public static function detikBerlaku(): int
    {
        return JWTAuth::factory()->getTTL() * 60;
    }

    private function passwordBenar(?User $user, string $password): bool
    {
        if ($user === null) {
            // Tetap menghitung hash supaya waktu responsnya setara dengan "password salah":
            // Login yang terdaftar tidak bisa ditebak dari kecepatan respons.
            Hash::make($password);

            return false;
        }

        return Hash::check($password, $user->password);
    }

    /** Tambah hitungan salah, kunci akun bila sudah sampai batas. Mengembalikan hitungan terbaru. */
    private function catatSalah(?User $user, string $login): int
    {
        if ($user === null) {
            $kunci = $this->kunciLoginTakDikenal($login);
            Cache::add($kunci, 0, self::TTL_LOGIN_TAK_DIKENAL);

            return (int) Cache::increment($kunci);
        }

        $user->increment('failed_login_attempts');
        $jumlah = (int) $user->failed_login_attempts;

        if ($jumlah >= self::BATAS_KUNCI) {
            $user->forceFill(['locked_at' => now()])->save();
        }

        return $jumlah;
    }

    private function salahLoginTakDikenal(string $login): int
    {
        return (int) Cache::get($this->kunciLoginTakDikenal($login), 0);
    }

    private function kunciLoginTakDikenal(string $login): string
    {
        return 'login_salah:'.hash('sha256', $login);
    }
}
