"use client";

import { useMemo, useState } from "react";
import {
  Camera, CalendarDays, Clock, FileText, ImagePlus, Info, Pencil, FilePlus2,
  Printer, Save, Search, CheckSquare, Square, Trash2,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";

type Tab = "isi" | "laporan";
type FotoBaru = { file: File; url: string };
type FotoLaporan = { id: number; tanggal: string; sesi: number; keterangan: string; warna: string };

// TODO: ganti dengan data dari API
const SESI = [
  { id: 1, label: "1 (Jam: 07.30-09.00)" },
  { id: 2, label: "2 (Jam: 09.00-10.30)" },
  { id: 3, label: "3 (Jam: 10.30-12.00)" },
  { id: 4, label: "4 (Jam: 13.00-14.30)" },
];
// TODO: GET /api/foto-kegiatan?tanggal=&sesi= (ada data = mode update)
const TERSIMPAN: Record<string, string> = {
  "2026-11-17|1": "Pengunjung dengan jumlah 4 pelajar SD sedang memanfaatkan fasilitas",
};
// TODO: GET /api/laporan/foto-kegiatan?mulai=&sampai=  (isi url foto asli)
const DATA_LAPORAN: FotoLaporan[] = [
  { id: 1, tanggal: "2026-11-10", sesi: 4, keterangan: "Pengunjung dengan jumlah 4 pelajar SD sedang memanfaatkan fasilitas", warna: "from-orange-300 to-amber-200" },
  { id: 2, tanggal: "2026-11-12", sesi: 3, keterangan: "Pengunjung dengan jumlah 5 pelajar SMK mendaftar pelatihan", warna: "from-sky-300 to-cyan-200" },
  { id: 3, tanggal: "2026-11-16", sesi: 1, keterangan: "Pengunjung dengan jumlah 1 petugas kecamatan sedang memanfaatkan fasilitas", warna: "from-emerald-300 to-lime-200" },
];

const hariIni = () => new Date().toLocaleDateString("en-CA");
const awalBulan = () => hariIni().slice(0, 8) + "01";
const fmt = (t: string) => t.split("-").reverse().join("/");
const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

export default function FotoKegiatanPage() {
  const { showNotification } = useCrudNotification();
  const [tab, setTab] = useState<Tab>("isi");

  // Isi foto
  const [tanggal, setTanggal] = useState(hariIni());
  const [sesi, setSesi] = useState("1");
  const [aktif, setAktif] = useState<{ tanggal: string; sesi: string; update: boolean } | null>(null);
  const [ket, setKet] = useState("");
  const [foto, setFoto] = useState<FotoBaru[]>([]);

  // Laporan
  const [mulai, setMulai] = useState(awalBulan());
  const [sampai, setSampai] = useState(hariIni());
  const [dicari, setDicari] = useState<{ mulai: string; sampai: string } | null>(null);
  const [dipilih, setDipilih] = useState<Set<number>>(new Set());


  const cariForm = () => {
    if (!tanggal) {
      showNotification({ type: "error", title: "Pencarian gagal", message: "Isi tanggal kegiatan." });
      return;
    }
    const tersimpan = TERSIMPAN[`${tanggal}|${sesi}`];
    setKet(tersimpan ?? "Pengunjung dengan jumlah ");
    setFoto([]);
    setAktif({ tanggal, sesi, update: tersimpan !== undefined });
  };

  const tambahFoto = (files: FileList | null) => {
    if (!files) return;
    const baru = Array.from(files).filter((f) => f.type.startsWith("image/")).map((file) => ({ file, url: URL.createObjectURL(file) }));
    setFoto((f) => [...f, ...baru]);
  };
  const hapusFoto = (i: number) => setFoto((f) => { URL.revokeObjectURL(f[i].url); return f.filter((_, x) => x !== i); });

  const simpan = () => {
    if (!ket.trim()) {
      showNotification({ type: "error", title: "Foto kegiatan gagal disimpan", message: "Keterangan wajib diisi." });
      return;
    }
    // TODO: kirim FormData ke API Laravel (tanggal, sesi, keterangan, foto[])
    // aktif.update ? PUT : POST
    showNotification({
      type: "success",
      title: aktif!.update ? "Foto kegiatan diperbarui" : "Foto kegiatan tersimpan",
      message: `${fmt(aktif!.tanggal)} · sesi ${aktif!.sesi} · ${foto.length} foto baru berhasil disimpan.`,
    });
  };

  const hasilLaporan = useMemo(
    () => (dicari ? DATA_LAPORAN.filter((d) => d.tanggal >= dicari.mulai && d.tanggal <= dicari.sampai) : []),
    [dicari]
  );
  const cariLaporan = () => {
    if (!mulai || !sampai) {
      showNotification({ type: "error", title: "Pencarian gagal", message: "Isi tanggal mulai dan sampai." });
      return;
    }
    if (mulai > sampai) {
      showNotification({ type: "error", title: "Pencarian gagal", message: "Tanggal mulai tidak boleh melewati tanggal sampai." });
      return;
    }
    setDicari({ mulai, sampai });
    setDipilih(new Set());
  };
  const toggleFoto = (id: number) => setDipilih((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });
  const semuaDipilih = hasilLaporan.length > 0 && dipilih.size === hasilLaporan.length;
  const pilihSemua = () => setDipilih(semuaDipilih ? new Set() : new Set(hasilLaporan.map((f) => f.id)));

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Banner */}
        <div className="instruktur-page-header mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25"><Camera size={28} /></span>
          <div>
            <h1 className="text-2xl font-semibold">Foto kegiatan pengunjung</h1>
            <p className="text-sm text-orange-50">Isi atau perbarui foto kegiatan, dan lihat laporannya.</p>
          </div>
        </div>

        {/* Tab */}
        <div className="mb-6 flex w-fit rounded-xl border border-orange-100 bg-white p-1 shadow-md shadow-orange-200/40 print:hidden" role="tablist">
          {([["isi", ImagePlus, "Isi foto"], ["laporan", FileText, "Laporan foto"]] as const).map(([k, Icon, label]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm transition ${tab === k ? "bg-orange-500 font-medium text-white shadow-sm" : "text-slate-500 hover:text-orange-700"}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* ===== TAB ISI FOTO ===== */}
        {tab === "isi" && (
          <>
            <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40">
              <div className="grid gap-4 sm:grid-cols-[220px_1fr_auto] sm:items-end">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarDays size={15} className="text-orange-500" /> Tanggal kegiatan</span>
                  <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} suppressHydrationWarning className={inputCls} />
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><Clock size={15} className="text-orange-500" /> Sesi / jam</span>
                  <select value={sesi} onChange={(e) => setSesi(e.target.value)} className={inputCls}>
                    {SESI.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </label>
                <button type="button" onClick={cariForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">
                  <Search size={18} /> Cari foto kegiatan
                </button>
              </div>
            </section>

            {!aktif && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-white/60 px-4 py-14 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><Search size={30} /></span>
                <p className="text-sm text-slate-500">Pilih tanggal dan sesi, lalu klik &quot;Cari foto kegiatan&quot;.</p>
              </div>
            )}

            {aktif && (
              <>
                <div className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm ${aktif.update ? "border-sky-200 bg-sky-50 text-sky-800" : "border-orange-200 bg-orange-50 text-orange-800"}`}>
                  {aktif.update ? <Pencil size={18} className="mt-0.5 shrink-0" /> : <FilePlus2 size={18} className="mt-0.5 shrink-0" />}
                  <p>
                    <b>{aktif.update ? "Mode update" : "Entry baru"}</b> · {fmt(aktif.tanggal)} · sesi {aktif.sesi}.{" "}
                    {aktif.update ? "Data sudah pernah disimpan, perubahan akan menimpa data lama." : "Belum ada data untuk tanggal dan sesi ini."}
                  </p>
                </div>

                <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40">
                  <label htmlFor="ket" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><Info size={15} className="text-orange-500" /> Keterangan</label>
                  <textarea id="ket" rows={3} value={ket} onChange={(e) => setKet(e.target.value)} className={inputCls} />
                </section>

                <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><ImagePlus size={20} className="text-orange-500" /> Foto kegiatan</h2>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">
                      <ImagePlus size={16} /> Tambah foto
                      <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { tambahFoto(e.target.files); e.target.value = ""; }} />
                    </label>
                  </div>
                  {foto.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 py-10 text-center text-sm text-slate-500">
                      <ImagePlus size={32} className="text-orange-300" />
                      Belum ada foto. Klik &quot;Tambah foto&quot; untuk mengunggah.
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {foto.map((f, i) => (
                        <div key={f.url} className="group relative overflow-hidden rounded-xl border border-orange-100 shadow-md shadow-orange-200/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={f.url} alt={f.file.name} className="h-40 w-full object-cover transition group-hover:scale-105" />
                          <button type="button" onClick={() => hapusFoto(i)} aria-label="Hapus foto"
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-red-600 shadow transition hover:bg-red-50"><Trash2 size={15} /></button>
                          <p className="truncate bg-white px-3 py-1.5 text-xs text-slate-600">{f.file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <div className="flex justify-end">
                  <button type="button" onClick={simpan}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-700">
                    <Save size={18} /> {aktif.update ? "Perbarui" : "Simpan"} foto kegiatan
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ===== TAB LAPORAN FOTO ===== */}
        {tab === "laporan" && (
          <>
            <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40 print:hidden">
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
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

            {!dicari && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-white/60 px-4 py-14 text-center print:hidden">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><Search size={30} /></span>
                <p className="text-sm text-slate-500">Pilih rentang tanggal lalu klik &quot;Cari laporan&quot;.</p>
              </div>
            )}

            {dicari && (
              <section className="rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40 print:border-0 print:shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 p-4">
                  <div>
                    <h2 className="font-semibold text-slate-900">Laporan foto kegiatan pengunjung</h2>
                    <p className="text-sm text-slate-500">{fmt(dicari.mulai)} – {fmt(dicari.sampai)} · {dipilih.size} dipilih</p>
                  </div>
                  <div className="flex gap-2 print:hidden">
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

                {hasilLaporan.length === 0 ? (
                  <p className="px-4 py-14 text-center text-sm text-slate-500">Tidak ada foto pada rentang tanggal ini.</p>
                ) : (
                  <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    {hasilLaporan.map((f) => {
                      const on = dipilih.has(f.id);
                      return (
                        <article key={f.id}
                          className={`overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-200/50 ${on ? "border-orange-400 ring-4 ring-orange-200/60" : "border-orange-100"} ${dipilih.size > 0 && !on ? "print:hidden" : ""}`}>
                          <button type="button" onClick={() => toggleFoto(f.id)} aria-pressed={on} aria-label={`Pilih foto ${fmt(f.tanggal)}`} className="relative block w-full text-left">
                            {/* TODO: ganti dengan <img src={f.url} className="h-48 w-full object-cover" /> */}
                            <div className={`flex h-48 w-full items-center justify-center bg-gradient-to-br ${f.warna}`}><Camera size={40} className="text-white/80" /></div>
                            <span className="absolute left-3 top-3 rounded-lg bg-white/90 p-1 text-orange-500 shadow print:hidden">
                              {on ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-400" />}
                            </span>
                          </button>
                          <div className="p-4">
                            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"><CalendarDays size={14} className="text-orange-400" />{fmt(f.tanggal)} · Sesi {f.sesi}</h3>
                            <p className="mt-1 text-sm text-slate-600">{f.keterangan}</p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

    </main>
  );
}
