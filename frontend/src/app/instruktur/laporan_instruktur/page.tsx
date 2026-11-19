"use client";

import { useMemo, useState } from "react";
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, ClipboardList, Clock, Printer, UserCheck } from "lucide-react";
import KartuRingkasan from "./components/karturingkasan";
import TabelRekap, { type LaporanHarian } from "./components/tabelrekap";

// ===== DATA HARDCODE SEMENTARA =====
// TODO (backend): ganti dengan data dari API, mis. GET /laporan-instruktur?bulan=2026-11
// Instruktur diambil dari akun yang sedang login (bukan dikirim dari frontend).
// Bentuk data: daftar hari, tiap hari berisi:
//   { tanggal: "YYYY-MM-DD", aktivitas: string,
//     pertemuan: { kelas, sesi: number[], materi, hadir: number, total: number }[] }
const NAMA_INSTRUKTUR = "Nama Instruktur"; // TODO: ambil dari akun login
const BULAN_AWAL = "2026-11";               // TODO: ganti dengan bulan berjalan jika sudah memakai API

const APL = "APLIKASI PERKANTORAN";
const DATA: Record<string, LaporanHarian[]> = {
  "2026-11": [
    { tanggal: "2026-11-03", aktivitas: "Mengajar pengenalan Excel dan membagikan modul latihan kepada peserta.", pertemuan: [
      { kelas: "Simok-APL-1", sesi: [1], materi: APL, hadir: 5, total: 5 },
      { kelas: "Simok-APL-3", sesi: [3], materi: APL, hadir: 3, total: 3 } ] },
    { tanggal: "2026-11-04", aktivitas: "Koordinasi jadwal ujian praktik dengan petugas BLC.", pertemuan: [
      { kelas: "Simok-APL-2", sesi: [2], materi: APL, hadir: 3, total: 3 } ] },
    { tanggal: "2026-11-05", aktivitas: "", pertemuan: [
      { kelas: "Simok-APL-1", sesi: [1], materi: APL, hadir: 4, total: 5 } ] },
    { tanggal: "2026-11-06", aktivitas: "Ujian praktik membuat tabel dan grafik. Seluruh peserta menyelesaikan soal sampai selesai dan hasilnya sudah dinilai.", pertemuan: [
      { kelas: "Simok-APL-2", sesi: [2], materi: APL, hadir: 3, total: 3 },
      { kelas: "Simok-APL-3", sesi: [3], materi: APL, hadir: 2, total: 3 } ] },
    { tanggal: "2026-11-10", aktivitas: "Review materi Word: format dokumen, header, dan nomor halaman.", pertemuan: [
      { kelas: "Simok-APL-1", sesi: [1], materi: APL, hadir: 5, total: 5 },
      { kelas: "Simok-APL-3", sesi: [3], materi: APL, hadir: 3, total: 3 } ] },
    { tanggal: "2026-11-12", aktivitas: "Melaksanakan kegiatan apel pagi.", pertemuan: [
      { kelas: "Simok-APL-1", sesi: [1], materi: APL, hadir: 5, total: 5 } ] },
    { tanggal: "2026-11-13", aktivitas: "", pertemuan: [
      { kelas: "Simok-APL-2", sesi: [2], materi: APL, hadir: 2, total: 3 },
      { kelas: "Simok-APL-3", sesi: [3], materi: APL, hadir: 3, total: 3 } ] },
    { tanggal: "2026-11-17", aktivitas: "Sosialisasi program pelatihan kepada warga di balai kelurahan, dilanjutkan dengan pendataan calon peserta baru.", pertemuan: [
      { kelas: "Simok-APL-1", sesi: [1], materi: APL, hadir: 5, total: 5 },
      { kelas: "Simok-APL-3", sesi: [3], materi: APL, hadir: 3, total: 3 } ] },
    { tanggal: "2026-11-18", aktivitas: "Rapat koordinasi bulanan antar instruktur.", pertemuan: [] },
  ],
  "2026-10": [
    { tanggal: "2026-10-06", aktivitas: "Mengajar dasar Windows dan manajemen file.", pertemuan: [
      { kelas: "Simok-APL-1", sesi: [1], materi: APL, hadir: 5, total: 5 },
      { kelas: "Simok-APL-3", sesi: [3], materi: APL, hadir: 3, total: 3 } ] },
    { tanggal: "2026-10-08", aktivitas: "", pertemuan: [
      { kelas: "Simok-APL-1", sesi: [1], materi: APL, hadir: 4, total: 5 } ] },
    { tanggal: "2026-10-09", aktivitas: "Pendampingan latihan mengetik cepat.", pertemuan: [
      { kelas: "Simok-APL-2", sesi: [2], materi: APL, hadir: 3, total: 3 },
      { kelas: "Simok-APL-3", sesi: [3], materi: APL, hadir: 1, total: 3 } ] },
  ],
};

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const namaBulan = (ym: string) => { const [y, m] = ym.split("-"); return `${BULAN[Number(m) - 1]} ${y}`; };
const geser = (ym: string, n: number) => {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default function LaporanInstrukturPage() {
  const [bulan, setBulan] = useState(BULAN_AWAL);
  const data = DATA[bulan] ?? [];

  const ringkas = useMemo(() => {
    const semua = data.flatMap((h) => h.pertemuan);
    const hadir = semua.reduce((a, p) => a + p.hadir, 0);
    const total = semua.reduce((a, p) => a + p.total, 0);
    return {
      sesi: semua.reduce((a, p) => a + p.sesi.length, 0),
      kelas: new Set(semua.map((p) => p.kelas)).size,
      persen: total > 0 ? Math.round((hadir / total) * 100) : 0,
      aktivitas: data.filter((h) => h.aktivitas).length,
    };
  }, [data]);

  const tombolPanah = "rounded-lg border border-orange-200 p-2 text-slate-600 transition hover:bg-orange-50";

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="print:hidden">
          <h1 className="text-2xl font-semibold text-slate-900">Laporan bulanan instruktur</h1>
          <p className="mt-1 text-sm text-slate-500">Rekap kelas yang diajar dan aktivitasmu selama satu bulan.</p>
        </div>

        {/* Kop laporan (hanya muncul saat dicetak) */}
        <div className="hidden text-center print:block">
          <h1 className="text-xl font-bold">Laporan Bulanan Instruktur BLC</h1>
          <p className="text-sm">Nama: {NAMA_INSTRUKTUR} · Bulan: {namaBulan(bulan)}</p>
        </div>

        {/* Pilih bulan: langsung berubah, tanpa tombol "Tampilkan" */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-white p-4 shadow-lg shadow-orange-200/40 print:hidden">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setBulan(geser(bulan, -1))} aria-label="Bulan sebelumnya" className={tombolPanah}><ChevronLeft size={18} /></button>
            <div className="relative">
              <CalendarDays size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
              <input type="month" value={bulan} onChange={(e) => e.target.value && setBulan(e.target.value)} aria-label="Pilih bulan"
                className="rounded-xl border border-orange-100 bg-orange-50/40 py-2 pl-10 pr-3 text-sm font-medium outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60" />
            </div>
            <button type="button" onClick={() => setBulan(geser(bulan, 1))} aria-label="Bulan berikutnya" className={tombolPanah}><ChevronRight size={18} /></button>
            <span className="ml-2 hidden text-sm font-semibold text-slate-800 sm:inline">{namaBulan(bulan)}</span>
          </div>
          <button type="button" onClick={() => window.print()} disabled={data.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50 disabled:opacity-40">
            <Printer size={16} /> Cetak laporan
          </button>
        </div>

        {/* Ringkasan */}
        {data.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KartuRingkasan icon={Clock} label="Sesi mengajar" nilai={ringkas.sesi} warna="bg-orange-100 text-orange-600" />
            <KartuRingkasan icon={BookOpen} label="Kelas diajar" nilai={ringkas.kelas} warna="bg-sky-100 text-sky-600" />
            <KartuRingkasan icon={UserCheck} label="Kehadiran peserta" nilai={`${ringkas.persen}%`} catatan="rata-rata bulan ini" warna="bg-emerald-100 text-emerald-600" />
            <KartuRingkasan icon={ClipboardList} label="Hari beraktivitas" nilai={ringkas.aktivitas} catatan="hari dengan aktivitas tercatat" warna="bg-violet-100 text-violet-600" />
          </div>
        )}

        <TabelRekap data={data} />

        {/* Tanda tangan (hanya muncul saat dicetak) */}
        <div className="hidden justify-end pt-10 print:flex">
          <div className="w-64 text-center text-sm">
            <p>Instruktur,</p>
            <div className="h-20" />
            <p className="font-semibold underline">{NAMA_INSTRUKTUR}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
