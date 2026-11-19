"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays, CheckCircle2, Clock, Pencil, Plus, Printer, RotateCcw, Search, SearchX, Trash2, UserPlus, Users,
} from "lucide-react";
import HeaderHalaman from "./components/headerhalaman";
import JadwalKelas from "./components/jadwalkelas";
import { jamSesi, KELAS_CONTOH, type Kelas } from "./data";

type Filter = "Semua" | "Aktif" | "Selesai";
const kartu = "rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40";

export default function DaftarKelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>(KELAS_CONTOH);
  const [filter, setFilter] = useState<Filter>("Semua");
  const [cari, setCari] = useState("");
  const [pesan, setPesan] = useState("");

  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return kelas.filter((k) => (filter === "Semua" || k.status === filter) && (!q || k.nama.toLowerCase().includes(q) || k.materi.toLowerCase().includes(q)));
  }, [kelas, filter, cari]);

  const toast = (t: string) => { setPesan(t); setTimeout(() => setPesan(""), 3000); };
  const ubahStatus = (id: number, status: Kelas["status"]) => {
    // TODO: kirim perubahan status ke API
    setKelas((d) => d.map((k) => (k.id === id ? { ...k, status } : k)));
    toast(status === "Selesai" ? "Kelas ditandai selesai." : "Kelas diaktifkan kembali.");
  };
  const hapus = (k: Kelas) => {
    if (!window.confirm(`Hapus kelas ${k.nama}?`)) return;
    setKelas((d) => d.filter((x) => x.id !== k.id));
    toast("Kelas dihapus.");
  };

  const jumlah = (f: Filter) => (f === "Semua" ? kelas.length : kelas.filter((k) => k.status === f).length);

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <HeaderHalaman icon={CalendarDays} judul="Daftar kelas" deskripsi="Lihat jadwal kelas aktif dan kelola semua kelas." />

        <section className={`${kartu} mb-6`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Clock size={20} className="text-orange-500" /> Jadwal kelas aktif</h2>
            {/* TODO: ganti dengan ekspor PDF dari backend jika perlu */}
            <button type="button" onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50">
              <Printer size={16} /> Cetak jadwal
            </button>
          </div>
          <JadwalKelas kelas={kelas} />
        </section>

        <section className={kartu}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Users size={20} className="text-orange-500" /> Semua kelas</h2>
            <Link href="/instruktur/daftar_kelas/kelasbaru"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-green-600/30 transition hover:-translate-y-0.5 hover:bg-green-700">
              <Plus size={18} /> Buat kelas baru
            </Link>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
              <input type="search" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama kelas atau materi" aria-label="Cari kelas"
                className="w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60" />
            </div>
            <div className="flex gap-2">
              {(["Semua", "Aktif", "Selesai"] as Filter[]).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
                  className={`rounded-full border px-4 py-2 text-sm transition ${filter === f ? "border-orange-500 bg-orange-500 font-medium text-white shadow-sm" : "border-orange-200 bg-white text-slate-600 hover:bg-orange-50"}`}>
                  {f} <span className={`ml-1 text-xs ${filter === f ? "text-orange-100" : "text-slate-400"}`}>{jumlah(f)}</span>
                </button>
              ))}
            </div>
          </div>

          {tampil.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={32} /></span>
              <p className="font-medium text-slate-800">Tidak ada kelas yang cocok</p>
              <p className="text-sm text-slate-500">Ubah kata kunci atau pilih filter lain.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-orange-100">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-orange-50 text-orange-900">
                  <tr>
                    {["Kelas", "Sesi", "Hari", "Materi", "Status", "Peserta", "Aksi"].map((h, i) => (
                      <th key={h} className={`px-4 py-3 font-medium ${i === 6 ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {tampil.map((k) => (
                    <tr key={k.id} className="transition hover:bg-orange-50/60">
                      <td className="px-4 py-3">
                        <span className="block font-medium text-slate-900">{k.nama}</span>
                        <span className="text-xs text-slate-500">{k.tanggal}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <span className="block">Sesi {k.sesi}</span>
                        <span className="text-xs text-slate-500">{jamSesi(k.sesi)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {k.hari.map((h) => <span key={h} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">{h}</span>)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{k.materi}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${k.status === "Aktif" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${k.status === "Aktif" ? "bg-emerald-500" : "bg-slate-400"}`} /> {k.status}
                        </span>
                      </td>
                      <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 tabular-nums text-slate-700"><Users size={15} className="text-orange-400" />{k.totalPeserta}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {k.status === "Aktif" ? (
                            <>
                              <Link href={`/instruktur/daftar_kelas/${k.id}/peserta`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-orange-600">
                                <UserPlus size={14} /> Isi peserta
                              </Link>
                              <button type="button" onClick={() => ubahStatus(k.id, "Selesai")} title="Tandai selesai" aria-label={`Tandai ${k.nama} selesai`}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"><CheckCircle2 size={16} /></button>
                            </>
                          ) : (
                            <button type="button" onClick={() => ubahStatus(k.id, "Aktif")}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-50">
                              <RotateCcw size={14} /> Aktifkan
                            </button>
                          )}
                          <Link href={`/instruktur/daftar_kelas/${k.id}/ubah`} title="Ubah" aria-label={`Ubah ${k.nama}`}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"><Pencil size={16} /></Link>
                          <button type="button" onClick={() => hapus(k)} title="Hapus" aria-label={`Hapus ${k.nama}`}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      {pesan && <div role="status" className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{pesan}</div>}
    </main>
  );
}