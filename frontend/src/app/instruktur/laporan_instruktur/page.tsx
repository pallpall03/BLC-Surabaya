"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays, Camera, ChevronLeft, ChevronRight, ClipboardList,
  FileText, Printer, Users,
} from "lucide-react";
import {
  getFotoKegiatan, getFotoKegiatanOpsi, getPengunjung,
  type FotoKegiatan as FotoKegiatanData, type Pengunjung,
} from "@/lib/api";
import FotoKegiatan from "@/components/fotokegiatan";
import FotoDokumentasi from "@/components/shared/FotoDokumentasi";

type Tab = "laporan" | "foto";
type Opsi = { blc: { id: number; nama: string }[]; sesi: { id: number; sesi: number; jam: string }[] };

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";
const tombolPanah = "rounded-lg border border-orange-200 p-2 text-slate-600 transition hover:bg-orange-50";

const bulanLokal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const namaBulan = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return `${BULAN[m - 1]} ${y}`;
};
const geser = (ym: string, n: number) => {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const rentangBulan = (ym: string) => {
  const [tahun, bulan] = ym.split("-").map(Number);
  return {
    mulai: `${ym}-01`,
    sampai: `${ym}-${String(new Date(tahun, bulan, 0).getDate()).padStart(2, "0")}`,
  };
};
const formatTanggal = (tanggal: string) => new Intl.DateTimeFormat("id-ID", {
  weekday: "short", day: "2-digit", month: "short", year: "numeric",
}).format(new Date(`${tanggal}T00:00:00`));

export default function LaporanInstrukturPage() {
  const [tab, setTab] = useState<Tab>("laporan");
  const [bulan, setBulan] = useState(bulanLokal);
  const [filterBlc, setFilterBlc] = useState("");
  const [filterSesi, setFilterSesi] = useState("");
  const [opsi, setOpsi] = useState<Opsi>({ blc: [], sesi: [] });
  const [foto, setFoto] = useState<FotoKegiatanData[]>([]);
  const [pengunjung, setPengunjung] = useState<Pengunjung[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [namaInstruktur, setNamaInstruktur] = useState("Instruktur");
  const [coba, setCoba] = useState(0);
  const permintaan = useRef(0);

  const { mulai, sampai } = useMemo(() => rentangBulan(bulan), [bulan]);
  const params = useMemo(() => ({
    mulai,
    sampai,
    lokasi_blc_id: filterBlc ? Number(filterBlc) : undefined,
    sesi_id: filterSesi ? Number(filterSesi) : undefined,
  }), [mulai, sampai, filterBlc, filterSesi]);

  const muatLaporan = useCallback(async () => {
    const idPermintaan = ++permintaan.current;
    setLoading(true);
    setError("");
    try {
      const [resFoto, resPengunjung] = await Promise.all([
        getFotoKegiatan(params),
        getPengunjung(params),
      ]);
      if (idPermintaan !== permintaan.current) return;
      setFoto(resFoto.data ?? []);
      setPengunjung(resPengunjung.data ?? []);
    } catch (e) {
      if (idPermintaan === permintaan.current) {
        setError(e instanceof Error ? e.message : "Laporan pengunjung gagal dimuat.");
        setFoto([]);
        setPengunjung([]);
      }
    } finally {
      if (idPermintaan === permintaan.current) setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    let aktif = true;
    void Promise.resolve().then(() => {
      if (!aktif) return;
      try {
        const user = JSON.parse(localStorage.getItem("auth_user") ?? "null") as { name?: unknown } | null;
        if (typeof user?.name === "string" && user.name.trim()) setNamaInstruktur(user.name.trim());
      } catch {
        setNamaInstruktur("Instruktur");
      }
    });
    getFotoKegiatanOpsi().then((res) => {
      if (aktif) setOpsi(res.data);
    }).catch(() => {
      if (aktif) setOpsi({ blc: [], sesi: [] });
    });
    return () => { aktif = false; };
  }, []);

  useEffect(() => {
    void Promise.resolve().then(muatLaporan);
  }, [muatLaporan, coba]);

  const jumlahPengunjung = useCallback((item: FotoKegiatanData) => pengunjung.filter((pengunjungItem) =>
    pengunjungItem.tanggal === item.tanggal &&
    pengunjungItem.lokasi_blc_id === item.lokasi_blc_id &&
    (pengunjungItem.sesi_id ?? pengunjungItem.sesi) === (item.sesi_id ?? item.sesi)
  ).length, [pengunjung]);

  const pindahTab = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const tabs: Tab[] = ["laporan", "foto"];
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setTab(tabs[next]);
    document.getElementById(`pengunjung-tab-${tabs[next]}`)?.focus();
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-6 sm:px-8 sm:py-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="instruktur-page-header flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25"><ClipboardList size={28} /></span>
            <div>
              <h1 className="text-2xl font-semibold">Aktivitas &amp; Laporan Pengunjung</h1>
              <p className="mt-1 text-sm text-orange-50">Catat aktivitas pelayanan, unggah foto, dan cetak laporan pengunjung per bulan.</p>
            </div>
          </div>
          <span className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"><span className="text-slate-400">Instruktur: </span><span className="font-medium text-slate-800">{namaInstruktur}</span></span>
        </header>

        <div className="flex w-full rounded-xl border border-orange-100 bg-white p-1 shadow-md sm:w-fit print:hidden" role="tablist" aria-label="Laporan pengunjung">
          {([["laporan", ClipboardList, "Laporan aktivitas"], ["foto", Camera, "Input foto & kegiatan"]] as const).map(([key, Icon, label], index) => (
            <button key={key} id={`pengunjung-tab-${key}`} type="button" role="tab" aria-selected={tab === key} aria-controls={`pengunjung-panel-${key}`} tabIndex={tab === key ? 0 : -1} onKeyDown={(event) => pindahTab(event, index)} onClick={() => setTab(key)} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm transition sm:flex-none ${tab === key ? "bg-orange-500 font-medium text-white shadow-sm" : "text-slate-500 hover:text-orange-700"}`}><Icon size={17} /> {label}</button>
          ))}
        </div>

        <section id="pengunjung-panel-laporan" role="tabpanel" aria-labelledby="pengunjung-tab-laporan" hidden={tab !== "laporan"} className="space-y-6">
          <div className="hidden text-center print:block">
            <h2 className="text-xl font-bold">Laporan Aktivitas Pengunjung BLC Surabaya</h2>
            <p className="mt-1 text-sm">Nama: {namaInstruktur} · Bulan: {namaBulan(bulan)}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-white p-4 shadow-lg shadow-orange-200/40 print:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setBulan(geser(bulan, -1))} aria-label="Bulan sebelumnya" className={tombolPanah}><ChevronLeft size={18} /></button>
              <div className="relative">
                <CalendarDays size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                <input type="month" value={bulan} onChange={(event) => event.target.value && setBulan(event.target.value)} aria-label="Pilih bulan" className={`${inputCls} w-auto py-2 pl-10 pr-3 font-medium`} />
              </div>
              <button type="button" onClick={() => setBulan(geser(bulan, 1))} aria-label="Bulan berikutnya" className={tombolPanah}><ChevronRight size={18} /></button>
              <span className="ml-2 hidden text-sm font-semibold text-slate-800 sm:inline">{namaBulan(bulan)}</span>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <select value={filterBlc} onChange={(event) => setFilterBlc(event.target.value)} aria-label="Filter BLC" className={`${inputCls} w-auto min-w-36`}>
                <option value="">Semua BLC</option>
                {opsi.blc.map((item) => <option key={item.id} value={item.id}>{item.nama}</option>)}
              </select>
              <select value={filterSesi} onChange={(event) => setFilterSesi(event.target.value)} aria-label="Filter sesi" className={`${inputCls} w-auto min-w-32`}>
                <option value="">Semua sesi</option>
                {opsi.sesi.map((item) => <option key={item.id} value={item.id}>Sesi {item.sesi}</option>)}
              </select>
              <button type="button" onClick={() => window.print()} disabled={loading || foto.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50 disabled:opacity-40"><Printer size={16} /> Cetak</button>
            </div>
          </div>

          {loading ? (
            <div role="status" className="rounded-2xl border border-orange-200 bg-white px-4 py-16 text-center shadow-lg shadow-orange-200/40"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" /><p className="mt-4 text-sm text-slate-500">Memuat laporan pengunjung...</p></div>
          ) : error ? (
            <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-white px-4 py-14 text-center shadow-lg shadow-orange-200/40"><FileText size={32} className="text-red-500" /><p className="font-medium text-slate-800">Laporan pengunjung belum dapat dimuat</p><p className="max-w-md text-sm text-slate-500">{error}</p><button type="button" onClick={() => setCoba((n) => n + 1)} className="mt-1 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50 print:hidden">Coba lagi</button></div>
          ) : foto.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-16 text-center shadow-lg shadow-orange-200/40 print:shadow-none"><Camera size={36} className="text-orange-400" /><p className="font-medium text-slate-800">Belum ada aktivitas pengunjung pada periode ini</p><p className="max-w-md text-sm text-slate-500">Tambahkan aktivitas beserta foto melalui tab Input foto &amp; kegiatan. Tab ini hanya menampilkan hasil entry tersebut.</p></div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-orange-200 bg-white shadow-lg shadow-orange-200/40 print:shadow-none">
              <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
                <thead className="bg-orange-50 text-orange-900"><tr>
                  <th scope="col" className="w-36 px-4 py-3 font-medium">Tanggal</th>
                  <th scope="col" className="w-40 px-4 py-3 font-medium">BLC / sesi</th>
                  <th scope="col" className="w-28 px-4 py-3 font-medium">Pengunjung</th>
                  <th scope="col" className="px-4 py-3 font-medium">Laporan kegiatan</th>
                  <th scope="col" className="w-[420px] px-4 py-3 font-medium">Foto kegiatan</th>
                </tr></thead>
                <tbody>
                  {foto.map((item) => (
                    <tr key={item.id} className="border-t border-orange-100 align-top print:break-inside-avoid">
                      <td className="px-4 py-4 font-medium text-slate-800">{formatTanggal(item.tanggal)}</td>
                      <td className="px-4 py-4"><span className="block font-medium text-slate-800">{item.blc ?? "BLC telah dihapus"}</span><span className="mt-1 block text-xs text-slate-500">Sesi {item.sesi ?? "-"}</span></td>
                      <td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold tabular-nums text-emerald-700"><Users size={14} /> {jumlahPengunjung(item)}</span></td>
                      <td className="max-w-md px-4 py-4 text-slate-700">{item.keterangan || <span className="text-slate-400">Tanpa keterangan</span>}</td>
                      <td className="px-4 py-4">
                        {item.foto_url.length > 0 ? (
                          <div className="flex max-w-[420px] flex-wrap gap-2">
                            {item.foto_url.map((url, index) => (
                              <figure key={`${item.id}-${url}`} className="w-24 shrink-0">
                                <FotoDokumentasi src={url} alt={`Foto kegiatan ${index + 1}, ${formatTanggal(item.tanggal)}`} width={96} height={72} className="h-[72px] w-24 rounded-lg object-cover" />
                                <figcaption className="mt-1 truncate text-[10px] text-slate-500" title={item.foto_deskripsi[index] || undefined}>{item.foto_deskripsi[index] || `Foto ${index + 1}`}</figcaption>
                              </figure>
                            ))}
                          </div>
                        ) : <span className="text-slate-400">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {foto.length > 0 && !loading && (
            <div className="hidden justify-end pt-8 print:flex"><div className="w-64 text-center text-sm"><p>Surabaya, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p><p className="mt-1">Instruktur,</p><div className="h-20" /><p className="font-semibold underline">{namaInstruktur}</p></div></div>
          )}
        </section>

        <section id="pengunjung-panel-foto" role="tabpanel" aria-labelledby="pengunjung-tab-foto" hidden={tab !== "foto"}>
          <FotoKegiatan onPerubahan={muatLaporan} />
        </section>
      </div>
    </main>
  );
}
