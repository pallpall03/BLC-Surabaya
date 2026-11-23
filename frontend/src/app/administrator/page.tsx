"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, ChevronDown, Plus, Search } from "lucide-react";
import { ambilBlcBaru, tambahkanBlc, type BlcBaru } from "./data";
const JUMLAH_AWAL = 8;

export default function HalamanBeranda() {
  const [daftar, setDaftar] = useState<BlcBaru[]>([]);
  const [memuat, setMemuat] = useState<boolean>(true);
  const [cari, setCari] = useState("");
  const [jumlah, setJumlah] = useState<number>(JUMLAH_AWAL);
  const [proses, setProses] = useState<number | null>(null); // id yang sedang diproses
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    ambilBlcBaru()
      .then(setDaftar)
      .finally(() => setMemuat(false));
  }, []);

  // saring berdasarkan kolom pencarian
  const hasil = useMemo(
    () => daftar.filter((b) => b.nama.toLowerCase().includes(cari.toLowerCase())),
    [daftar, cari]
  );
  const tampil = hasil.slice(0, jumlah);

  async function handleTambahkan(blc: BlcBaru) {
    setProses(blc.id);
    await tambahkanBlc(blc.id);
    setDaftar((lama) => lama.filter((b) => b.id !== blc.id));
    setProses(null);

    setPesan(`${blc.nama} berhasil ditambahkan.`);
    setTimeout(() => setPesan(""), 3000);
  }

  return (
    <div className="space-y-6">
      {/* BANNER SAMBUTAN */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-orange-400 p-6 text-white shadow-lg shadow-orange-200 sm:p-8">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />
        <Building2 size={72} className="absolute right-8 top-1/2 hidden -translate-y-1/2 text-white/20 sm:block" />

        <div className="relative max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Selamat datang</h2>
          <p className="mt-2 text-sm text-orange-50 sm:text-base">
            Kelola konten Website Profil BLC Surabaya dari satu tempat.
          </p>

          {!memuat && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              {daftar.length} BLC baru menunggu ditambahkan
            </p>
          )}
        </div>
      </section>

      {/* PESAN SUKSES */}
      {pesan && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={18} /> {pesan}
        </div>
      )}

      {/* DAFTAR BLC BARU */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              BLC Baru
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                {daftar.length}
              </span>
            </h3>
            <p className="text-sm text-slate-400">Daftar BLC yang belum ada di website</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={cari}
              onChange={(e) => {
                setCari(e.target.value);
                setJumlah(JUMLAH_AWAL);
              }}
              placeholder="Cari nama BLC..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {memuat ? (
          <p className="py-12 text-center text-sm text-slate-400">Memuat data...</p>
        ) : tampil.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
            <CheckCircle2 size={36} />
            <p className="text-sm">
              {cari ? "BLC tidak ditemukan." : "Semua BLC sudah ditambahkan."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tampil.map((b, i) => (
              <li
                key={b.id}
                className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-slate-50"
              >
                <span className="w-6 text-sm text-slate-400">{i + 1}</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                  {b.nama.replace("BLC ", "").charAt(0)}
                </span>
                <p className="flex-1 truncate font-medium text-slate-700">{b.nama}</p>
                <button
                  onClick={() => handleTambahkan(b)}
                  disabled={proses === b.id}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-60"
                >
                  <Plus size={15} />
                  {proses === b.id ? "Memproses..." : "Tambahkan"}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* TAMPILKAN LEBIH BANYAK */}
        {hasil.length > jumlah && (
          <div className="border-t border-slate-100 p-4 text-center">
            <button
              onClick={() => setJumlah((j) => j + JUMLAH_AWAL)}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
            >
              Tampilkan lebih banyak ({hasil.length - jumlah})
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}