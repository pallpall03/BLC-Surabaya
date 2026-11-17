"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type Peserta = {
  id: number;
  nik: string;
  nama: string;
  blc: string;
  jk: "L" | "P";
  tervalidasi: boolean;
};

// TODO: ganti dengan fetch ke API Laravel, mis. GET /api/peserta
const DATA_AWAL: Peserta[] = [
  { id: 1, nik: "0", nama: "Ahmat Ilham Khoirut Difin", blc: "Gunung Anyar", jk: "L", tervalidasi: true },
  { id: 2, nik: "00", nama: "Imelda", blc: "Gunung Anyar", jk: "P", tervalidasi: true },
  { id: 3, nik: "000", nama: "Aurelia Azzahra", blc: "Gunung Anyar", jk: "P", tervalidasi: true },
  { id: 4, nik: "0000", nama: "Javier Arsy Maulana", blc: "Bendul Merisi", jk: "L", tervalidasi: false },
  { id: 5, nik: "00000", nama: "Sridah Winarsih", blc: "Bendul Merisi", jk: "P", tervalidasi: false },
  { id: 6, nik: "000000", nama: "Roy Dwi Kusuma", blc: "Bendul Merisi", jk: "L", tervalidasi: true },
];

export default function DaftarPesertaPage() {
  const [data, setData] = useState<Peserta[]>(DATA_AWAL);
  const [cari, setCari] = useState("");
  const [area, setArea] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [pesan, setPesan] = useState("");

  const daftarArea = useMemo(() => Array.from(new Set(data.map((d) => d.blc))).sort(), [data]);

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return data.filter(
      (d) =>
        (!q || d.nama.toLowerCase().includes(q) || d.nik.includes(q)) && (!area || d.blc === area)
    );
  }, [data, cari, area]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / perPage));
  const halaman = Math.min(page, totalHalaman);
  const mulai = (halaman - 1) * perPage;
  const baris = hasil.slice(mulai, mulai + perPage);
  const adaFilter = cari !== "" || area !== "";

  const tampilkanPesan = (teks: string) => {
    setPesan(teks);
    setTimeout(() => setPesan(""), 3000);
  };

  const toggleValidasi = (id: number) =>
    setData((d) => d.map((p) => (p.id === id ? { ...p, tervalidasi: !p.tervalidasi } : p)));

  const hapus = (p: Peserta) => {
    if (!window.confirm(`Hapus peserta ${p.nama}?`)) return;
    setData((d) => d.filter((x) => x.id !== p.id));
    tampilkanPesan("Peserta dihapus.");
  };

  const reset = () => {
    setCari("");
    setArea("");
    setPage(1);
  };

  const inputCls =
    "rounded-lg border border-slate-300 bg-white py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Daftar peserta pelatihan</h1>
            <p className="mt-1 text-sm text-slate-500">{data.length} peserta terdaftar</p>
          </div>
          <Link
            href="/instruktur/tambah_peserta"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            <Plus size={18} />
            Tambah peserta
          </Link>
        </div>

        <section className="rounded-xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
          {/* Pencarian & filter */}
          <div className="flex flex-wrap items-center gap-3 border-b border-orange-100 p-4">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="search"
                value={cari}
                onChange={(e) => {
                  setCari(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama atau NIK peserta"
                aria-label="Cari nama atau NIK peserta"
                className={`${inputCls} w-full pl-10 pr-3`}
              />
            </div>
            <select
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setPage(1);
              }}
              aria-label="Filter area BLC"
              className={`${inputCls} min-w-[180px] px-3`}
            >
              <option value="">Semua area BLC</option>
              {daftarArea.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            {adaFilter && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <X size={16} />
                Reset
              </button>
            )}
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-orange-50 text-orange-900">
                <tr>
                  <th className="px-4 py-3 font-medium">NIK</th>
                  <th className="px-4 py-3 font-medium">Nama lengkap</th>
                  <th className="px-4 py-3 font-medium">BLC</th>
                  <th className="px-4 py-3 font-medium">L/P</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {baris.map((p) => (
                  <tr key={p.id} className="hover:bg-orange-50/60">
                    <td className="px-4 py-3 tabular-nums text-slate-600">{p.nik}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{p.nama}</td>
                    <td className="px-4 py-3 text-slate-700">{p.blc}</td>
                    <td className="px-4 py-3 text-slate-700">{p.jk}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          p.tervalidasi ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${p.tervalidasi ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {p.tervalidasi ? "Tervalidasi" : "Non validasi"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => toggleValidasi(p.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-50"
                        >
                          {p.tervalidasi ? "Batalkan validasi" : "Validasi"}
                        </button>
                        <button
                          type="button"
                          aria-label={`Ubah ${p.nama}`}
                          title="Ubah"
                          // TODO: buka form dalam mode ubah
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => hapus(p)}
                          aria-label={`Hapus ${p.nama}`}
                          title="Hapus"
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {baris.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      Tidak ada peserta yang cocok. Ubah kata kunci atau reset filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginasi */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 px-4 py-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span>Tampilkan</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                aria-label="Jumlah baris per halaman"
                className={`${inputCls} px-2 py-1`}
              >
                {[10, 25, 50].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
              <span>
                baris, {hasil.length === 0 ? 0 : mulai + 1}–{Math.min(mulai + perPage, hasil.length)} dari {hasil.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(halaman - 1)}
                disabled={halaman <= 1}
                aria-label="Halaman sebelumnya"
                className="rounded-lg border border-slate-300 p-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="tabular-nums">
                {halaman} / {totalHalaman}
              </span>
              <button
                type="button"
                onClick={() => setPage(halaman + 1)}
                disabled={halaman >= totalHalaman}
                aria-label="Halaman berikutnya"
                className="rounded-lg border border-slate-300 p-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {pesan && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[60] rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
        >
          {pesan}
        </div>
      )}
    </main>
  );
}