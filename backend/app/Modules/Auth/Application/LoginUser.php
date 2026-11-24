<?php

namespace App\Modules\Auth\Application;

use App\Models\User;
use App\Modules\Admin\Data\TimBlc\Infrastructure\TimBlcModel;
use App\Modules\Instruktur\DaftarPeserta\Infrastructure\PesertaModel;
use App\Modules\Auth\Contracts\UserRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Session;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Login untuk semua role (satu pintu) menggunakan NIK atau username.
 * - Captcha muncul setelah 1× salah, refresh tiap 1 menit
 * - Lock setelah >2× salah, unlock oleh admin
 */
final class LoginUser
{
    private const MAX_ATTEMPTS = 5;
    private const LOCKOUT_SECONDS = 86400; // 24 jam, unlock manual oleh admin
    private const CAPTCHA_TTL = 60; // 1 menit

    public function __construct(private readonly UserRepository $users)
    {
    }

    /**
     * @return array{user: User, token: string, expires_in: int, captcha_required: bool, captcha_key: string|null, captcha_question: string|null}
     *
     * @throws AuthenticationException
     * @throws AuthorizationException
     */
    public function handle(string $loginIdentifier, string $password, ?string $captcha = null, ?string $captchaKey = null): array
    {
        $ip = request()->ip();
        $key = "login:{$loginIdentifier}|{$ip}";
        $lockKey = "login_lock:{$loginIdentifier}|{$ip}";

        // Cek apakah terkunci
        if (RateLimiter::tooManyAttempts($lockKey, 1)) {
            $retryAfter = RateLimiter::availableIn($lockKey);
            throw new AuthorizationException(
                'Akun terkunci karena terlalu banyak percobaan gagal. Hubungi admin untuk unlock. ' .
                "Coba lagi dalam {$retryAfter} detik."
            );
        }

        // Cari user via login identifier (NIK atau username)
        $user = $this->findUserByLoginIdentifier($loginIdentifier);

        if ($user === null) {
            Hash::make($password); // timing attack prevention
            $this->recordFailedAttempt($key, $lockKey);
            $captchaData = $this->generateCaptcha();
            $headers = [
                'captcha_required' => true,
                'captcha_key' => $captchaData['key'],
                'captcha_question' => $captchaData['question'],
            ];
            throw new AuthenticationException('NIK atau password salah.', [], null, $headers);
        }

        // Cek captcha jika required
        $attempts = RateLimiter::attempts($key);
        $captchaRequired = $attempts >= 2;

        if ($captchaRequired) {
                    if (!$captcha || !$captchaKey) {
                        $captchaData = $this->generateCaptcha();
                        $headers = [
                            'captcha_required' => true,
                            'captcha_key' => $captchaData['key'],
                            'captcha_question' => $captchaData['question'],
                        ];
                        throw new AuthenticationException('Captcha wajib diisi setelah 1 kali gagal login.', [], null, $headers);
                    }

                    if (!$this->verifyCaptcha($captcha, $captchaKey)) {
                        $this->recordFailedAttempt($key, $lockKey);
                        $captchaData = $this->generateCaptcha();
                        $headers = [
                            'captcha_required' => true,
                            'captcha_key' => $captchaData['key'],
                            'captcha_question' => $captchaData['question'],
                        ];
                        throw new AuthenticationException('Captcha tidak valid atau sudah kadaluarsa.', [], null, $headers);
                    }
                }

        if (!Hash::check($password, $user->password)) {
            $this->recordFailedAttempt($key, $lockKey);
            $captchaData = $this->generateCaptcha();
            $headers = [
                'captcha_required' => $captchaRequired,
                'captcha_key' => $captchaRequired ? $captchaData['key'] : null,
                'captcha_question' => $captchaRequired ? $captchaData['question'] : null,
            ];
            throw new AuthenticationException('NIK atau password salah.', [], null, $headers);
        }

        if ($user->role === null) {
            throw new AuthorizationException('Akun ini belum memiliki role. Hubungi admin.');
        }

        // Reset attempts on success
        RateLimiter::clear($key);

        $captchaData = $captchaRequired ? $this->generateCaptcha() : ['key' => null, 'question' => null];

        return [
            'user' => $user,
            'token' => JWTAuth::fromUser($user),
            'expires_in' => self::detikBerlaku(),
            'captcha_required' => $captchaRequired,
            'captcha_key' => $captchaData['key'],
            'captcha_question' => $captchaData['question'],
        ];
    }

    private function findUserByLoginIdentifier(string $loginIdentifier): ?User
    {
        // Cari di tim_blc (instruktur, koordinator, admin) - NIK
        $timBlc = TimBlcModel::where('nik', $loginIdentifier)
            ->where('is_delete', false)
            ->first();
        if ($timBlc && $timBlc->user_id) {
            $user = User::with('role')->find($timBlc->user_id);
            if ($user) {
                return $user;
            }
        }

        // Cari di peserta - NIK atau email (skip jika table tidak ada)
        try {
            if (\Schema::hasTable('peserta')) {
                $peserta = PesertaModel::where('nik', $loginIdentifier)
                    ->orWhere('email', $loginIdentifier)
                    ->where('is_delete', false)
                    ->first();

                if ($peserta && $peserta->email) {
                    $user = User::with('role')
                        ->where('email', $peserta->email)
                        ->first();
                    if ($user) {
                        return $user;
                    }
                }
            }
        } catch (\Exception $e) {
            // Table tidak ada, lanjut ke fallback
        }

        // Fallback: cari di users table by email (for backward compat)
        return User::with('role')
            ->whereRaw('lower(email) = ?', [mb_strtolower(trim($loginIdentifier))])
            ->first();
    }

    private function recordFailedAttempt(string $key, string $lockKey): void
    {
        RateLimiter::hit($key, self::CAPTCHA_TTL);
        $attempts = RateLimiter::attempts($key);

        if ($attempts > self::MAX_ATTEMPTS) {
            // Lock account
            RateLimiter::hit($lockKey, self::LOCKOUT_SECONDS);
        }
    }

    private function verifyCaptcha(string $captcha, string $captchaKey): bool
    {
        $stored = Session::get("captcha_{$captchaKey}");
        return $stored && mb_strtolower(trim($stored)) === mb_strtolower(trim($captcha));
    }

    /** Generate a new captcha question. */
    public function generateCaptcha(): array
    {
        $key = 'captcha_' . bin2hex(random_bytes(16));
        $a = random_int(1, 9);
        $b = random_int(1, 9);
        $answer = (string)($a + $b);
        Session::put("captcha_{$key}", $answer);
        Session::put("{$key}_question", "{$a} + {$b}");
        return [
            'key' => $key,
            'question' => "{$a} + {$b}",
        ];
    }

    /** Masa berlaku token dalam detik (dari JWT_TTL di .env, satuan menit). */
    public static function detikBerlaku(): int
    {
        return JWTAuth::factory()->getTTL() * 60;
    }
}
