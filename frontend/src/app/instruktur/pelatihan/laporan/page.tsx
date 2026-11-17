"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays, CheckSquare, ChevronLeft, ChevronRight, FileDown, FileText, Image as ImageIcon,
  Printer, Search, SearchX, Square,
} from "lucide-react";

type Tab = "hadir" | "foto";
type Baris = { id: number; nama: string; jk: "L" | "P"; alamat: string; kategori: string; sesi: number; materi: string; kehadiran: number };
type Foto = { id: number; judul: string; tanggal: string; warna: string };

// TODO: ganti dengan fetch ke API Laravel, mis. GET /api/laporan/hadir?mulai=&sampai=
const DATA_HADIR: Baris[] = [
  { id: 1, nama: "Achmad Haikal Aditiya Pratama", jk: "L", alamat: "Bogen 2/25", kategori: "SMA/SMK", sesi: 2, materi: "Aplikasi Perkantoran", kehadiran: 11 },
  { id: 2, nama: "Aditia Sastra Widjaya", jk: "L", alamat: "Setro 2/25", kategori: "SMA/SMK", sesi: 1, materi: "Aplikasi Perkantoran", kehadiran: 1 },
  { id: 3, nama: "Gita Herliana Safitri", jk: "P", alamat: "Tambak Segaran Wetan 1/48", kategori: "SMA/SMK", sesi: 1, materi: "Desain Grafis", kehadiran: 8 },
  { id: 4, nama: "Intan Novianty", jk: "P", alamat: "Komp Sidotopo Dipo 1/2-c", kategori: "SMA/SMK", sesi: 2, materi: "Desain Grafis", kehadiran: 10 },
];
// TODO: ganti dengan fetch ke API, mis. GET /api/laporan/foto?mulai=&sampai=  (isi `url` foto asli)
const DATA_FOTO: Foto[] = [
  { id: 1, judul: "Praktik Aplikasi Perkantoran", tanggal: "2026-11-10", warna: "from-orange-300 to-amber-200" },
  { id: 2, judul: "Pendampingan Desain Grafis", tanggal: "2026-11-12", warna: "from-sky-300 to-cyan-200" },
  { id: 3, judul: "Presentasi Hasil Latihan", tanggal: "2026-11-14", warna: "from-violet-300 to-pink-200" },
  { id: 4, judul: "Sesi Tanya Jawab", tanggal: "2026-11-16", warna: "from-emerald-300 to-lime-200" },
];

const hariIni = () => new Date().toLocaleDateString("en-CA");
const fmt = (t: string) => t.split("-").reverse().join("/");

export default function LaporanPage() {
  const [tab, setTab] = useState<Tab>("hadir");
  const [mulai, setMulai] = useState(hariIni());
  const [sampai, setSampai] = useState(hariIni());
  const [dicari, setDicari] = useState<{ tab: Tab; mulai: string; sampai: string } | null>(null);
  const [cari, setCari] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [dipilih, setDipilih] = useState<Set<number>>(new Set());

  const cariLaporan = () => {
    setDicari({ tab, mulai, sampai });
    setCari(""); setPage(1); setDipilih(new Set());
  };
  const ganti = (t: Tab) => { setTab(t); setDicari(null); };

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return DATA_HADIR.filter((d) => !q || d.nama.toLowerCase().includes(q) || d.materi.toLowerCase().includes(q) || d.alamat.toLowerCase().includes(q));
  }, [cari]);
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / perPage));
  const halaman = Math.min(page, totalHalaman);
  const mulaiIdx = (halaman - 1) * perPage;
  const baris = hasil.slice(mulaiIdx, mulaiIdx + perPage);

  const toggleFoto = (id: number) => setDipilih((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const semuaDipilih = dipilih.size === DATA_FOTO.length;
  const pilihSemua = () => setDipilih(semuaDipilih ? new Set() : new Set(DATA_FOTO.map((f) => f.id)));

  const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Banner */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25"><FileText size={28} /></span>
          <div>
            <h1 className="text-2xl font-semibold">Laporan pelatihan</h1>
            <p className="text-sm text-orange-50">Lihat rekap daftar hadir dan foto kegiatan per periode.</p>
          </div>
        </div>

        {/* Tab + filter */}
        <section className="mb-6 rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40 print:hidden">
          <div className="border-b border-orange-100 p-4">
            <div className="flex w-fit rounded-xl border border-orange-100 bg-orange-50/40 p-1" role="tablist">
              {([["hadir", FileText, "Daftar hadir"], ["foto", ImageIcon, "Foto pelatihan"]] as const).map(([k, Icon, label]) => (
                <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => ganti(k)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${tab === k ? "bg-white font-medium text-orange-700 shadow-sm" : "text-slate-500 hover:text-orange-700"}`}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarDays size={15} className="text-orange-500" /> Tanggal mulai</span>
              <input type="date" value={mulai} onChange={(e) => setMulai(e.target.value)} suppressHydrationWarning className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarDays size={15} className="text-orange-500" /> Tanggal sampai</span>
              <input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)} suppressHydrationWarning className={inputCls} />
            </label>
            <button type="button" onClick={cariLaporan}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">
              <Search size={18} /> Cari laporan
            </button>
          </div>
        </section>

        {/* Hasil: daftar hadir */}
        {dicari?.tab === "hadir" && (
          <section className="rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 p-4">
              <div>
                <h2 className="font-semibold text-slate-900">Laporan daftar hadir</h2>
                <p className="text-sm text-slate-500">{fmt(dicari.mulai)} – {fmt(dicari.sampai)}</p>
              </div>
              <button type="button" onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-300/40 transition hover:-translate-y-0.5 hover:bg-red-600 print:hidden">
                <FileDown size={16} /> Simpan ke PDF
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-4 print:hidden">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Tampilkan</span>
                <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} aria-label="Jumlah baris"
                  className="rounded-lg border border-orange-200 bg-white px-2 py-1 outline-none focus:ring-4 focus:ring-orange-200/60">
                  {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
                </select>
                <span>baris</span>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                <input type="search" value={cari} onChange={(e) => { setCari(e.target.value); setPage(1); }} placeholder="Cari nama, materi, alamat" aria-label="Cari laporan"
                  className="w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60" />
              </div>
            </div>

            {baris.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={32} /></span>
                <p className="font-medium text-slate-800">Data tidak ditemukan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="bg-orange-50 text-orange-900">
                    <tr>
                      {["No", "Nama", "L/P", "Alamat", "Kategori", "Sesi", "Materi", "Kehadiran"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {baris.map((d, i) => (
                      <tr key={d.id} className="transition hover:bg-orange-50/60">
                        <td className="px-4 py-3 tabular-nums text-slate-500">{mulaiIdx + i + 1}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{d.nama}</td>
                        <td className="px-4 py-3 text-slate-600">{d.jk}</td>
                        <td className="px-4 py-3 text-slate-600">{d.alamat}</td>
                        <td className="px-4 py-3"><span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">{d.kategori}</span></td>
                        <td className="px-4 py-3 tabular-nums text-slate-600">{d.sesi}</td>
                        <td className="px-4 py-3 text-slate-700">{d.materi}</td>
                        <td className="px-4 py-3"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium tabular-nums text-emerald-700">{d.kehadiran}x</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 px-4 py-3 text-sm text-slate-600 print:hidden">
              <span>{hasil.length === 0 ? 0 : mulaiIdx + 1}–{Math.min(mulaiIdx + perPage, hasil.length)} dari {hasil.length}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPage(halaman - 1)} disabled={halaman <= 1} aria-label="Sebelumnya"
                  className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronLeft size={18} /></button>
                <span className="tabular-nums">{halaman} / {totalHalaman}</span>
                <button type="button" onClick={() => setPage(halaman + 1)} disabled={halaman >= totalHalaman} aria-label="Berikutnya"
                  className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronRight size={18} /></button>
              </div>
            </div>
          </section>
        )}

        {/* Hasil: foto */}
        {dicari?.tab === "foto" && (
          <section className="rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 p-4 print:hidden">
              <div>
                <h2 className="font-semibold text-slate-900">Laporan foto pelatihan</h2>
                <p className="text-sm text-slate-500">{fmt(dicari.mulai)} – {fmt(dicari.sampai)} · {dipilih.size} dipilih</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={pilihSemua}
                  className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-50">
                  {semuaDipilih ? <CheckSquare size={16} className="text-orange-500" /> : <Square size={16} />} Pilih semua
                </button>
                <button type="button" onClick={() => window.print()} disabled={dipilih.size === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-300/40 transition hover:-translate-y-0.5 hover:bg-red-600 disabled:opacity-40 disabled:hover:translate-y-0">
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {DATA_FOTO.map((f) => {
                const aktif = dipilih.has(f.id);
                return (
                  <article key={f.id}
                    className={`overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-200/50 ${aktif ? "border-orange-400 ring-4 ring-orange-200/60" : "border-orange-100"} ${dipilih.size > 0 && !aktif ? "print:hidden" : ""}`}>
                    <button type="button" onClick={() => toggleFoto(f.id)} aria-pressed={aktif} aria-label={`Pilih ${f.judul}`} className="relative block w-full text-left">
                      {/* TODO: ganti blok gradient ini dengan <img src={f.url} className="h-48 w-full object-cover" /> */}
                      <div className={`flex h-48 w-full items-center justify-center bg-gradient-to-br ${f.warna}`}><ImageIcon size={40} className="text-white/80" /></div>
                      <span className="absolute left-3 top-3 rounded-lg bg-white/90 p-1 text-orange-500 shadow print:hidden">
                        {aktif ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-400" />}
                      </span>
                    </button>
                    <div className="p-4">
                      <h3 className="font-medium text-slate-900">{f.judul}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={13} className="text-orange-400" />{fmt(f.tanggal)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {!dicari && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-white/60 px-4 py-14 text-center print:hidden">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><Search size={30} /></span>
            <p className="text-sm text-slate-500">Pilih periode lalu klik "Cari laporan".</p>
          </div>
        )}
      </div>
    </main>
  );
}