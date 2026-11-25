"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ClipboardList, MapPin, Pencil, Plus, Search, SearchX, Trash2, X } from "lucide-react";
import HeaderHalaman from "./components/headerhalaman";
import FotoKotak from "./components/fotokotak";
import type { Aktivitas } from "./components/formaktivitas";

// ===== DATA HARDCODE SEMENTARA =====
// TODO (backend): ganti DATA_AWAL dengan data dari API, mis. GET /aktivitas
// Bentuk data yang dipakai halaman ini (satu aktivitas):
//   { id: number, tanggal: "YYYY-MM-DD", sesi: number[], lokasi: string,
//     keterangan: string, foto: { id: number, url: string }[] }
// Catatan: "url" foto harus alamat lengkap yang bisa dibuka di browser.
const DATA_AWAL: Aktivitas[] = [
  { id: 1, tanggal: "2026-07-23", sesi: [4, 5], lokasi: "Kelurahan Menur Pumpungan", keterangan: "koordinasi dengan kelurahan menur pumpungan terkait survey cekin warga", foto: [{ id: 11, url: "" }] },
  { id: 2, tanggal: "2026-07-22", sesi: [1, 2], lokasi: "Jl. Manyar Kertoadi", keterangan: "Laporan kegiatan patroli dan monitoring pada shift 1. Hasil pemantauan: ada beberapa PKL berjualan di bahu jalan, dan ditemukan beberapa kendaraan parkir di bahu jalan sehingga mengganggu arus lalu lintas. Demikian laporan ini disampaikan.", foto: [{ id: 21, url: "" }, { id: 22, url: "" }] },
];

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const fmt = (s: string) => { const [y, m, d] = s.split("-"); return `${Number(d)} ${BULAN[Number(m) - 1]} ${y}`; };
const kartu = "rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40";
const inp = "rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

export default function AktivitasPage() {
  const [data, setData] = useState<Aktivitas[]>(DATA_AWAL);
  const [mulai, setMulai] = useState("");
  const [sampai, setSampai] = useState("");
  const [cari, setCari] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [terbuka, setTerbuka] = useState<number[]>([]);
  const [lihat, setLihat] = useState<{ id: number; i: number } | null>(null);
  const [pesan, setPesan] = useState("");

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return data
      .filter((d) => (!mulai || d.tanggal >= mulai) && (!sampai || d.tanggal <= sampai) &&
        (!q || d.keterangan.toLowerCase().includes(q) || d.lokasi.toLowerCase().includes(q)))
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [data, mulai, sampai, cari]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / perPage));
  const halaman = Math.min(page, totalHalaman);
  const awal = (halaman - 1) * perPage;
  const baris = hasil.slice(awal, awal + perPage);
  const adaFilter = mulai !== "" || sampai !== "" || cari !== "";
  const reset = () => { setMulai(""); setSampai(""); setCari(""); setPage(1); };
  const ubah = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setPage(1); };

  const toast = (t: string) => { setPesan(t); setTimeout(() => setPesan(""), 3000); };
  const hapus = (a: Aktivitas) => {
    if (!window.confirm(`Hapus aktivitas tanggal ${fmt(a.tanggal)}?`)) return;
    // TODO (backend): DELETE /aktivitas/{id}, lalu perbarui daftar
    setData((d) => d.filter((x) => x.id !== a.id));
    toast("Aktivitas dihapus.");
  };

  // Penampil foto besar
  const aktLihat = lihat ? data.find((d) => d.id === lihat.id) : undefined;
  useEffect(() => {
    if (!lihat) return;
    const total = data.find((d) => d.id === lihat.id)?.foto.length ?? 1;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLihat(null);
      if (e.key === "ArrowRight") setLihat((l) => l && { ...l, i: (l.i + 1) % total });
      if (e.key === "ArrowLeft") setLihat((l) => l && { ...l, i: (l.i - 1 + total) % total });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lihat, data]);

  const geser = (n: number) => {
    const total = aktLihat?.foto.length ?? 1;
    setLihat((l) => l && { ...l, i: (l.i + n + total) % total });
  };

  return (
    <main className="instruktur-main">
      <div className="mx-auto w-full max-w-6xl">
        <HeaderHalaman icon={ClipboardList} judul="Aktivitas instruktur" deskripsi="Catat kegiatan harianmu dan lihat laporan aktivitas."
          aksi={
            <Link href="/instruktur/aktivitas/aktivitasbaru"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-700">
              <Plus size={18} /> Tambah aktivitas
            </Link>
          } />

        <section className={`instruktur-card ${kartu}`}>
          {/* Filter */}
          <div className="flex flex-wrap items-end gap-3 border-b border-orange-100 p-4">
            <label className="text-xs font-medium text-slate-600">Dari tanggal
              <input type="date" value={mulai} onChange={(e) => ubah(setMulai)(e.target.value)} className={`${inp} mt-1 block`} />
            </label>
            <label className="text-xs font-medium text-slate-600">Sampai tanggal
              <input type="date" value={sampai} onChange={(e) => ubah(setSampai)(e.target.value)} className={`${inp} mt-1 block`} />
            </label>
            <div className="relative min-w-[220px] flex-1">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
              <input type="search" value={cari} onChange={(e) => ubah(setCari)(e.target.value)} placeholder="Cari keterangan atau lokasi" aria-label="Cari aktivitas"
                className={`${inp} w-full py-2.5 pl-10`} />
            </div>
            {adaFilter && (
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50">
                <X size={16} /> Reset
              </button>
            )}
          </div>

          {/* Tabel */}
          {baris.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={32} /></span>
              <p className="font-medium text-slate-800">Belum ada aktivitas yang cocok</p>
              <p className="text-sm text-slate-500">Ubah filter tanggal atau kata kunci, atau tambah aktivitas baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-orange-50 text-orange-900">
                  <tr>
                    <th className="w-36 px-4 py-3 font-medium">Tanggal</th>
                    <th className="w-32 px-4 py-3 font-medium">Sesi</th>
                    <th className="px-4 py-3 font-medium">Keterangan</th>
                    <th className="w-44 px-4 py-3 font-medium">Foto</th>
                    <th className="w-28 px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {baris.map((a) => {
                    const panjang = a.keterangan.length > 110;
                    const buka = terbuka.includes(a.id);
                    return (
                      <tr key={a.id} className="align-top transition hover:bg-orange-50/60">
                        <td className="px-4 py-4 font-medium text-slate-900">{fmt(a.tanggal)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {a.sesi.map((s) => <span key={s} className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">Sesi {s}</span>)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className={`text-slate-800 ${panjang && !buka ? "line-clamp-2" : ""}`}>{a.keterangan}</p>
                          {panjang && (
                            <button type="button" onClick={() => setTerbuka((t) => (buka ? t.filter((x) => x !== a.id) : [...t, a.id]))}
                              className="mt-1 text-xs font-medium text-orange-700 hover:underline">{buka ? "Ringkas" : "Selengkapnya"}</button>
                          )}
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} className="text-orange-400" />{a.lokasi}</p>
                        </td>
                        <td className="px-4 py-4">
                          {a.foto.length === 0 ? (
                            <span className="text-xs text-slate-400">Tidak ada foto</span>
                          ) : (
                            <button type="button" onClick={() => setLihat({ id: a.id, i: 0 })} aria-label="Lihat foto" className="flex items-center transition hover:scale-105">
                              {a.foto.slice(0, 3).map((f, i) => (
                                <FotoKotak key={f.id} url={f.url} indeks={a.id + i} className={`h-16 w-20 shrink-0 rounded-xl border-2 border-white object-cover shadow-md ${i ? "-ml-5" : ""}`} />
                              ))}
                              {a.foto.length > 3 && (
                                <span className="-ml-5 flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border-2 border-white bg-slate-800 text-sm font-semibold text-white shadow-md">+{a.foto.length - 3}</span>
                              )}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <Link href={`/instruktur/aktivitas/${a.id}/ubah`} title="Ubah" aria-label="Ubah aktivitas"
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"><Pencil size={16} /></Link>
                            <button type="button" onClick={() => hapus(a)} title="Hapus" aria-label="Hapus aktivitas"
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginasi */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 px-4 py-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span>Tampilkan</span>
              <select value={perPage} onChange={(e) => ubah(setPerPage)(Number(e.target.value))} aria-label="Jumlah baris per halaman" className="rounded-lg border border-orange-200 bg-white px-2 py-1 outline-none focus:ring-4 focus:ring-orange-200/60">
                {[5, 10, 25].map((n) => <option key={n}>{n}</option>)}
              </select>
              <span>baris, {hasil.length === 0 ? 0 : awal + 1}–{Math.min(awal + perPage, hasil.length)} dari {hasil.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage(halaman - 1)} disabled={halaman <= 1} aria-label="Halaman sebelumnya" className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronLeft size={18} /></button>
              <span className="tabular-nums">{halaman} / {totalHalaman}</span>
              <button type="button" onClick={() => setPage(halaman + 1)} disabled={halaman >= totalHalaman} aria-label="Halaman berikutnya" className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronRight size={18} /></button>
            </div>
          </div>
        </section>
      </div>

      {/* Penampil foto besar */}
      {lihat && aktLihat && aktLihat.foto[lihat.i] && (
        <div role="dialog" aria-modal="true" aria-label="Foto kegiatan" onClick={() => setLihat(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl">
            <FotoKotak url={aktLihat.foto[lihat.i].url} indeks={aktLihat.id + lihat.i} className="h-[60vh] w-full rounded-2xl" />
            <button type="button" onClick={() => setLihat(null)} aria-label="Tutup" className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-slate-700 shadow hover:bg-white"><X size={18} /></button>
            {aktLihat.foto.length > 1 && (
              <>
                <button type="button" onClick={() => geser(-1)} aria-label="Foto sebelumnya" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow hover:bg-white"><ChevronLeft size={20} /></button>
                <button type="button" onClick={() => geser(1)} aria-label="Foto berikutnya" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow hover:bg-white"><ChevronRight size={20} /></button>
              </>
            )}
            <p className="mt-3 text-center text-sm text-white">{fmt(aktLihat.tanggal)} · foto {lihat.i + 1} dari {aktLihat.foto.length}</p>
          </div>
        </div>
      )}

      {pesan && <div role="status" className="fixed bottom-6 right-6 z-[60] rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{pesan}</div>}
    </main>
  );
}
