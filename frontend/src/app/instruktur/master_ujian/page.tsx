"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, CalendarClock, Clock, FileQuestion, Pencil, Plus, Search, SearchX, Shuffle, Trash2, UserPlus } from "lucide-react";
import HeaderHalaman from "./components/headerhalaman";
import Paginasi from "./components/paginasi";
import TokenUjian, { buatToken } from "./components/tokenujian";
import { useCrudNotification } from "@/components/CrudNotification";

type Ujian = {
  id: number; jenis: "Pre Test" | "Post Test"; materi: string; pertemuan: number; jumlahSoal: number;
  mulai: string; sampai: string; waktu: number; acak: boolean; token: string; peserta: number;
};
type Filter = "Semua" | "Pre Test" | "Post Test";

const PER_HALAMAN = 8;
const MATERI_APK = "APLIKASI PERKANTORAN";

// TODO: ganti dengan GET /api/ujian (dikerjakan backend)
const UJIAN_AWAL: Ujian[] = [
  { id: 1, jenis: "Pre Test", materi: MATERI_APK, pertemuan: 1, jumlahSoal: 5, mulai: "2026-06-03T09:24", sampai: "2026-06-04T11:24", waktu: 60, acak: true, token: "YQVWE", peserta: 3 },
  { id: 2, jenis: "Post Test", materi: MATERI_APK, pertemuan: 1, jumlahSoal: 5, mulai: "2026-06-09T11:35", sampai: "2026-06-10T11:35", waktu: 60, acak: true, token: "JPQFG", peserta: 0 },
  { id: 3, jenis: "Post Test", materi: MATERI_APK, pertemuan: 2, jumlahSoal: 5, mulai: "2026-06-09T11:39", sampai: "2026-06-10T11:39", waktu: 60, acak: true, token: "JDIGK", peserta: 0 },
  { id: 4, jenis: "Post Test", materi: MATERI_APK, pertemuan: 2, jumlahSoal: 5, mulai: "2026-06-25T08:29", sampai: "2026-06-26T08:29", waktu: 60, acak: false, token: "QYCZC", peserta: 0 },
  { id: 5, jenis: "Post Test", materi: MATERI_APK, pertemuan: 3, jumlahSoal: 5, mulai: "2026-07-03T08:35", sampai: "2026-07-04T08:35", waktu: 60, acak: true, token: "BLSMQ", peserta: 0 },
  { id: 6, jenis: "Pre Test", materi: MATERI_APK, pertemuan: 4, jumlahSoal: 5, mulai: "2026-07-24T09:57", sampai: "2026-07-25T09:57", waktu: 60, acak: true, token: "OJQJD", peserta: 0 },
  { id: 7, jenis: "Post Test", materi: MATERI_APK, pertemuan: 5, jumlahSoal: 5, mulai: "2026-07-24T10:01", sampai: "2026-07-25T10:01", waktu: 60, acak: true, token: "GBHCK", peserta: 0 },
];

const fmtDT = (s: string) => { const [d, t] = s.split("T"); return `${d.split("-").reverse().join("/")} ${t}`; };
const namaDari = (x: Ujian) => `${x.jenis.toUpperCase()} - ${x.materi} PERTEMUAN ${x.pertemuan}`;

export default function MasterUjianPage() {
  const { showNotification } = useCrudNotification();
  const [ujian, setUjian] = useState<Ujian[]>(UJIAN_AWAL);
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState<Filter>("Semua");
  const [page, setPage] = useState(1);

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return ujian.filter((x) => (filter === "Semua" || x.jenis === filter) && (!q || namaDari(x).toLowerCase().includes(q) || x.token.toLowerCase().includes(q)));
  }, [ujian, cari, filter]);

  const halaman = Math.min(page, Math.max(1, Math.ceil(hasil.length / PER_HALAMAN)));
  const baris = hasil.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  const hapus = (x: Ujian) => {
    if (!window.confirm(`Hapus ujian "${namaDari(x)}"? Peserta yang terdaftar juga ikut terhapus.`)) return;
    // TODO: DELETE /api/ujian/{id}
    setUjian((u) => u.filter((y) => y.id !== x.id));
    showNotification({ type: "success", title: "Ujian dihapus", message: `${namaDari(x)} berhasil dihapus.` });
  };

  const buatUlangToken = (x: Ujian) => {
    if (!window.confirm(`Buat token baru untuk "${namaDari(x)}"? Token lama tidak berlaku lagi.`)) return;
    // TODO: POST /api/ujian/{id}/token
    setUjian((u) => u.map((y) => (y.id === x.id ? { ...y, token: buatToken() } : y)));
    showNotification({ type: "success", title: "Token diperbarui", message: `Token baru untuk ${namaDari(x)} berhasil dibuat.` });
  };

  return (
    <main className="instruktur-main print:bg-white">
      <div className="mx-auto w-full max-w-6xl">
        <HeaderHalaman icon={FileQuestion} judul="Master ujian" deskripsi="Buat ujian, atur jadwal, lalu daftarkan pesertanya."
          aksi={
            <Link href="/instruktur/master_ujian/ujianbaru"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-700">
              <Plus size={18} /> Buat ujian baru
            </Link>
          } />

        <section className="instruktur-card rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
          <div className="flex flex-wrap items-center gap-3 border-b border-orange-100 p-4">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
              <input type="search" value={cari} onChange={(e) => { setCari(e.target.value); setPage(1); }} placeholder="Cari nama ujian atau token" aria-label="Cari ujian"
                className="w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60" />
            </div>
            <div className="flex rounded-xl border border-orange-100 bg-orange-50/40 p-1" role="group" aria-label="Filter jenis ujian">
              {(["Semua", "Pre Test", "Post Test"] as Filter[]).map((f) => (
                <button key={f} type="button" onClick={() => { setFilter(f); setPage(1); }} aria-pressed={filter === f}
                  className={`rounded-lg px-3.5 py-1.5 text-sm transition ${filter === f ? "bg-orange-500 font-medium text-white shadow-sm" : "text-slate-500 hover:text-orange-700"}`}>{f}</button>
              ))}
            </div>
          </div>

          {baris.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={32} /></span>
              <p className="font-medium text-slate-800">Ujian tidak ditemukan</p>
              <p className="text-sm text-slate-500">Ubah kata kunci, atau klik &quot;Buat ujian baru&quot;.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-orange-50 text-orange-900">
                  <tr>
                    <th className="px-4 py-3 font-medium">Ujian</th>
                    <th className="px-4 py-3 font-medium">Soal</th>
                    <th className="px-4 py-3 font-medium">Jadwal</th>
                    <th className="px-4 py-3 font-medium">Token</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {baris.map((x) => (
                    <tr key={x.id} className="align-top transition hover:bg-orange-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${x.jenis === "Pre Test" ? "bg-sky-50 text-sky-700" : "bg-violet-50 text-violet-700"}`}>{x.jenis}</span>
                          <div>
                            <p className="font-medium text-slate-900">{namaDari(x)}</p>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><BookOpen size={12} className="text-orange-400" /> {x.materi} · Pertemuan {x.pertemuan}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p className="tabular-nums">{x.jumlahSoal} soal</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Shuffle size={12} className="text-orange-400" /> {x.acak ? "Acak soal" : "Urut soal"}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p className="flex items-center gap-1 tabular-nums"><CalendarClock size={14} className="text-orange-400" /> {fmtDT(x.mulai)}</p>
                        <p className="ml-5 text-xs tabular-nums text-slate-500">s/d {fmtDT(x.sampai)}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Clock size={12} className="text-orange-400" /> {x.waktu} menit</p>
                      </td>
                      <td className="px-4 py-3"><TokenUjian token={x.token} onBuatUlang={() => buatUlangToken(x)} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/instruktur/master_ujian/${x.id}/peserta`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-700">
                            <UserPlus size={14} /> Isi peserta <span className="rounded-full bg-white/25 px-1.5 tabular-nums">{x.peserta}</span>
                          </Link>
                          <Link href={`/instruktur/master_ujian/${x.id}/ubah`} aria-label={`Ubah ${namaDari(x)}`} title="Ubah" className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"><Pencil size={16} /></Link>
                          <button type="button" onClick={() => hapus(x)} aria-label={`Hapus ${namaDari(x)}`} title="Hapus" className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Paginasi page={page} setPage={setPage} jumlah={hasil.length} perPage={PER_HALAMAN} satuan="ujian" />
        </section>
      </div>
    </main>
  );
}
