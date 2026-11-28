"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays, CheckCircle2, ClipboardCheck, MapPin, RefreshCw, Search, SearchX, Users,
} from "lucide-react";
import { getPesertaRekap, type KelasDiikuti, type PesertaRekap } from "@/lib/api";

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";
const persen = (hadir: number, total: number) => total > 0 ? Math.round((hadir / total) * 100) : 0;

function KartuKelas({ kelas }: { kelas: KelasDiikuti }) {
  const nilai = persen(kelas.total_hadir, kelas.total_pertemuan);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">{kelas.nama_kelas}</h3>
          <p className="mt-1 text-sm text-slate-600">{kelas.materi || "Materi belum diisi"}</p>
        </div>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          Sesi {kelas.sesi ?? "-"}{kelas.waktu_sesi ? ` · ${kelas.waktu_sesi}` : ""}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-orange-400" />{kelas.lokasi || "-"}</span>
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} className="text-orange-400" />{kelas.hari.length > 0 ? kelas.hari.join(", ") : "Jadwal belum diisi"}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">Kehadiran</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {kelas.total_pertemuan > 0 ? `${kelas.total_hadir} dari ${kelas.total_pertemuan} pertemuan` : "Belum ada catatan kehadiran"}
          </p>
        </div>
        {kelas.total_pertemuan > 0 && (
          <div className="w-full max-w-48">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">Persentase hadir</span>
              <span className="font-semibold text-slate-700">{nilai}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full ${nilai >= 80 ? "bg-emerald-500" : nilai >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${nilai}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DaftarHadirPage() {
  const [data, setData] = useState<PesertaRekap[]>([]);
  const [cari, setCari] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coba, setCoba] = useState(0);
  const permintaan = useRef(0);

  const muatData = useCallback(async () => {
    const idPermintaan = ++permintaan.current;
    setLoading(true);
    setError("");
    try {
      const res = await getPesertaRekap({ q: cari.trim() || undefined });
      if (idPermintaan === permintaan.current) setData(res.data ?? []);
    } catch (e) {
      if (idPermintaan === permintaan.current) {
        setError(e instanceof Error ? e.message : "Rekap kehadiran peserta gagal dimuat.");
        setData([]);
      }
    } finally {
      if (idPermintaan === permintaan.current) setLoading(false);
    }
  }, [cari]);

  useEffect(() => {
    const timer = setTimeout(() => void muatData(), 300);
    return () => clearTimeout(timer);
  }, [muatData, coba]);

  const ringkasan = useMemo(() => {
    const kelas = new Set<number>();
    data.forEach((peserta) => peserta.kelas.forEach((item) => kelas.add(item.id)));
    return {
      peserta: data.length,
      kelas: kelas.size,
      pertemuan: data.reduce((total, peserta) => total + peserta.total_pertemuan, 0),
      hadir: data.reduce((total, peserta) => total + peserta.total_hadir, 0),
    };
  }, [data]);

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-6 sm:px-8 sm:py-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="instruktur-page-header flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25"><ClipboardCheck size={28} /></span>
            <div>
              <h1 className="text-2xl font-semibold">Daftar Hadir Peserta</h1>
              <p className="mt-1 max-w-2xl text-sm text-orange-50">Lihat kelas yang diikuti setiap peserta beserta rekap kehadiran dari absensi kelas.</p>
            </div>
          </div>
          <button type="button" onClick={() => window.print()} disabled={loading || data.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50 disabled:opacity-40"><ClipboardCheck size={16} /> Cetak</button>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 print:grid-cols-4" aria-label="Ringkasan kehadiran peserta">
          {[
            { label: "Peserta", nilai: ringkasan.peserta, satuan: "orang" },
            { label: "Kelas diikuti", nilai: ringkasan.kelas, satuan: "kelas" },
            { label: "Pertemuan tercatat", nilai: ringkasan.pertemuan, satuan: "pertemuan" },
            { label: "Total hadir", nilai: ringkasan.hadir, satuan: "kehadiran" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-orange-200 bg-white p-4 shadow-lg shadow-orange-200/40 print:shadow-none">
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{item.nilai}</p>
              <p className="mt-1 text-xs text-slate-400">{item.satuan}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-orange-200 bg-white shadow-lg shadow-orange-200/40 print:border-0 print:shadow-none">
          <div className="flex flex-wrap items-center gap-3 border-b border-orange-100 p-4 print:hidden">
            <div className="relative mr-auto w-full sm:max-w-sm">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
              <input type="search" value={cari} onChange={(event) => setCari(event.target.value)} placeholder="Cari nama, NIK, atau kelas" aria-label="Cari peserta atau kelas" className={`${inputCls} pl-10`} />
            </div>
            <button type="button" onClick={() => setCoba((nilai) => nilai + 1)} className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50"><RefreshCw size={16} /> Muat ulang</button>
          </div>

          {loading ? (
            <div role="status" className="px-4 py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
              <p className="mt-4 text-sm text-slate-500">Memuat rekap kehadiran peserta...</p>
            </div>
          ) : error ? (
            <div role="alert" className="flex flex-col items-center gap-3 px-4 py-14 text-center">
              <SearchX size={32} className="text-red-500" />
              <p className="font-medium text-slate-800">Rekap kehadiran belum dapat dimuat</p>
              <p className="max-w-md text-sm text-slate-500">{error}</p>
              <button type="button" onClick={() => setCoba((nilai) => nilai + 1)} className="mt-1 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50">Coba lagi</button>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><Users size={30} /></span>
              <p className="font-medium text-slate-800">{cari.trim() ? "Peserta atau kelas tidak ditemukan" : "Belum ada peserta yang mengikuti kelas"}</p>
              <p className="max-w-md text-sm text-slate-500">{cari.trim() ? "Ubah kata kunci pencarian." : "Tambahkan peserta ke kelas melalui menu Daftar Kelas."}</p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {data.map((peserta) => (
                <article key={peserta.id} className="rounded-2xl border border-orange-100 bg-white p-4 sm:p-5 print:break-inside-avoid">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-900">{peserta.nama}</h2>
                        {peserta.tervalidasi && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"><CheckCircle2 size={13} /> Tervalidasi</span>}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">NIK {peserta.nik || "-"} · {peserta.blc || "BLC belum diisi"}{peserta.kategori ? ` · ${peserta.kategori}` : ""}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-sky-50 px-3 py-1.5 font-semibold text-sky-700">{peserta.kelas.length} kelas</span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">{peserta.total_hadir} / {peserta.total_pertemuan} hadir</span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {peserta.kelas.map((kelas) => <KartuKelas key={kelas.id} kelas={kelas} />)}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
