"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Info, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import {
  ambilFaq,
  hapusFaq,
  simpanFaq,
  simpanUrutanFaq,
  type Faq,
} from "@/lib/faq";

export default function HalamanFaq() {
  const [daftar, setDaftar] = useState<Faq[]>([]);
  const [memuat, setMemuat] = useState<boolean>(true);
  const [cari, setCari] = useState("");

  // modal tambah/ubah: null = tertutup, {} = tambah, {id} = ubah
  const [modal, setModal] = useState<{ id?: number } | null>(null);
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [aktif, setAktif] = useState<boolean>(true);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    ambilFaq()
      .then(setDaftar)
      .finally(() => setMemuat(false));
  }, []);

  // selalu tampil terurut berdasarkan urutan
  const terurut = useMemo(
    () => [...daftar].sort((a, b) => a.urutan - b.urutan),
    [daftar]
  );
  const tampil = terurut.filter((f) =>
    `${f.pertanyaan} ${f.jawaban}`.toLowerCase().includes(cari.toLowerCase())
  );
  const jumlahAktif = daftar.filter((f) => f.aktif).length;

  function bukaTambah() {
    setPertanyaan("");
    setJawaban("");
    setAktif(true);
    setGalat("");
    setModal({});
  }

  function bukaUbah(f: Faq) {
    setPertanyaan(f.pertanyaan);
    setJawaban(f.jawaban);
    setAktif(f.aktif);
    setGalat("");
    setModal({ id: f.id });
  }

  async function handleSimpan() {
    const id = modal?.id;
    if (!pertanyaan.trim() || !jawaban.trim()) {
      return setGalat("Pertanyaan dan jawaban wajib diisi.");
    }

    const lama = daftar.find((f) => f.id === id);
    const urutan = lama ? lama.urutan : Math.max(0, ...daftar.map((f) => f.urutan)) + 1;

    const hasil = await simpanFaq(
      { pertanyaan: pertanyaan.trim(), jawaban: jawaban.trim(), aktif, urutan },
      id
    );
    setDaftar((d) => (id ? d.map((f) => (f.id === id ? hasil : f)) : [...d, hasil]));
    setModal(null);
  }

  async function handleHapus(f: Faq) {
    if (!window.confirm(`Hapus FAQ "${f.pertanyaan}"?`)) return;
    await hapusFaq(f.id);
    setDaftar((d) => d.filter((x) => x.id !== f.id));
  }

  async function handleToggle(f: Faq) {
    const baru = { ...f, aktif: !f.aktif };
    await simpanFaq(baru, f.id);
    setDaftar((d) => d.map((x) => (x.id === f.id ? baru : x)));
  }

  // tukar posisi dengan tetangga atas/bawah, lalu nomori ulang
  async function geser(id: number, arah: -1 | 1) {
    const urut = [...terurut];
    const i = urut.findIndex((f) => f.id === id);
    const j = i + arah;
    if (j < 0 || j >= urut.length) return;
    [urut[i], urut[j]] = [urut[j], urut[i]];

    const baru = urut.map((f, k) => ({ ...f, urutan: k + 1 }));
    await simpanUrutanFaq(baru.map((f) => f.id));
    setDaftar(baru);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  return (
    <div>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* BAR ATAS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              Daftar FAQ
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
                {jumlahAktif} dari {daftar.length} aktif
              </span>
            </h3>
            <p className="text-sm text-slate-400">
              Pertanyaan yang sering ditanyakan pengunjung website
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="relative flex-1 sm:w-64 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari pertanyaan..."
                className={`${inputClass} bg-slate-50 pl-9`}
              />
            </div>
            <button
              onClick={bukaTambah}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
            >
              <Plus size={16} /> Tambah FAQ
            </button>
          </div>
        </div>

        {/* DAFTAR */}
        {memuat ? (
          <p className="py-12 text-center text-sm text-slate-400">Memuat data...</p>
        ) : tampil.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
            <Info size={36} />
            <p className="text-sm">{cari ? "FAQ tidak ditemukan." : "Belum ada FAQ."}</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tampil.map((f, i) => (
              <li
                key={f.id}
                className={`flex items-start gap-4 px-6 py-4 transition hover:bg-slate-50 ${
                  f.aktif ? "" : "opacity-60"
                }`}
              >
                {/* tombol urutan (dimatikan saat sedang mencari) */}
                <div className="flex flex-col">
                  <button
                    onClick={() => geser(f.id, -1)}
                    disabled={!!cari || i === 0}
                    aria-label="Naikkan"
                    className="rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => geser(f.id, 1)}
                    disabled={!!cari || i === tampil.length - 1}
                    aria-label="Turunkan"
                    className="rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                  {f.urutan}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{f.pertanyaan}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{f.jawaban}</p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={f.aktif}
                    onClick={() => handleToggle(f)}
                    title={f.aktif ? "Tampil di website" : "Disembunyikan"}
                    className={`relative h-6 w-11 rounded-full transition ${
                      f.aktif ? "bg-violet-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        f.aktif ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => bukaUbah(f)}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-100"
                    >
                      <Pencil size={14} /> Ubah
                    </button>
                    <button
                      onClick={() => handleHapus(f)}
                      className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cari && (
          <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
            Tombol urutan dimatikan saat pencarian aktif. Kosongkan pencarian untuk mengatur urutan.
          </p>
        )}
      </section>

      {/* MODAL TAMBAH / UBAH */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h4 className="font-semibold text-slate-800">
                {modal.id ? "Ubah FAQ" : "Tambah FAQ"}
              </h4>
              <button
                onClick={() => setModal(null)}
                aria-label="Tutup"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Pertanyaan
                </label>
                <input
                  value={pertanyaan}
                  onChange={(e) => setPertanyaan(e.target.value)}
                  maxLength={200}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Jawaban</label>
                <textarea
                  value={jawaban}
                  onChange={(e) => setJawaban(e.target.value)}
                  rows={6}
                  maxLength={2000}
                  className={inputClass}
                />
                <p className="mt-1 text-right text-xs text-slate-400">{jawaban.length}/2000</p>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Tampilkan di website</p>
                  <p className="text-xs text-slate-400">
                    FAQ yang dimatikan disimpan tapi tidak terlihat pengunjung.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={aktif}
                  onClick={() => setAktif((a) => !a)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    aktif ? "bg-violet-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      aktif ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {galat && <p className="text-sm text-red-600">{galat}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setModal(null)}
                className="rounded-xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}