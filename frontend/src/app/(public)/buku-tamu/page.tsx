"use client";

import { useState } from "react";

type Pesan = {
  id: number;
  nama: string;
  email: string;
  isi: string;
};

export default function HalamanBukuTamu() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [isi, setIsi] = useState("");
  const [error, setError] = useState("");
  const [berhasil, setBerhasil] = useState(false);
  const [daftar, setDaftar] = useState<Pesan[]>([]);

  function handleKirim() {
    setBerhasil(false);

    if (!nama.trim() || !isi.trim()) {
      setError("Nama dan pesan wajib diisi.");
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setError("");
    setDaftar([{ id: Date.now(), nama, email, isi }, ...daftar]);
    setNama("");
    setEmail("");
    setIsi("");
    setBerhasil(true);
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-orange-600 mb-8">Buku Tamu</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4 mb-10">
        <div>
          <label className="block text-sm font-medium mb-1">Nama *</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pesan *</label>
          <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {berhasil && (
          <p className="text-sm text-green-600">Terima kasih, pesan terkirim.</p>
        )}

        <button
          type="button"
          onClick={handleKirim}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Kirim
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Pesan Terbaru</h2>
      {daftar.length === 0 ? (
        <p className="text-gray-500">Belum ada pesan.</p>
      ) : (
        <div className="space-y-4">
          {daftar.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow p-5">
              <p className="font-semibold">{p.nama}</p>
              <p className="text-gray-600 text-sm mt-1">{p.isi}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
