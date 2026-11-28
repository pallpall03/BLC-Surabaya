"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle, BookOpen, CalendarClock, CheckCircle2, Clock, FileQuestion, LoaderCircle,
  Pencil, Plus, RefreshCw, Search, SearchX, Shuffle, Trash2, Users, X,
} from "lucide-react";
import {
  deleteUjian, getUjian, getUjianOpsi,
  type JadwalUjian, type Ujian, type UjianOpsi,
} from "@/lib/api";
import HeaderHalaman from "./components/headerhalaman";
import Paginasi from "./components/paginasi";
import ModalJadwal from "./components/modaljadwal";

type Filter = "semua" | "pretest" | "posttest";
type Pesan = { jenis: "sukses" | "error"; teks: string };
type JadwalTerbuka = { ujianId: number; jadwalId: number | null };

const PER_HALAMAN = 8;
const FILTER: { nilai: Filter; label: string }[] = [
  { nilai: "semua", label: "Semua" },
  { nilai: "pretest", label: "Pretest" },
  { nilai: "posttest", label: "Posttest" },
];
const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

function MasterUjianContent() {
  const searchParams = useSearchParams();
  const { showNotification } = useCrudNotification();
  const tautanAwal = useRef({
    ujian: Number(searchParams.get("ujian")),
    jadwal: searchParams.get("jadwal"),
  });
  const [ujian, setUjian] = useState<Ujian[]>([]);
  const [opsi, setOpsi] = useState<UjianOpsi>({ materi: [], kelas: [] });
  const [loading, setLoading] = useState(true);
  const [memuatOpsi, setMemuatOpsi] = useState(true);
  const [error, setError] = useState("");
  const [errorOpsi, setErrorOpsi] = useState("");
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [page, setPage] = useState(1);
  const [pesan, setPesan] = useState<Pesan | null>(null);
  const [menghapusId, setMenghapusId] = useState<number | null>(null);
  const [jadwalTerbuka, setJadwalTerbuka] = useState<JadwalTerbuka | null>(null);

  const terapkanTautan = useCallback((data: Ujian[]) => {
    const { ujian: ujianTautan, jadwal: jadwalTautan } = tautanAwal.current;
    if (!ujianTautan || !jadwalTautan) return;
    const ujianTujuan = data.find((item) => item.id === ujianTautan);
    if (!ujianTujuan) {
      setPesan({ jenis: "error", teks: "Ujian pada tautan tidak ditemukan." });
      return;
    }
    if (jadwalTautan === "baru") {
      setJadwalTerbuka({ ujianId: ujianTautan, jadwalId: null });
      return;
    }
    const jadwalTujuan = (ujianTujuan.jadwal ?? []).find((item) => item.id === Number(jadwalTautan));
    if (jadwalTujuan) setJadwalTerbuka({ ujianId: ujianTautan, jadwalId: jadwalTujuan.id });
    else setPesan({ jenis: "error", teks: "Jadwal pada tautan tidak ditemukan." });
  }, []);

  const muatUjian = useCallback(async () => {
    const res = await getUjian();
    const data = res.data ?? [];
    setUjian(data);
    terapkanTautan(data);
  }, [terapkanTautan]);

  const muatOpsi = useCallback(async () => {
    setMemuatOpsi(true);
    setErrorOpsi("");
    try {
      const res = await getUjianOpsi();
      setOpsi(res.data ?? { materi: [], kelas: [] });
    } catch (e) {
      setErrorOpsi(e instanceof Error ? e.message : "Pilihan kelas gagal dimuat.");
    } finally {
      setMemuatOpsi(false);
    }
  }, []);

  useEffect(() => {
    let aktif = true;
    void Promise.resolve().then(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getUjian();
        if (!aktif) return;
        const data = res.data ?? [];
        setUjian(data);
        terapkanTautan(data);
      } catch (e) {
        if (aktif) setError(e instanceof Error ? e.message : "Daftar ujian gagal dimuat.");
      } finally {
        if (aktif) setLoading(false);
      }
    });
    void Promise.resolve().then(muatOpsi);
    return () => { aktif = false; };
  }, [muatOpsi, terapkanTautan]);

  useEffect(() => {
    if (!pesan) return;
    const timer = setTimeout(() => setPesan(null), pesan.jenis === "error" ? 7000 : 4000);
    return () => clearTimeout(timer);
  }, [pesan]);

  const jumlahPeserta = useCallback((item: Ujian) => {
    const ids = new Set((item.jadwal ?? []).map((jadwal) => jadwal.kelas_id));
    return opsi.kelas.filter((kelas) => ids.has(kelas.id)).reduce((total, kelas) => total + kelas.jumlah_peserta, 0);
  }, [opsi.kelas]);

  const labelPeserta = (item: Ujian) => memuatOpsi || errorOpsi ? "—" : jumlahPeserta(item).toLocaleString("id-ID");

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return ujian.filter((item) => {
      const cocokTipe = filter === "semua" || item.tipe === filter;
      const teks = [item.judul, item.materi, ...(item.jadwal ?? []).flatMap((jadwal) => [jadwal.kelas, jadwal.token])]
        .filter(Boolean).join(" ").toLowerCase();
      return cocokTipe && (!q || teks.includes(q));
    });
  }, [ujian, cari, filter]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  const halaman = Math.min(page, totalHalaman);
  const baris = hasil.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  const refresh = async () => {
    setError("");
    try {
      await muatUjian();
    } catch (e) {
      setPesan({ jenis: "error", teks: e instanceof Error ? e.message : "Daftar ujian gagal diperbarui." });
    }
    await muatOpsi();
  };

  const hapusUjian = async (item: Ujian) => {
    if (!window.confirm(`Hapus ujian "${item.judul}"? Soal dan seluruh jadwal kelasnya juga akan dihapus.`)) return;
    setMenghapusId(item.id);
    setPesan(null);
    try {
      await deleteUjian(item.id);
      showNotification({ type: "success", title: "Ujian dihapus", message: `Ujian "${item.judul}" berhasil dihapus.` });
      await muatUjian();
    } catch (e) {
      const teks = e instanceof Error ? e.message : "Ujian gagal dihapus.";
      setPesan({ jenis: "error", teks });
      showNotification({ type: "error", title: "Ujian gagal dihapus", message: teks });
    } finally {
      setMenghapusId(null);
    }
  };

  const bukaJadwal = (item: Ujian, jadwal: JadwalUjian | null = null) => {
    setJadwalTerbuka({ ujianId: item.id, jadwalId: jadwal?.id ?? null });
  };

  const tutupJadwal = () => {
    setJadwalTerbuka(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const ujianJadwal = jadwalTerbuka ? ujian.find((item) => item.id === jadwalTerbuka.ujianId) : undefined;
  const jadwalAwal = jadwalTerbuka?.jadwalId !== null && jadwalTerbuka?.jadwalId !== undefined
    ? (ujianJadwal?.jadwal ?? []).find((item) => item.id === jadwalTerbuka.jadwalId) ?? null
    : null;

  const aksi = (item: Ujian) => (
    <div className="flex flex-wrap items-center gap-1.5">
      <button type="button" onClick={() => bukaJadwal(item)} className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600">
        <CalendarClock size={14} /> Jadwal
      </button>
      <Link href={`/instruktur/master_ujian/${item.id}/peserta`} className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100">
        <Users size={14} /> Kelas & peserta <span className="rounded-full bg-white/80 px-1.5 tabular-nums">{labelPeserta(item)}</span>
      </Link>
      <Link href={`/instruktur/master_ujian/${item.id}/ubah`} aria-label={`Ubah ${item.judul}`} title="Ubah ujian" className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"><Pencil size={16} /></Link>
      <button type="button" onClick={() => void hapusUjian(item)} disabled={menghapusId === item.id} aria-label={`Hapus ${item.judul}`} title="Hapus ujian"
        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
        {menghapusId === item.id ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <HeaderHalaman icon={FileQuestion} judul="Master ujian" deskripsi="Kelola pretest dan posttest, lalu jadwalkan ujian untuk kelas."
          aksi={<Link href="/instruktur/master_ujian/ujianbaru" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-700"><Plus size={18} /> Buat ujian baru</Link>} />

        {pesan && (
          <div role={pesan.jenis === "error" ? "alert" : "status"} className={`mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${pesan.jenis === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {pesan.jenis === "error" ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            <span className="flex-1">{pesan.teks}</span>
            <button type="button" onClick={() => setPesan(null)} aria-label="Tutup pesan" className="rounded p-0.5 hover:bg-black/5"><X size={16} /></button>
          </div>
        )}

        <section aria-label="Daftar master ujian" aria-busy={loading} className="rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
          <div className="flex flex-wrap items-center gap-3 border-b border-orange-100 p-4">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
              <input type="search" value={cari} onChange={(event) => { setCari(event.target.value); setPage(1); }} placeholder="Cari ujian, materi, kelas, atau token" aria-label="Cari ujian" className={inputCls} />
            </div>
            <div className="flex rounded-xl border border-orange-100 bg-orange-50/40 p-1" role="group" aria-label="Filter tipe ujian">
              {FILTER.map((item) => (
                <button key={item.nilai} type="button" onClick={() => { setFilter(item.nilai); setPage(1); }} aria-pressed={filter === item.nilai}
                  className={`rounded-lg px-3.5 py-1.5 text-sm transition ${filter === item.nilai ? "bg-orange-500 font-medium text-white shadow-sm" : "text-slate-500 hover:text-orange-700"}`}>{item.label}</button>
              ))}
            </div>
            <button type="button" onClick={() => void refresh()} disabled={loading} aria-label="Muat ulang daftar ujian" title="Muat ulang"
              className="rounded-xl border border-orange-200 p-2.5 text-orange-600 transition hover:bg-orange-50 disabled:opacity-40"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /></button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-slate-500" role="status"><LoaderCircle size={20} className="animate-spin text-orange-500" /> Memuat daftar ujian...</div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500"><AlertCircle size={28} /></span>
              <p className="font-medium text-slate-800">Daftar ujian gagal dimuat</p><p className="max-w-md text-sm text-slate-500">{error}</p>
              <button type="button" onClick={() => void refresh()} className="mt-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">Coba lagi</button>
            </div>
          ) : hasil.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">{ujian.length === 0 ? <FileQuestion size={32} /> : <SearchX size={32} />}</span>
              <p className="font-medium text-slate-800">{ujian.length === 0 ? "Belum ada ujian" : "Ujian tidak ditemukan"}</p>
              <p className="text-sm text-slate-500">{ujian.length === 0 ? "Buat ujian pertama, lalu atur jadwal kelasnya." : "Ubah kata kunci atau filter tipe ujian."}</p>
              {ujian.length === 0 && <Link href="/instruktur/master_ujian/ujianbaru" className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-800"><Plus size={16} /> Buat ujian baru</Link>}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[960px] text-left text-sm">
                  <thead className="bg-orange-50 text-orange-900"><tr>
                    <th className="px-4 py-3 font-medium">Ujian</th><th className="px-4 py-3 font-medium">Pengaturan</th>
                    <th className="px-4 py-3 font-medium">Kelas & jadwal</th><th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr></thead>
                  <tbody className="divide-y divide-orange-100">
                    {baris.map((item) => (
                      <tr key={item.id} className="align-top transition hover:bg-orange-50/60">
                        <td className="max-w-[330px] px-4 py-4">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.tipe === "pretest" ? "bg-sky-50 text-sky-700" : "bg-violet-50 text-violet-700"}`}>{item.tipe === "pretest" ? "Pretest" : "Posttest"}</span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.is_aktif ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{item.is_aktif ? "Aktif" : "Nonaktif"}</span>
                          </div>
                          <p className="font-medium text-slate-900">{item.judul}</p>
                          <p className="mt-1 flex items-start gap-1 text-xs text-slate-500"><BookOpen size={12} className="mt-0.5 shrink-0 text-orange-400" /> {item.materi ?? "Materi belum dipilih"}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <p className="flex items-center gap-1.5"><FileQuestion size={14} className="text-orange-400" /> {item.jumlah_soal} soal</p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500"><Clock size={13} className="text-orange-400" /> {item.durasi_menit} menit</p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500"><Shuffle size={13} className="text-orange-400" /> {item.acak_soal ? "Acak soal" : "Urut soal"}</p>
                          <p className="mt-1 text-xs text-slate-400">Nilai minimum {item.nilai_minimum}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <p className="flex items-center gap-1.5 font-medium text-slate-700"><CalendarClock size={14} className="text-orange-400" /> {item.jadwal?.length ?? 0} kelas</p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500"><Users size={13} className="text-orange-400" /> {labelPeserta(item)} peserta</p>
                          {item.jadwal?.[0] && <p className="mt-1.5 max-w-[220px] truncate text-xs text-slate-400" title={item.jadwal[0].kelas}>{item.jadwal[0].kelas}{item.jadwal.length > 1 ? ` +${item.jadwal.length - 1} kelas` : ""}</p>}
                        </td>
                        <td className="px-4 py-4"><div className="flex justify-end">{aksi(item)}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {baris.map((item) => (
                  <article key={item.id} className="rounded-xl border border-orange-100 bg-orange-50/30 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.tipe === "pretest" ? "bg-sky-50 text-sky-700" : "bg-violet-50 text-violet-700"}`}>{item.tipe === "pretest" ? "Pretest" : "Posttest"}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.is_aktif ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{item.is_aktif ? "Aktif" : "Nonaktif"}</span>
                    </div>
                    <h2 className="font-medium text-slate-900">{item.judul}</h2>
                    <p className="mt-1 text-xs text-slate-500">{item.materi ?? "Materi belum dipilih"}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5"><FileQuestion size={13} className="text-orange-400" /> {item.jumlah_soal} soal</span>
                      <span className="flex items-center gap-1.5"><Clock size={13} className="text-orange-400" /> {item.durasi_menit} menit</span>
                      <span className="flex items-center gap-1.5"><CalendarClock size={13} className="text-orange-400" /> {item.jadwal?.length ?? 0} kelas</span>
                      <span className="flex items-center gap-1.5"><Users size={13} className="text-orange-400" /> {labelPeserta(item)} peserta</span>
                    </div>
                    <div className="mt-4 border-t border-orange-100 pt-3">{aksi(item)}</div>
                  </article>
                ))}
              </div>
            </>
          )}
          {!loading && !error && <Paginasi page={halaman} setPage={setPage} jumlah={hasil.length} perPage={PER_HALAMAN} satuan="ujian" />}
        </section>
      </div>

      {ujianJadwal && jadwalTerbuka && (
        <ModalJadwal key={`${jadwalTerbuka.ujianId}-${jadwalTerbuka.jadwalId ?? "baru"}`} ujian={ujianJadwal} jadwalAwal={jadwalAwal}
          opsi={opsi} memuatOpsi={memuatOpsi} errorOpsi={errorOpsi} onMuatOpsi={() => void muatOpsi()} onPerubahan={refresh} onTutup={tutupJadwal} />
      )}
    </main>
  );
}

export default function MasterUjianPage() {
  return <Suspense fallback={<main className="min-h-screen bg-orange-50/60 px-4 py-16 text-center text-sm text-slate-500">Memuat halaman ujian...</main>}><MasterUjianContent /></Suspense>;
}
