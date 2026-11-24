'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Halaman tujuan setelah login, menurut role dari backend.
// Role yang halamannya belum dibuat (koordinator, peserta) sementara diarahkan ke beranda.
const HALAMAN_ROLE: Record<string, string> = {
  superadmin: '/administrator',
  operator: '/operator',
  instruktur: '/instruktur',
};

export default function LoginPage() {
  const [formData, setFormData] = useState({
    login_identifier: '',
    password: '',
    captcha: '',
    captcha_key: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validasi: login_identifier diisi
    if (!formData.login_identifier) {
      setMessage({ type: 'error', text: 'NIK atau Username wajib diisi' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login_identifier: formData.login_identifier,
          password: formData.password,
          captcha: formData.captcha,
          captcha_key: formData.captcha_key,
        }),
      });

        const data = await response.json();

        if (response.ok) {
          setMessage({ type: 'success', text: 'Login berhasil! Mengalihkan...' });
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('auth_user', JSON.stringify(data.user));
        
          // Set cookie for middleware access
          const maxAge = 60 * 60 * 24; // 24 hours
          document.cookie = `auth_token=${data.token}; Path=/; Max-Age=${maxAge}; SameSite=Strict${location.protocol === 'https:' ? '; Secure' : ''}`;
        
          const tujuan = HALAMAN_ROLE[data.user?.role?.slug] ?? '/';
          setTimeout(() => router.push(tujuan), 800);
        } else {
          // If captcha required, show captcha field and fetch new captcha
          if (data.captcha_required) {
            setShowCaptcha(true);
            if (data.captcha_key && data.captcha_question) {
                        setFormData(prev => ({ ...prev, captcha_key: data.captcha_key ?? '', captcha: '' }));
                        setCaptchaQuestion(data.captcha_question);
                      }
          }
          setMessage({ type: 'error', text: data.message || 'Login gagal' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Koneksi ke server gagal' });
      } finally {
        setLoading(false);
      }
    };

    return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-full max-w-md space-y-6 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800">Masuk ke Akun</h2>
          <p className="text-center text-gray-600">
            Gunakan akun yang sudah terdaftar
          </p>
          
          {message.text && (
            <div className={`p-3 rounded-md text-sm ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK / Username
              </label>
              <input
                type="text"
                name="login_identifier"
                value={formData.login_identifier ?? ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password ?? ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {showCaptcha && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Captcha: {captchaQuestion}
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-12 bg-gray-100 flex items-center justify-center text-sm text-gray-500 border border-gray-300 rounded-md">
                    {captchaQuestion}
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    value={formData.captcha ?? ''}
                    onChange={handleChange}
                    required
                    className="w-32 h-12 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jawaban"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md font-medium transition ${
                loading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Daftar di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}