"use client";

import { useState } from "react";
import { AlertCircle, CalendarX, Pencil, Plus, RotateCw, Trash2 } from "lucide-react";
import type { LaporanHarian } from "@/lib/api";

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function warnaHadir(persen: number) {
  if (persen >= 80) return { bar: "bg-emerald-500", teks: "text-emerald-700" };
  if (persen >= 60) return { bar: "bg-amber-500", teks: "text-amber-700" };
  return { bar: "bg-red-500", teks: "text-red-700" };
}

export default function TabelRekap({ data, loading, error, onTambah, onEdit, onHapus, onCobaLagi, menghapusId }: {
  data: LaporanHarian[];
  loading: boolean;
  error: string;
  onTambah: () => void;
  onEdit: (laporan: LaporanHarian) => void;
  onHapus: (laporan: LaporanHarian) => void;
  onCobaLagi: () => void;
  menghapusId: number | null;
}) {
  const [terbuka, setTerbuka] = useState<number[]>([]);

  if (loading) {
    return (
      <div role="status" className="rounded-2xl border border-orange-200 bg-white px-4 py-16 text-center shadow-lg shadow-orange-200/40">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
        <p className="mt-4 text-sm text-slate-500">Memuat laporan harian...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-white px-4 py-14 text-center shadow-lg shadow-orange-200/40">
        <AlertCircle size={32} className="text-red-500" />
        <p className="font-medium text-slate-800">Laporan belum dapat dimuat</p>
        <p className="max-w-md text-sm text-slate-500">{error}</p>
        <button type="button" onClick={onCobaLagi} className="mt-1 inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50 print:hidden"><RotateCw size={16} /> Coba lagi</button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-16 text-center shadow-lg shadow-orange-200/40 print:shadow-none">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><CalendarX size={32} /></span>
        <p className="font-medium text-slate-800">Belum ada laporan di bulan ini</p>
        <p className="text-sm text-slate-500">Pilih bulan lain atau catat kegiatan mengajarmu.</p>
        <button type="button" onClick={onTambah} className="mt-1 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-300/50 hover:bg-orange-600 print:hidden"><Plus size={16} /> Tambah laporan</button>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="overflow-x-auto rounded-2xl border border-orange-200 bg-white shadow-lg shadow-orange-200/40 print:shadow-none">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <thead className="bg-orange-50 text-orange-900">
          <tr>
            <th scope="col" className="w-32 px-4 py-3 font-medium">Tanggal</th>
            <th scope="col" className="w-44 px-4 py-3 font-medium">Kelas</th>
            <th scope="col" className="w-40 px-4 py-3 font-medium">Materi</th>
            <th scope="col" className="w-40 px-4 py-3 font-medium">Kehadiran</th>
            <th scope="col" className="px-4 py-3 font-medium">Aktivitas</th>
            <th scope="col" className="w-28 px-4 py-3 text-right font-medium print:hidden">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((laporan) => {
            const [y, m, d] = laporan.tanggal.split("-").map(Number);
            const hari = HARI[new Date(y, m - 1, d).getDay()];
            const persen = laporan.total > 0 ? Math.round((laporan.hadir / laporan.total) * 100) : 0;
            const w = warnaHadir(persen);
            const buka = terbuka.includes(laporan.id);
            return (
              <tr key={laporan.id} className="border-t border-orange-100 align-top print:break-inside-avoid">
                <td className="px-4 py-4">
                  <span className="block text-xs font-medium text-orange-600">{hari}</span>
                  <span className="font-semibold text-slate-900">{d} {BULAN[m - 1]} {y}</span>
                </td>
                <td className="px-4 py-4 font-medium text-slate-900">{laporan.kelas ?? <span className="font-normal text-slate-400">Tanpa kelas</span>}</td>
                <td className="px-4 py-4 text-slate-700">{laporan.materi ?? "—"}</td>
                <td className="px-4 py-4">
                  {laporan.kelas_id !== null ? (
                    <>
                      <span className={`font-semibold tabular-nums ${w.teks}`}>{laporan.hadir} / {laporan.total}</span>
                      <span className="ml-1 text-xs text-slate-500">({persen}%)</span>
                      <span className="mt-1.5 block h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                        <span className={`block h-full rounded-full ${w.bar}`} style={{ width: `${Math.min(persen, 100)}%` }} />
                      </span>
                    </>
                  ) : <span className="text-slate-400">—</span>}
                </td>
                <td className="max-w-sm px-4 py-4">
                  {laporan.aktivitas ? (
                    <>
                      <p className={`text-slate-700 ${laporan.aktivitas.length > 90 && !buka ? "line-clamp-2 print:line-clamp-none" : ""}`}>{laporan.aktivitas}</p>
                      {laporan.aktivitas.length > 90 && (
                        <button type="button" onClick={() => setTerbuka((ids) => buka ? ids.filter((id) => id !== laporan.id) : [...ids, laporan.id])} className="mt-1 text-xs font-medium text-orange-700 hover:underline print:hidden">{buka ? "Ringkas" : "Selengkapnya"}</button>
                      )}
                    </>
                  ) : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-4 print:hidden">
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => onEdit(laporan)} aria-label={`Ubah laporan ${d} ${BULAN[m - 1]} ${y}`} className="rounded-lg p-2 text-sky-600 hover:bg-sky-50"><Pencil size={16} /></button>
                    <button type="button" onClick={() => onHapus(laporan)} disabled={menghapusId === laporan.id} aria-label={`Hapus laporan ${d} ${BULAN[m - 1]} ${y}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
=======
    <div className="overflow-x-auto rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40 print:shadow-none">
      <table className="instruktur-report-table w-full min-w-[980px] border-collapse text-left text-sm" aria-label="Rekap laporan bulanan instruktur">
        <caption className="sr-only">Rekap kelas, kehadiran, dan aktivitas instruktur per tanggal</caption>
        <thead className="bg-orange-50 text-orange-900">
          <tr>
            <th scope="col" className="w-40 px-4 py-3 font-medium">Tanggal</th>
            <th scope="col" className="w-56 px-4 py-3 font-medium">Kelas dan sesi</th>
            <th scope="col" className="w-52 px-4 py-3 font-medium">Materi</th>
            <th scope="col" className="w-48 px-4 py-3 font-medium">Kehadiran peserta</th>
            <th scope="col" className="px-4 py-3 font-medium">Ringkasan aktivitas</th>
          </tr>
        </thead>
        {data.map((h, i) => {
          const [y, m, d] = h.tanggal.split("-").map(Number);
          const hari = HARI[new Date(y, m - 1, d).getDay()];
          const baris = h.pertemuan.length > 0 ? h.pertemuan : [null];
          const n = baris.length;
          const panjang = h.aktivitas.length > 90;
          const buka = terbuka.includes(h.tanggal);
          return (
            <tbody key={h.tanggal} className={`border-t-2 border-orange-200 print:break-inside-avoid ${i % 2 ? "bg-orange-50/40" : "bg-white"}`}>
              {baris.map((p, j) => {
                const persen = p && p.total > 0 ? Math.round((p.hadir / p.total) * 100) : 0;
                const w = warnaHadir(persen);
                return (
                  <tr key={j} className={j > 0 ? "border-t border-dashed border-orange-100" : ""}>
                    {j === 0 && (
                      <td rowSpan={n} className="instruktur-report-date border-r-2 border-orange-200 px-4 py-4 align-top">
                        <span className="inline-flex rounded-lg bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-orange-700 shadow-sm">{hari}</span>
                        <span className="mt-2 block whitespace-nowrap text-base font-bold text-slate-900">{d} {BULAN[m - 1]} {y}</span>
                      </td>
                    )}
                    <td className="px-4 py-3 align-top">
                      {p ? (
                        <>
                          <span className="block font-medium text-slate-900">{p.kelas}</span>
                          <span className="mt-1 flex flex-wrap gap-1">
                            {p.sesi.map((s) => <span key={s} className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">Sesi {s}</span>)}
                          </span>
                        </>
                      ) : <span className="text-slate-400">Tidak ada kelas</span>}
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">{p ? p.materi : "—"}</td>
                    <td className="px-4 py-3 align-top">
                      {p ? (
                        <>
                          <span className={`text-sm font-semibold tabular-nums ${w.teks}`}>{p.hadir} dari {p.total}</span>
                          <span className="ml-1.5 text-xs text-slate-500">({persen}%)</span>
                          <span className="mt-1.5 block h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
                            <span className={`block h-full rounded-full ${w.bar}`} style={{ width: `${persen}%` }} />
                          </span>
                        </>
                      ) : "—"}
                    </td>
                    {j === 0 && (
                      <td rowSpan={n} className="border-l border-orange-100 px-4 py-3 align-top">
                        {h.aktivitas ? (
                          <>
                            <p className={`text-slate-800 ${panjang && !buka ? "line-clamp-2 print:line-clamp-none" : ""}`}>{h.aktivitas}</p>
                            {panjang && (
                              <button type="button" onClick={() => setTerbuka((t) => (buka ? t.filter((x) => x !== h.tanggal) : [...t, h.tanggal]))}
                                className="mt-1 text-xs font-medium text-orange-700 hover:underline print:hidden">{buka ? "Ringkas" : "Selengkapnya"}</button>
                            )}
                          </>
                        ) : <span className="text-slate-400">—</span>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          );
        })}
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
      </table>
    </div>
  );
}
