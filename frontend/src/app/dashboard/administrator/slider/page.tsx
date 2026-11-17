"use client";

import { useState, type ChangeEvent } from "react";
import { Trash2 } from "lucide-react";

type Slide = {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
};

export default function KelolaSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState("");
  const [error, setError] = useState("");

  function handlePilihGambar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setGambar(URL.createObjectURL(file));
  }

  function handleTambah() {
    if (!judul.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    setError("");
    setSlides([...slides, { id: Date.now(), judul, deskripsi, gambar }]);
    setJudul("");
    setDeskripsi("");
    setGambar("");
  }

  function handleHapus(id: number) {
    if (!confirm("Hapus slide ini?")) return;
    setSlides(slides.filter((s) => s.id !== id));
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Slider Beranda</h1>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-semibold">Tambah Slide</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gambar</label>
          <input type="file" accept="image/*" onChange={handlePilihGambar} />
          {gambar && (
            <img
              src={gambar}
              alt="Pratinjau"
              className="mt-3 w-64 h-36 object-cover rounded-lg border"
            />
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleTambah}
          className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-lg"
        >
          Tambah
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Daftar Slide</h2>
        </div>

        {slides.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">
            Belum ada slide.
          </p>
        ) : (
          <ul>
            {slides.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-4 px-6 py-4 border-t first:border-t-0"
              >
                {s.gambar ? (
                  <img
                    src={s.gambar}
                    alt={s.judul}
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-32 h-20 rounded-lg bg-gray-200" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{s.judul}</p>
                  <p className="text-sm text-gray-600">{s.deskripsi}</p>
                </div>
                <button
                  onClick={() => handleHapus(s.id)}
                  className="p-2 rounded hover:bg-red-50 text-red-600"
                  aria-label="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}