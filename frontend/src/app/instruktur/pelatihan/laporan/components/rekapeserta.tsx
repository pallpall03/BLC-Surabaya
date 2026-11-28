"use client";

import { useState } from "react";
import { AlertCircle, CalendarDays, CalendarX, CheckCircle2, Clock, MapPin, RotateCw } from "lucide-react";

export type PesertaKehadiran = {
  peserta_id: number;
  nama: string;
  hadir: number;
  tidak_hadir: number;
  persentase: number;
};

export type KegiatanRekap = {
  kelas_id: number;
  nama_kelas: string;
  materi: string | null;
  sesi_id: number | null;
  sesi: number | null;
  waktu_sesi: string | null;
  lokasi: string | null;
  hari: string[];
  total_peserta: number;
  total_pertemuan: number;
  hadir: number;
  tidak_hadir: number;
  persentase: number;
  peserta: PesertaKehadiran[];
};

export type SesiRekap = {
  sesi_id: number | null;
  sesi: number | null;
  waktu_sesi: string | null;
  jumlah_kegiatan: number;
  total_peserta: number;
  total_pertemuan: number;
  hadir: number;
  tidak_hadir: number;
  peserta: PesertaKehadiran[];
  kegiatan: { kelas_id: number; nama_kelas: string }[];
};

export type RekapPeserta = {
  per_sesi: SesiRekap[];
  per_kegiatan: KegiatanRekap[];
  ringkasan: {
    jumlah_kegiatan: number;
    jumlah_peserta: number;
    total_pertemuan: number;
    hadir: number;
    tidak_hadir: number;
    persentase: number;
  };
};

type TabRekap = "sesi" | "kegiatan";

function Statistik({ label, nilai, satuan }: { label: string; nilai: number; satuan: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">{nilai}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{satuan}</p>
    </div>
  );
}

function TabelPeserta({ peserta }: { peserta: PesertaKehadiran[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[540px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-2.5 font-medium">Peserta</th>
            <th className="px-4 py-2.5 text-right font-medium">Hadir</th>
            <th className="px-4 py-2.5 text-right font-medium">Tidak hadir</th>
            <th className="px-4 py-2.5 text-right font-medium">Persentase</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {peserta.map((item) => (
            <tr key={item.peserta_id}>
              <td className="px-4 py-2.5 font-medium text-slate-800">{item.nama}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-emerald-700">{item.hadir}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-red-600">{item.tidak_hadir}</td>
              <td className="px-4 py-2.5 text-right">
                <span className={`inline-flex min-w-14 justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${item.persentase >= 80 ? "bg-emerald-50 text-emerald-700" : item.persentase >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{item.persentase}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RekapPeserta({ data, loading, error, onCobaLagi }: {
  data: RekapPeserta | null;
  loading: boolean;
  error: string;
  onCobaLagi: () => void;
}) {
  const [tab, setTab] = useState<TabRekap>("sesi");

  if (loading) {
    return (
      <div role="status" className="rounded-2xl border border-orange-200 bg-white px-4 py-16 text-center shadow-lg shadow-orange-200/40">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
        <p className="mt-4 text-sm text-slate-500">Memuat laporan kehadiran peserta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-white px-4 py-14 text-center shadow-lg shadow-orange-200/40">
        <AlertCircle size={32} className="text-red-500" />
        <p className="font-medium text-slate-800">Laporan kehadiran belum dapat dimuat</p>
        <p className="max-w-md text-sm text-slate-500">{error}</p>
        <button type="button" onClick={onCobaLagi} className="mt-1 inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"><RotateCw size={16} /> Coba lagi</button>
      </div>
    );
  }

  if (!data || (data.per_sesi.length === 0 && data.per_kegiatan.length === 0)) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-16 text-center shadow-lg shadow-orange-200/40">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><CalendarX size={30} /></span>
        <p className="font-medium text-slate-800">Belum ada data kehadiran pada periode ini</p>
        <p className="max-w-md text-sm text-slate-500">Catat absensi kelas terlebih dahulu, lalu pilih periode laporan yang sesuai.</p>
      </div>
    );
  }

  const { ringkasan } = data;
  const daftar = tab === "sesi" ? data.per_sesi : data.per_kegiatan;

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-label="Ringkasan laporan">
        <Statistik label="Kegiatan" nilai={ringkasan.jumlah_kegiatan} satuan="kelas" />
        <Statistik label="Peserta" nilai={ringkasan.jumlah_peserta} satuan="orang" />
        <Statistik label="Pertemuan" nilai={ringkasan.total_pertemuan} satuan="tercatat" />
        <Statistik label="Hadir" nilai={ringkasan.hadir} satuan="kehadiran" />
        <Statistik label="Tidak hadir" nilai={ringkasan.tidak_hadir} satuan="kehadiran" />
      </section>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-900">Persentase kehadiran keseluruhan</p>
          </div>
          <p className="text-xl font-semibold tabular-nums text-emerald-800">{ringkasan.persentase}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(ringkasan.persentase, 100)}%` }} />
        </div>
      </div>

      <div className="flex w-full rounded-xl border border-orange-100 bg-white p-1 shadow-md sm:w-fit print:hidden" role="tablist" aria-label="Jenis laporan kehadiran">
        {([
          ["sesi", "Per sesi"],
          ["kegiatan", "Per kegiatan pelatihan"],
        ] as const).map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`flex-1 rounded-lg px-5 py-2.5 text-sm transition sm:flex-none ${tab === key ? "bg-orange-500 font-medium text-white shadow-sm" : "text-slate-500 hover:text-orange-700"}`}>{label}</button>
        ))}
      </div>

      {tab === "sesi" ? (
        <section aria-label="Laporan per sesi" className="space-y-4">
          {data.per_sesi.map((sesi) => (
            <article key={sesi.sesi_id ?? "tanpa-sesi"} className="rounded-2xl border border-orange-200 bg-white p-4 shadow-lg shadow-orange-200/40 sm:p-5 print:break-inside-avoid print:shadow-none">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Clock size={18} className="text-orange-500" />Sesi {sesi.sesi ?? "-"}</h2>
                  <p className="mt-1 text-sm text-slate-500">{sesi.waktu_sesi || "Waktu sesi belum diisi"} · {sesi.jumlah_kegiatan} kegiatan pelatihan</p>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">{sesi.total_peserta} peserta</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Statistik label="Pertemuan" nilai={sesi.total_pertemuan} satuan="tercatat" />
                <Statistik label="Hadir" nilai={sesi.hadir} satuan="kehadiran" />
                <Statistik label="Tidak hadir" nilai={sesi.tidak_hadir} satuan="kehadiran" />
                <Statistik label="Kegiatan" nilai={sesi.jumlah_kegiatan} satuan="kelas" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {sesi.kegiatan.map((kegiatan) => <span key={kegiatan.kelas_id} className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700">{kegiatan.nama_kelas}</span>)}
              </div>

              <TabelPeserta peserta={sesi.peserta} />
            </article>
          ))}
        </section>
      ) : (
        <section aria-label="Laporan per kegiatan pelatihan" className="space-y-4">
          {data.per_kegiatan.map((kegiatan) => (
            <article key={kegiatan.kelas_id} className="rounded-2xl border border-orange-200 bg-white p-4 shadow-lg shadow-orange-200/40 sm:p-5 print:break-inside-avoid print:shadow-none">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{kegiatan.nama_kelas}</h2>
                  <p className="mt-1 text-sm text-slate-600">{kegiatan.materi || "Materi belum diisi"}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-orange-400" />Sesi {kegiatan.sesi ?? "-"}{kegiatan.waktu_sesi ? ` · ${kegiatan.waktu_sesi}` : ""}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-orange-400" />{kegiatan.lokasi || "-"}</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} className="text-orange-400" />{kegiatan.hari.length > 0 ? kegiatan.hari.join(", ") : "Jadwal belum diisi"}</span>
                  </div>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">{kegiatan.total_peserta} peserta</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Statistik label="Pertemuan" nilai={kegiatan.total_pertemuan} satuan="tercatat" />
                <Statistik label="Hadir" nilai={kegiatan.hadir} satuan="kehadiran" />
                <Statistik label="Tidak hadir" nilai={kegiatan.tidak_hadir} satuan="kehadiran" />
                <Statistik label="Persentase" nilai={kegiatan.persentase} satuan="hadir" />
              </div>

              <TabelPeserta peserta={kegiatan.peserta} />
            </article>
          ))}
        </section>
      )}

      {daftar.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Belum ada data pada tampilan ini.</p>}
    </div>
  );
}
