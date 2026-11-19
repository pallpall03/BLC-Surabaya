"use client";

import { useEffect, useState } from "react";
import { ambilSlide, tambahSlide, hapusSlide, type Slide } from "@/lib/slider";

export default function HalamanSlider() {
  const [daftar, setDaftar] = useState<Slide[]>([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pesan, setPesan] = useState("");

  // ambil daftar slide saat halaman dibuka
  useEffect(() => {
    ambilSlide().then(setDaftar);
  }, []);

  async function handleTambah() {
    if (!judul.trim() || !file) {
      setPesan("Judul dan gambar wajib diisi.");
      return;
    }

    // FormData = format yang biasa dipakai Laravel untuk upload file
    const data = new FormData();
    data.append("judul", judul);
    data.append("deskripsi", deskripsi);
    data.append("gambar", file);

    const slideBaru = await tambahSlide(data);
    setDaftar((lama) => [...lama, slideBaru]);

    // kosongkan form
    setJudul("");
    setDeskripsi("");
    setFile(null);
    setPesan("");
  }

  async function handleHapus(id: number) {
    await hapusSlide(id);
    setDaftar((lama) => lama.filter((s) => s.id !== id));
  }

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Slider Beranda</h1>

      {/* FORM TAMBAH */}
      <div className="mb-6 rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-semibold">Tambah Slide</h2>

        <label className="mb-1 block text-sm">Judul</label>
        <input
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="mb-4 w-full rounded-lg border px-3 py-2"
        />

        <label className="mb-1 block text-sm">Deskripsi</label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={3}
          className="mb-4 w-full rounded-lg border px-3 py-2"
        />

        <label className="mb-1 block text-sm">Gambar</label>
        <input
          key={daftar.length} // supaya pilihan file ikut kosong setelah tambah
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-4 block"
        />

        {pesan && <p className="mb-3 text-sm text-red-600">{pesan}</p>}

        <button
          onClick={handleTambah}
          className="rounded-lg bg-orange-500 px-5 py-2 text-white hover:bg-orange-600"
        >
          Tambah
        </button>
      </div>

      {/* DAFTAR SLIDE */}
      <div className="rounded-xl border bg-white">
        <h2 className="border-b p-6 font-semibold">Daftar Slide</h2>

        {daftar.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">Belum ada slide.</p>
        ) : (
          <ul className="divide-y">
            {daftar.map((s) => (
              <li key={s.id} className="flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.gambar}
                  alt={s.judul}
                  className="h-16 w-28 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{s.judul}</p>
                  <p className="text-sm text-gray-500">{s.deskripsi}</p>
                </div>
                <button
                  onClick={() => handleHapus(s.id)}
                  className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}