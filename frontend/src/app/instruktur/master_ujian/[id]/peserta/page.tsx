"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle, ArrowLeft, BookOpen, CalendarClock, Clock, FileQuestion,
  Info, LoaderCircle, Pencil, RefreshCw, Shuffle, Users,
} from "lucide-react";
import { getUjianDetail, getUjianOpsi, type KelasUjianOpsi, type Ujian } from "@/lib/api";
import HeaderHalaman from "../../components/headerhalaman";
import TokenUjian from "../../components/tokenujian";

function formatTanggal(nilai: string) {
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(tanggal);
}

export default function KelasPesertaUjianPage() {
  const { id } = useParams<{ id: string }>();
  const ujianId = Number(id);
  const [ujian, setUjian] = useState<Ujian | null>(null);
  const [kelas, setKelas] = useState<KelasUjianOpsi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coba, setCoba] = useState(0);

  useEffect(() => {
    let aktif = true;
    void Promise.resolve().then(async () => {
      if (!Number.isInteger(ujianId) || ujianId <= 0) {
        if (!aktif) return;
        setError("Nomor ujian tidak valid.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const [detail, opsi] = await Promise.all([getUjianDetail(ujianId), getUjianOpsi()]);
        if (!aktif) return;
        setUjian(detail.data);
        setKelas(opsi.data?.kelas ?? []);
      } catch (e) {
        if (aktif) setError(e instanceof Error ? e.message : "Data ujian gagal dimuat.");
      } finally {
        if (aktif) setLoading(false);
      }
    });
    return () => { aktif = false; };
  }, [ujianId, coba]);

  const opsiKelas = useMemo(() => new Map(kelas.map((item) => [item.id, item])), [kelas]);
  const jadwal = ujian?.jadwal ?? [];
  const totalPeserta = jadwal.reduce((total, item) => total + (opsiKelas.get(item.kelas_id)?.jumlah_peserta ?? 0), 0);
  const adaDataKelasHilang = jadwal.some((item) => !opsiKelas.has(item.kelas_id));

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl"><Link href="/instruktur/master_ujian" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-700"><ArrowLeft size={16} /> Kembali</Link></div>
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-16 text-sm text-slate-500" role="status"><LoaderCircle size={20} className="animate-spin text-orange-500" /> Memuat data kelas dan peserta...</div>
      </main>
    );
  }

  if (error || !ujian) {
    return (
      <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-xl shadow-orange-300/40">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500"><AlertCircle size={28} /></span>
          <h1 className="mt-4 font-semibold text-slate-900">Data ujian tidak dapat dimuat</h1>
          <p className="mt-2 text-sm text-slate-500">{error || "Ujian tidak ditemukan."}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setCoba((n) => n + 1)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600"><RefreshCw size={16} /> Coba lagi</button>
            <Link href="/instruktur/master_ujian" className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50"><ArrowLeft size={16} /> Daftar ujian</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <HeaderHalaman icon={Users} judul="Kelas & peserta ujian" deskripsi={ujian.judul} kembali="/instruktur/master_ujian"
          aksi={<Link href={`/instruktur/master_ujian/${ujian.id}/ubah`} className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/40 transition hover:bg-white/30"><Pencil size={16} /> Ubah ujian</Link>}>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white"><FileQuestion size={14} /> {ujian.tipe === "pretest" ? "Pretest" : "Posttest"}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white"><BookOpen size={14} /> {ujian.materi ?? "Materi belum dipilih"}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white"><Clock size={14} /> {ujian.durasi_menit} menit</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white"><Shuffle size={14} /> {ujian.acak_soal ? "Acak soal" : "Urut soal"}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white">{ujian.is_aktif ? "Aktif" : "Nonaktif"}</span>
          </div>
        </HeaderHalaman>

        <section className="mb-5 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-900" aria-labelledby="penjelasan-peserta">
          <Info size={20} className="mt-0.5 shrink-0 text-sky-600" />
          <div>
            <h2 id="penjelasan-peserta" className="font-medium">Peserta mengikuti ujian melalui jadwal kelas</h2>
            <p className="mt-1 text-sm text-sky-800">Setiap kelas yang dijadwalkan menjadi kelompok ujian dengan jendela waktu dan token sendiri. Jumlah peserta di bawah berasal dari keanggotaan kelas, bukan pendaftaran manual pada halaman ini.</p>
          </div>
        </section>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Kelas dijadwalkan</p><p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{jadwal.length}</p></div>
          <div className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Peserta terdata</p><p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{totalPeserta.toLocaleString("id-ID")}</p></div>
          <div className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Nilai minimum</p><p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{ujian.nilai_minimum}</p></div>
        </div>

        <section aria-labelledby="daftar-kelas" className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 px-4 py-4">
            <div><h2 id="daftar-kelas" className="font-semibold text-slate-900">Jadwal kelas</h2><p className="mt-0.5 text-xs text-slate-500">Informasi peserta bersifat baca saja.</p></div>
            <Link href={`/instruktur/master_ujian?ujian=${ujian.id}&jadwal=baru`} className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"><CalendarClock size={16} /> Atur jadwal</Link>
          </div>

          {jadwal.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><CalendarClock size={30} /></span>
              <p className="font-medium text-slate-800">Belum ada kelas yang dijadwalkan</p>
              <p className="max-w-md text-sm text-slate-500">Tambahkan jadwal kelas agar peserta dapat mengikuti ujian ini.</p>
              <Link href={`/instruktur/master_ujian?ujian=${ujian.id}&jadwal=baru`} className="mt-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">Tambah jadwal kelas</Link>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {adaDataKelasHilang && <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">Data beberapa kelas tidak tersedia. Jumlah peserta untuk kelas tersebut ditampilkan sebagai tanda hubung.</p>}
              {jadwal.map((item) => {
                const dataKelas = opsiKelas.get(item.kelas_id);
                return (
                  <article key={item.id} className="rounded-xl border border-orange-100 bg-orange-50/30 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-medium text-slate-900">{item.kelas}</h3>
                        <p className="mt-1 text-xs text-slate-500">{dataKelas?.materi ?? "Materi kelas tidak tersedia"}{dataKelas?.blc ? ` · ${dataKelas.blc}` : ""}</p>
                      </div>
                      <Link href={`/instruktur/master_ujian?ujian=${ujian.id}&jadwal=${item.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-100"><Pencil size={14} /> Edit jadwal</Link>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg bg-white p-3"><p className="text-xs font-medium text-slate-400">Peserta kelas</p><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-700"><Users size={15} className="text-orange-500" /> {dataKelas ? `${dataKelas.jumlah_peserta.toLocaleString("id-ID")} peserta terdaftar` : "—"}</p></div>
                      <div className="rounded-lg bg-white p-3"><p className="text-xs font-medium text-slate-400">Mulai</p><p className="mt-1 flex items-start gap-1.5 text-sm text-slate-700"><CalendarClock size={15} className="mt-0.5 shrink-0 text-orange-500" /> {formatTanggal(item.mulai)}</p></div>
                      <div className="rounded-lg bg-white p-3"><p className="text-xs font-medium text-slate-400">Selesai</p><p className="mt-1 flex items-start gap-1.5 text-sm text-slate-700"><Clock size={15} className="mt-0.5 shrink-0 text-orange-500" /> {formatTanggal(item.selesai)}</p></div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-500">Token kelas</span>
                      <TokenUjian token={item.token} />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
