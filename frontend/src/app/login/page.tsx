'use client';

import { useCallback, useEffect, useState } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { ambilCaptcha, masuk, simpanUserTampilan, AuthError } from '@/lib/auth';

// Captcha dimuat ulang tiap 1 menit (mengikuti sibunda.go.id); server mengirim angka yang sama (refresh_in).
const REFRESH_DETIK = 60;

type Captcha = { id: string; image: string };
type Pesan = { jenis: 'sukses' | 'galat' | 'terkunci'; teks: string };

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [lihatPassword, setLihatPassword] = useState(false);
  const [captchaWajib, setCaptchaWajib] = useState(false);
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [jawabanCaptcha, setJawabanCaptcha] = useState('');
  const [sisaPercobaan, setSisaPercobaan] = useState<number | null>(null);
  const [terkunci, setTerkunci] = useState(false);
  const [memuatCaptcha, setMemuatCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState<Pesan | null>(null);
  const [refreshDetik, setRefreshDetik] = useState(REFRESH_DETIK);

  const muatCaptcha = useCallback(async () => {
    setMemuatCaptcha(true);
    try {
      const data = await ambilCaptcha();
      setCaptcha({ id: data.id, image: data.image });
      setRefreshDetik(data.refresh_in || REFRESH_DETIK);
      setJawabanCaptcha('');
    } catch {
      setCaptcha(null);
    } finally {
      setMemuatCaptcha(false);
    }
  }, []);

  // Captcha hanya muncul setelah salah password kedua. Setiap captcha baru dimuat ulang
  // otomatis 1 menit kemudian (timer mulai dari nol tiap kali captcha berganti).
  useEffect(() => {
    if (!captchaWajib || terkunci || !captcha) return;

    const timer = setTimeout(() => {
      muatCaptcha();
    }, refreshDetik * 1000);

    return () => clearTimeout(timer);
  }, [captchaWajib, terkunci, captcha, refreshDetik, muatCaptcha]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (terkunci) return;

    if (!login.trim()) {
      setPesan({ jenis: 'galat', teks: 'NIK, username, atau email wajib diisi.' });
      return;
    }
    if (captchaWajib && !jawabanCaptcha.trim()) {
      setPesan({ jenis: 'galat', teks: 'Captcha wajib diisi.' });
      return;
    }

    setLoading(true);
    setPesan(null);

    try {
      const data = await masuk({
        login: login.trim(),
        password,
        captchaId: captchaWajib && captcha ? captcha.id : undefined,
        captcha: captchaWajib && captcha ? jawabanCaptcha.trim() : undefined,
      });

      simpanUserTampilan(data.user);
      setPesan({ jenis: 'sukses', teks: 'Login berhasil! Mengalihkan...' });
      setTimeout(() => window.location.assign(data.dashboard_url || '/'), 600);
    } catch (galat) {
      if (!(galat instanceof AuthError)) {
        setPesan({ jenis: 'galat', teks: 'Koneksi ke server gagal' });
        return;
      }

      if (galat.status === 423 || galat.data.locked === true) {
        setTerkunci(true);
        setCaptchaWajib(false);
        setPesan({ jenis: 'terkunci', teks: galat.message || 'Akun terkunci. Hubungi admin untuk membukanya.' });
        return;
      }

      setPesan({ jenis: 'galat', teks: galat.message || 'Login gagal' });
      setPassword('');
      setSisaPercobaan(typeof galat.data.attempts_left === 'number' ? galat.data.attempts_left : null);

      if (galat.data.captcha_required === true) {
        // captcha sekali pakai: setelah dicoba (benar atau salah) harus diganti
        setCaptchaWajib(true);
        void muatCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/metronic/assets/css/style.bundle.css" precedence="default" />
      <style>{`
        .blc-login { --blc-oranye: #f97316; --blc-oranye-tua: #ea580c; font-family: Inter, Helvetica, "Segoe UI", sans-serif; }
        .blc-login .btn.btn-primary { background-color: var(--blc-oranye); border-color: var(--blc-oranye); }
        .blc-login .btn.btn-primary:hover:not(:disabled) { background-color: var(--blc-oranye-tua); border-color: var(--blc-oranye-tua); }
        .blc-login .btn.btn-primary:disabled { opacity: .6; }
        .blc-login .link-primary { color: var(--blc-oranye); }
        .blc-login .form-control:focus { border-color: var(--blc-oranye); box-shadow: 0 0 0 3px rgba(249,115,22,.15); }
        .blc-login .blc-panel { background-color: #7c2d12; background-image: url('/metronic/assets/media/misc/auth-bg.png'); background-size: cover; background-position: center; }
        .blc-login .blc-captcha-img { height: 64px; width: 200px; max-width: 100%; border: 1px solid #e4e6ef; border-radius: .475rem; background: #f1f5f9; }
      `}</style>

      <div className="blc-login d-flex flex-column flex-root" id="kt_app_root" style={{ minHeight: '100vh', background: '#fff' }}>
        <div className="d-flex flex-column flex-lg-row flex-column-fluid" style={{ minHeight: '100vh' }}>
          {/* Form */}
          <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
            <div className="d-flex flex-center flex-column flex-lg-row-fluid">
              <div className="w-lg-500px p-10">
                <form className="form w-100" method="post" action="/login" noValidate onSubmit={handleSubmit}>
                  <div className="text-center mb-10">
                    <div className="d-inline-flex align-items-center justify-content-center rounded mb-5"
                      style={{ width: 56, height: 56, background: '#f97316', color: '#fff', fontWeight: 800, letterSpacing: 1 }}>
                      BLC
                    </div>
                    <h1 className="text-dark fw-bolder mb-3">Masuk</h1>
                    <div className="text-gray-500 fw-semibold fs-6">BLC Surabaya</div>
                  </div>

                  {pesan && (
                    <div
                      role="alert"
                      className={`alert mb-8 ${
                        pesan.jenis === 'sukses' ? 'alert-success' : pesan.jenis === 'terkunci' ? 'alert-warning' : 'alert-danger'
                      }`}
                    >
                      {pesan.teks}
                      {pesan.jenis === 'galat' && sisaPercobaan !== null && sisaPercobaan > 0 && (
                        <div className="fs-7 mt-1">Sisa percobaan sebelum akun terkunci: {sisaPercobaan}</div>
                      )}
                    </div>
                  )}

                  <div className="fv-row mb-8">
                    <label htmlFor="login" className="form-label fs-6 fw-bold text-dark">NIK, Username, atau Email</label>
                    <input
                      id="login"
                      type="text"
                      name="login"
                      inputMode="text"
                      autoComplete="username"
                      placeholder="Masukkan NIK, username, atau email"
                      maxLength={255}
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      disabled={terkunci}
                      className="form-control bg-transparent"
                    />
                  </div>

                  <div className="fv-row mb-8">
                    <label htmlFor="password" className="form-label fs-6 fw-bold text-dark">Password</label>
                    <div className="position-relative">
                      <input
                        id="password"
                        type={lihatPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="current-password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={terkunci}
                        className="form-control bg-transparent"
                        style={{ paddingRight: 44 }}
                      />
                      <button
                        type="button"
                        onClick={() => setLihatPassword((v) => !v)}
                        aria-label={lihatPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        className="btn btn-sm btn-icon position-absolute top-50 end-0 translate-middle-y me-2"
                        tabIndex={-1}
                      >
                        {lihatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {captchaWajib && !terkunci && (
                    <div className="fv-row mb-8">
                      <label htmlFor="captcha" className="form-label fs-6 fw-bold text-dark">Captcha</label>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        {captcha ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={captcha.image} alt="Captcha" className="blc-captcha-img" />
                        ) : (
                          <div className="blc-captcha-img d-flex flex-center text-gray-500 fs-7">
                            {memuatCaptcha ? 'Memuat captcha...' : 'Captcha gagal dimuat'}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => muatCaptcha()}
                          disabled={memuatCaptcha}
                          aria-label="Muat ulang captcha"
                          className="btn btn-sm btn-icon btn-light"
                        >
                          <RefreshCw size={16} className={memuatCaptcha ? 'animate-spin' : ''} />
                        </button>
                      </div>
                      <input
                        id="captcha"
                        type="text"
                        name="captcha"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Masukkan angka pada gambar"
                        maxLength={10}
                        value={jawabanCaptcha}
                        onChange={(e) => setJawabanCaptcha(e.target.value.replace(/\D/g, ''))}
                        className="form-control bg-transparent"
                      />
                      <div className="text-gray-500 fs-8 mt-2">Gambar diganti otomatis tiap 1 menit.</div>
                    </div>
                  )}

                  <div className="d-grid mb-10">
                    <button type="submit" disabled={loading || terkunci} className="btn btn-primary">
                      {loading ? (
                        <span>
                          Mohon tunggu...
                          <span className="spinner-border spinner-border-sm align-middle ms-2" />
                        </span>
                      ) : (
                        <span>Masuk</span>
                      )}
                    </button>
                  </div>

                  <div className="text-gray-500 text-center fw-semibold fs-6">
                    Belum punya akun?{' '}
                    <a href="/register" className="link-primary">Daftar sebagai peserta</a>
                  </div>
                </form>
              </div>
            </div>

            <div className="d-flex flex-center fs-base fw-semibold text-gray-500 pb-2">
              © {new Date().getFullYear()} BLC Surabaya
            </div>
          </div>

          {/* Panel kanan */}
          <div className="blc-panel d-flex flex-lg-row-fluid w-lg-50 order-1 order-lg-2" style={{ minHeight: 220 }}>
            <div className="d-flex flex-column flex-center py-10 px-10 w-100 text-center">
              <h1 className="d-none d-lg-block text-white fs-2qx fw-bolder mb-5">Broadband Learning Center</h1>
              <div className="d-none d-lg-block text-white fs-base fw-semibold" style={{ maxWidth: 420 }}>
                Satu pintu masuk untuk administrator, koordinator, instruktur, operator, dan peserta pelatihan BLC Surabaya.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
