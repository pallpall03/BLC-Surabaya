
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  HelpCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  ambilFaq,
  hapusFaq,
  simpanFaq,
  type Faq,
} from "@/app/administrator/faq/data";

export default function HalamanFaq() {
  const [daftar, setDaftar] = useState<Faq[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [cari, setCari] = useState("");

  // Modal tambah dan ubah FAQ
  const [modal, setModal] = useState<{ id?: number } | null>(null);

  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [aktif, setAktif] = useState(true);
  const [galat, setGalat] = useState("");

  // Mengambil data FAQ
  useEffect(() => {
    ambilFaq()
      .then((data) => setDaftar(data))
      .finally(() => setMemuat(false));
  }, []);

  // Mengurutkan FAQ berdasarkan nomor urutan
  const terurut = useMemo(
    () => [...daftar].sort((a, b) => a.urutan - b.urutan),
    [daftar]
  );

  // Pencarian FAQ
  const tampil = terurut.filter((f) =>
    `${f.pertanyaan} ${f.jawaban}`
      .toLowerCase()
      .includes(cari.toLowerCase())
  );

  // Ringkasan jumlah FAQ
  const jumlahAktif = daftar.filter((f) => f.aktif).length;
  const jumlahNonaktif = daftar.filter((f) => !f.aktif).length;

  // Membuka modal tambah
  function bukaTambah() {
    setPertanyaan("");
    setJawaban("");
    setAktif(true);
    setGalat("");
    setModal({});
  }

  // Membuka modal ubah
  function bukaUbah(f: Faq) {
    setPertanyaan(f.pertanyaan);
    setJawaban(f.jawaban);
    setAktif(f.aktif);
    setGalat("");
    setModal({ id: f.id });
  }

  // Menyimpan FAQ
  async function handleSimpan() {
    const id = modal?.id;

    if (!pertanyaan.trim() || !jawaban.trim()) {
      setGalat("Pertanyaan dan jawaban wajib diisi.");
      return;
    }

    const lama = daftar.find((f) => f.id === id);

    const urutan = lama
      ? lama.urutan
      : Math.max(0, ...daftar.map((f) => f.urutan)) + 1;

    const hasil = await simpanFaq(
      {
        pertanyaan: pertanyaan.trim(),
        jawaban: jawaban.trim(),
        aktif,
        urutan,
      },
      id
    );

    setDaftar((d) =>
      id
        ? d.map((f) => (f.id === id ? hasil : f))
        : [...d, hasil]
    );

    setModal(null);
  }

  // Menghapus FAQ
  async function handleHapus(f: Faq) {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus FAQ "${f.pertanyaan}"?`
    );

    if (!yakin) return;

    await hapusFaq(f.id);

    setDaftar((d) => d.filter((x) => x.id !== f.id));
  }

  // Mengaktifkan atau menonaktifkan FAQ
  async function handleToggle(f: Faq) {
    const baru = {
      ...f,
      aktif: !f.aktif,
    };

    await simpanFaq(
      {
        pertanyaan: baru.pertanyaan,
        jawaban: baru.jawaban,
        aktif: baru.aktif,
        urutan: baru.urutan,
      },
      f.id
    );

    setDaftar((d) =>
      d.map((x) => (x.id === f.id ? baru : x))
    );
  }

  // Mengubah urutan FAQ
  async function geser(id: number, arah: -1 | 1) {
    const urut = [...terurut];

    const i = urut.findIndex((f) => f.id === id);
    const j = i + arah;

    if (j < 0 || j >= urut.length) return;

    // Tukar posisi FAQ
    [urut[i], urut[j]] = [urut[j], urut[i]];

    // Perbarui nomor urutan
    const baru = urut.map((f, k) => ({
      ...f,
      urutan: k + 1,
    }));

    // Simpan urutan menggunakan fungsi simpanFaq yang sudah tersedia
    await Promise.all(
      baru.map((f) =>
        simpanFaq(
          {
            pertanyaan: f.pertanyaan,
            jawaban: f.jawaban,
            aktif: f.aktif,
            urutan: f.urutan,
          },
          f.id
        )
      )
    );

    setDaftar(baru);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Pengelolaan FAQ
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola pertanyaan dan jawaban yang sering ditanyakan
            pengunjung website BLC Surabaya.
          </p>
        </div>

        <button
          onClick={bukaTambah}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
        >
          <Plus size={17} />
          Tambah FAQ
        </button>
      </div>

      {/* RINGKASAN */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total FAQ
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {daftar.length}
              </h2>
            </div>

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <HelpCircle size={24} />
            </div>
          </div>
        </div>

        <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                FAQ Aktif
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {jumlahAktif}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                FAQ Nonaktif
              </p>

              <h2 className="mt-2 text-2xl font-bold text-orange-600">
                {jumlahNonaktif}
              </h2>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <EyeOff size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* DAFTAR FAQ */}
      <section className="card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* BAR ATAS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">

          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              Daftar FAQ

              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
                {jumlahAktif} dari {daftar.length} aktif
              </span>
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Pertanyaan yang sering ditanyakan pengunjung website
            </p>
          </div>

          <div className="relative w-full sm:w-64">
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

        </div>

        {/* ISI DAFTAR */}
        {memuat ? (
          <p className="py-12 text-center text-sm text-slate-400">
            Memuat data...
          </p>
        ) : tampil.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
            <Info size={36} />

            <p className="text-sm">
              {cari
                ? "FAQ tidak ditemukan."
                : "Belum ada FAQ."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">

            {tampil.map((f, i) => (
              <li
                key={f.id}
                className={`flex flex-col gap-3 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-start sm:gap-4 ${
                  f.aktif ? "" : "opacity-60"
                }`}
              >

                {/* TOMBOL URUTAN */}
                <div className="flex shrink-0 items-center gap-1 sm:flex-col">
                  <button
                    onClick={() => geser(f.id, -1)}
                    disabled={!!cari || i === 0}
                    aria-label="Naikkan urutan"
                    title="Naikkan urutan"
                    className="rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ChevronUp size={17} />
                  </button>

                  <button
                    onClick={() => geser(f.id, 1)}
                    disabled={!!cari || i === tampil.length - 1}
                    aria-label="Turunkan urutan"
                    title="Turunkan urutan"
                    className="rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ChevronDown size={17} />
                  </button>
                </div>

                {/* NOMOR */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                  {f.urutan}
                </span>

                {/* PERTANYAAN DAN JAWABAN */}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">
                    {f.pertanyaan}
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-500">
                    {f.jawaban}
                  </p>
                </div>

                {/* AKSI */}
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end">

                  <button
                    type="button"
                    role="switch"
                    aria-checked={f.aktif}
                    onClick={() => handleToggle(f)}
                    title={
                      f.aktif
                        ? "Tampil di website"
                        : "Disembunyikan"
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      f.aktif
                        ? "bg-violet-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        f.aktif
                          ? "left-[22px]"
                          : "left-0.5"
                      }`}
                    />
                  </button>

                  <div className="flex gap-2">

                    <button
                      onClick={() => bukaUbah(f)}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-100"
                    >
                      <Pencil size={14} />
                      Ubah
                    </button>

                    <button
                      onClick={() => handleHapus(f)}
                      className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      Hapus
                    </button>

                  </div>
                </div>

              </li>
            ))}

          </ul>
        )}

        {/* KETERANGAN PENCARIAN */}
        {cari && (
          <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
            Tombol urutan dimatikan saat pencarian aktif.
            Kosongkan pencarian untuk mengatur urutan.
          </p>
        )}

      </section>

      {/* MODAL TAMBAH / UBAH */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER MODAL */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

              <div>
                <h4 className="font-semibold text-slate-800">
                  {modal.id ? "Ubah FAQ" : "Tambah FAQ"}
                </h4>

                <p className="mt-1 text-xs text-slate-400">
                  Lengkapi informasi pertanyaan dan jawaban.
                </p>
              </div>

              <button
                onClick={() => setModal(null)}
                aria-label="Tutup"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}
            <div className="space-y-5 p-6">

              {/* PERTANYAAN */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pertanyaan
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  value={pertanyaan}
                  onChange={(e) => setPertanyaan(e.target.value)}
                  placeholder="Masukkan pertanyaan FAQ"
                  maxLength={200}
                  className={inputClass}
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {pertanyaan.length}/200
                </p>
              </div>

              {/* JAWABAN */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Jawaban
                  <span className="text-red-500"> *</span>
                </label>

                <textarea
                  value={jawaban}
                  onChange={(e) => setJawaban(e.target.value)}
                  placeholder="Masukkan jawaban FAQ"
                  rows={6}
                  maxLength={2000}
                  className={inputClass}
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {jawaban.length}/2000
                </p>
              </div>

              {/* STATUS */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Tampilkan di website
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    FAQ yang dimatikan tetap tersimpan,
                    tetapi tidak terlihat oleh pengunjung.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={aktif}
                  onClick={() => setAktif((a) => !a)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    aktif
                      ? "bg-violet-600"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      aktif
                        ? "left-[22px]"
                        : "left-0.5"
                    }`}
                  />
                </button>

              </div>

              {/* PESAN GALAT */}
              {galat && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {galat}
                </p>
              )}

            </div>

            {/* FOOTER MODAL */}
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
