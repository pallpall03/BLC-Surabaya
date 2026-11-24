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
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Login berhasil! Mengalihkan...' });
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        const tujuan = HALAMAN_ROLE[data.user?.role?.slug] ?? '/';
        setTimeout(() => router.push(tujuan), 800);
      } else {
        setMessage({ type: 'error', text: data.message || 'Login gagal' });
      }
    } catch {
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
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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