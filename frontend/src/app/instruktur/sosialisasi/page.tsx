"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, FileDown, ImagePlus,
  MapPin, Megaphone, Pencil, Plus, Save, Search, SearchX, Trash2, X, AlertCircle, FileText,
} from "lucide-react";

type Foto = { id: number; warna?: string; url?: string };
type Sosialisasi = { id: number; tanggal: string; sesi: number; lokasi: string; keterangan: string; foto: Foto[] };
type FotoBaru = { file: File; url: string };
type Form = { tanggal: string; sesi: string; lokasi: string; keterangan: string };
type Panel = { mode: "tambah" } | { mode: "ubah"; id: number } | null;

// TODO: ganti dengan data dari API
const SESI = [
  { id: 1, label: "1 (Jam: 07.30-09.00)" },
  { id: 2, label: "2 (Jam: 09.00-10.30)" },
  { id: 3, label: "3 (Jam: 10.30-12.00)" },
  { id: 4, label: "4 (Jam: 13.00-14.30)" },
];
// TODO: GET /api/sosialisasi?mulai=&sampai=  (isi foto[].url dengan foto asli)
const DATA_AWAL: Sosialisasi[] = [
  { id: 1, tanggal: "2026-11-03", sesi: 2, lokasi: "SDN Wonorejo 3", keterangan: "Sosialisasi bijak menggunakan gadget", foto: [{ id: 1, warna: "from-sky-300 to-cyan-200" }, { id: 2, warna: "from-orange-300 to-amber-200" }] },
  { id: 2, tanggal: "2026-11-10", sesi: 1, lokasi: "SMPN 12 Surabaya", keterangan: "Pengenalan pelatihan komputer untuk pelajar", foto: [{ id: 3, warna: "from-emerald-300 to-lime-200" }] },
  { id: 3, tanggal: "2026-11-14", sesi: 3, lokasi: "Balai RW 05 Gunung Anyar", keterangan: "Sosialisasi layanan BLC untuk warga", foto: [{ id: 4, warna: "from-violet-300 to-pink-200" }, { id: 5, warna: "from-amber-300 to-yellow-200" }, { id: 6, warna: "from-sky-300 to-indigo-200" }] },
  { id: 4, tanggal: "2026-07-21", sesi: 2, lokasi: "SDN Wonorejo 3", keterangan: "Sosialisasi bijak menggunakan gadget", foto: [{ id: 7, warna: "from-rose-300 to-orange-200" }] },
];

const KOSONG: Form = { tanggal: "", sesi: "1", lokasi: "", keterangan: "" };
const hariIni = () => new Date().toLocaleDateString("en-CA");
const awalBulan = () => hariIni().slice(0, 8) + "01";
const fmt = (t: string) => t.split("-").reverse().join("/");
const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/50";
const PER_HALAMAN = 6;

function Gambar({ f, className }: { f: Foto; className: string }) {
  if (f.url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={f.url} alt="Foto kegiatan" className={className} />;
  }
  return <div className={`flex items-center justify-center bg-gradient-to-br ${f.warna ?? "from-orange-300 to-amber-200"} ${className}`}><Camera size={32} className="text-white/80" /></div>;
}

export default function SosialisasiPage() {
  const [data, setData] = useState<Sosialisasi[]>(DATA_AWAL);
  const [mulai, setMulai] = useState(awalBulan());
  const [sampai, setSampai] = useState(hariIni());
  const [cari, setCari] = useState("");
  const [page, setPage] = useState(1);

  const [panel, setPanel] = useState<Panel>(null);
  const [form, setForm] = useState<Form>(KOSONG);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [fotoLama, setFotoLama] = useState<Foto[]>([]);
  const [fotoBaru, setFotoBaru] = useState<FotoBaru[]>([]);

  const [pesan, setPesan] = useState("");
  const [sukses, setSukses] = useState<{ judul: string; detail: string } | null>(null);

  useEffect(() => {
    if (!sukses) return;
    const t = setTimeout(() => setSukses(null), 3500);
    return () => clearTimeout(t);
  }, [sukses]);

  useEffect(() => {
    if (!panel) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") tutupPanel(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  });

  const toast = (t: string) => { setPesan(t); setTimeout(() => setPesan(""), 3000); };

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return data
      .filter((d) => (!mulai || d.tanggal >= mulai) && (!sampai || d.tanggal <= sampai))
      .filter((d) => !q || d.lokasi.toLowerCase().includes(q) || d.keterangan.toLowerCase().includes(q))
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [data, mulai, sampai, cari]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  const halaman = Math.min(page, totalHalaman);
  const baris = hasil.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);
  const adaFilter = cari !== "" || mulai !== awalBulan() || sampai !== hariIni();

  const reset = () => { setCari(""); setMulai(awalBulan()); setSampai(hariIni()); setPage(1); };

  const bersihkanFotoBaru = () => setFotoBaru((f) => { f.forEach((x) => URL.revokeObjectURL(x.url)); return []; });

  const bukaTambah = () => {
    setForm({ ...KOSONG, tanggal: hariIni() });
    setFotoLama([]); bersihkanFotoBaru(); setErrors({});
    setPanel({ mode: "tambah" });
  };
  const bukaUbah = (s: Sosialisasi) => {
    setForm({ tanggal: s.tanggal, sesi: String(s.sesi), lokasi: s.lokasi, keterangan: s.keterangan });
    setFotoLama(s.foto); bersihkanFotoBaru(); setErrors({});
    setPanel({ mode: "ubah", id: s.id });
  };
  function tutupPanel() { bersihkanFotoBaru(); setPanel(null); }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const tambahFoto = (files: FileList | null) => {
    if (!files) return;
    const baru = Array.from(files).filter((f) => f.type.startsWith("image/")).map((file) => ({ file, url: URL.createObjectURL(file) }));
    setFotoBaru((f) => [...f, ...baru]);
  };
  const hapusFotoBaru = (i: number) => setFotoBaru((f) => { URL.revokeObjectURL(f[i].url); return f.filter((_, x) => x !== i); });

  const simpan = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Partial<Record<keyof Form, string>> = {};
    if (!form.tanggal) e.tanggal = "Tanggal wajib diisi.";
    if (!form.lokasi.trim()) e.lokasi = "Lokasi wajib diisi.";
    if (!form.keterangan.trim()) e.keterangan = "Keterangan wajib diisi.";
    setErrors(e);
    if (Object.keys(e).length) return;

    // TODO: kirim FormData ke API Laravel (tanggal, sesi, lokasi, keterangan, foto[], foto_hapus[])
    // tambah: POST /api/sosialisasi, ubah: PUT /api/sosialisasi/{id}
    const fotoGabung: Foto[] = [
      ...fotoLama,
      ...fotoBaru.map((f, i) => ({ id: Date.now() + i, url: f.url })),
    ];
    const isi = { tanggal: form.tanggal, sesi: Number(form.sesi), lokasi: form.lokasi.trim(), keterangan: form.keterangan.trim(), foto: fotoGabung };

    if (panel?.mode === "ubah") {
      setData((d) => d.map((x) => (x.id === panel.id ? { ...x, ...isi } : x)));
      setSukses({ judul: "Sosialisasi diperbarui", detail: `${isi.lokasi} · ${fmt(isi.tanggal)}` });
    } else {
      setData((d) => [{ id: Math.max(0, ...d.map((x) => x.id)) + 1, ...isi }, ...d]);
      setSukses({ judul: "Sosialisasi tersimpan", detail: `${isi.lokasi} · ${fmt(isi.tanggal)}` });
    }
    setFotoBaru([]); // url sudah dipakai oleh data, jangan di-revoke
    setPanel(null);
  };

  const hapus = (s: Sosialisasi) => {
    if (!window.confirm(`Hapus sosialisasi di ${s.lokasi} (${fmt(s.tanggal)})?`)) return;
    // TODO: DELETE /api/sosialisasi/{id}
    setData((d) => d.filter((x) => x.id !== s.id));
    toast("Sosialisasi dihapus.");
  };

  const mode = panel?.mode;

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Banner */}
        <div className="instruktur-page-header mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25"><Megaphone size={28} /></span>
            <div>
              <h1 className="text-2xl font-semibold">Sosialisasi</h1>
              <p className="text-sm text-orange-50">Catat kegiatan sosialisasi beserta foto dan lokasinya.</p>
            </div>
          </div>
          <button type="button" onClick={bukaTambah}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-700">
            <Plus size={18} /> Tambah sosialisasi
          </button>
        </div>

        {/* Filter */}
        <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40 print:hidden">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarDays size={15} className="text-orange-500" /> Tanggal mulai</span>
              <input type="date" value={mulai} onChange={(e) => { setMulai(e.target.value); setPage(1); }} suppressHydrationWarning className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarDays size={15} className="text-orange-500" /> Tanggal sampai</span>
              <input type="date" value={sampai} onChange={(e) => { setSampai(e.target.value); setPage(1); }} suppressHydrationWarning className={inputCls} />
            </label>
            <div className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><Search size={15} className="text-orange-500" /> Cari</span>
              <input type="search" value={cari} onChange={(e) => { setCari(e.target.value); setPage(1); }} placeholder="Lokasi atau keterangan" aria-label="Cari sosialisasi" className={inputCls} />
            </div>
            <div className="flex gap-2">
              {adaFilter && (
                <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50"><X size={16} /> Reset</button>
              )}
              <button type="button" onClick={() => window.print()} disabled={hasil.length === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-50 disabled:opacity-40">
                <FileDown size={16} /> PDF
              </button>
            </div>
          </div>
        </section>

        {/* Judul cetak */}
        <div className="mb-4 hidden print:block">
          <h1 className="text-xl font-semibold">Laporan Kegiatan Sosialisasi</h1>
          <p className="text-sm">Periode {fmt(mulai)} – {fmt(sampai)}</p>
        </div>

        {/* Daftar */}
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500 print:hidden">
          <FileText size={15} className="text-orange-500" /> {hasil.length} sosialisasi pada {fmt(mulai)} – {fmt(sampai)}
        </div>

        {hasil.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-white/60 px-4 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={32} /></span>
            <p className="font-medium text-slate-800">Belum ada sosialisasi</p>
            <p className="text-sm text-slate-500">Ubah rentang tanggal, atau klik &quot;Tambah sosialisasi&quot;.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {baris.map((s) => (
                <article key={s.id} className="break-inside-avoid overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-lg shadow-orange-200/40 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-200/50">
                  <div className="relative">
                    {s.foto[0] ? <Gambar f={s.foto[0]} className="h-44 w-full object-cover" /> : (
                      <div className="flex h-44 w-full items-center justify-center bg-orange-50 text-orange-300"><Camera size={36} /></div>
                    )}
                    {s.foto.length > 1 && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs text-white"><Camera size={12} /> {s.foto.length}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 font-medium text-orange-700"><CalendarDays size={12} /> {fmt(s.tanggal)}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 font-medium text-sky-700"><Clock size={12} /> Sesi {s.sesi}</span>
                    </div>
                    <h3 className="flex items-start gap-1.5 font-semibold text-slate-900"><MapPin size={16} className="mt-0.5 shrink-0 text-orange-400" /> {s.lokasi}</h3>
                    <p className="mt-1 text-sm text-slate-600">{s.keterangan}</p>
                    <div className="mt-4 flex justify-end gap-1.5 border-t border-orange-100 pt-3 print:hidden">
                      <button type="button" onClick={() => bukaUbah(s)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-50"><Pencil size={15} /> Ubah</button>
                      <button type="button" onClick={() => hapus(s)} aria-label={`Hapus ${s.lokasi}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-600 print:hidden">
              <button type="button" onClick={() => setPage(halaman - 1)} disabled={halaman <= 1} aria-label="Sebelumnya" className="rounded-lg border border-orange-200 bg-white p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronLeft size={18} /></button>
              <span className="tabular-nums">{halaman} / {totalHalaman}</span>
              <button type="button" onClick={() => setPage(halaman + 1)} disabled={halaman >= totalHalaman} aria-label="Berikutnya" className="rounded-lg border border-orange-200 bg-white p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronRight size={18} /></button>
            </div>
          </>
        )}
      </div>

      {/* Popup di tengah: tambah / ubah */}
      <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 print:hidden ${panel ? "" : "pointer-events-none"}`}>
        <div onClick={tutupPanel} className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity ${panel ? "opacity-100" : "opacity-0"}`} />
        <aside className={`relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-orange-300/50 transition duration-200 ${panel ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          role="dialog" aria-modal="true" aria-label={mode === "ubah" ? "Ubah sosialisasi" : "Tambah sosialisasi"}>
          <div className="instruktur-modal-header flex items-center gap-3 bg-gradient-to-br from-orange-500 to-amber-400 p-5 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/25">{mode === "ubah" ? <Pencil size={22} /> : <Plus size={22} />}</span>
            <div className="mr-auto">
              <h2 className="font-semibold">{mode === "ubah" ? "Ubah sosialisasi" : "Tambah sosialisasi"}</h2>
              <p className="text-sm text-orange-50">{mode === "ubah" ? "Perbarui data dan foto kegiatan." : "Isi data kegiatan sosialisasi."}</p>
            </div>
            <button type="button" onClick={tutupPanel} aria-label="Tutup" className="rounded-lg p-1.5 hover:bg-white/20"><X size={20} /></button>
          </div>

          <form onSubmit={simpan} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="s-tanggal" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarDays size={15} className="text-orange-500" /> Tanggal</label>
                  <input id="s-tanggal" type="date" value={form.tanggal} onChange={(e) => set("tanggal", e.target.value)} aria-invalid={!!errors.tanggal} suppressHydrationWarning className={inputCls} />
                  {errors.tanggal && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {errors.tanggal}</p>}
                </div>
                <div>
                  <label htmlFor="s-sesi" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><Clock size={15} className="text-orange-500" /> Sesi / jam</label>
                  <select id="s-sesi" value={form.sesi} onChange={(e) => set("sesi", e.target.value)} className={inputCls}>
                    {SESI.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="s-lokasi" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><MapPin size={15} className="text-orange-500" /> Lokasi</label>
                <input id="s-lokasi" value={form.lokasi} onChange={(e) => set("lokasi", e.target.value)} placeholder="Contoh: SDN Wonorejo 3" aria-invalid={!!errors.lokasi} className={inputCls} />
                {errors.lokasi && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {errors.lokasi}</p>}
              </div>

              <div>
                <label htmlFor="s-ket" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><FileText size={15} className="text-orange-500" /> Keterangan</label>
                <textarea id="s-ket" rows={4} value={form.keterangan} onChange={(e) => set("keterangan", e.target.value)} placeholder="Isi kegiatan sosialisasi" aria-invalid={!!errors.keterangan} className={inputCls} />
                {errors.keterangan && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {errors.keterangan}</p>}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700"><ImagePlus size={15} className="text-orange-500" /> Foto kegiatan</span>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white shadow-md shadow-orange-300/50 transition hover:bg-orange-600">
                    <ImagePlus size={15} /> Tambah foto
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { tambahFoto(e.target.files); e.target.value = ""; }} />
                  </label>
                </div>
                {fotoLama.length + fotoBaru.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 py-8 text-center text-sm text-slate-500">
                    <ImagePlus size={30} className="text-orange-300" /> Belum ada foto.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {fotoLama.map((f) => (
                      <div key={f.id} className="group relative overflow-hidden rounded-xl border border-orange-100 shadow-md shadow-orange-200/40">
                        <Gambar f={f} className="h-24 w-full object-cover" />
                        <button type="button" onClick={() => setFotoLama((x) => x.filter((y) => y.id !== f.id))} aria-label="Hapus foto"
                          className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-red-600 shadow hover:bg-red-50"><Trash2 size={13} /></button>
                      </div>
                    ))}
                    {fotoBaru.map((f, i) => (
                      <div key={f.url} className="relative overflow-hidden rounded-xl border border-green-200 shadow-md shadow-orange-200/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.url} alt={f.file.name} className="h-24 w-full object-cover" />
                        <span className="absolute left-1.5 top-1.5 rounded-full bg-green-600 px-1.5 py-0.5 text-[10px] font-medium text-white">Baru</span>
                        <button type="button" onClick={() => hapusFotoBaru(i)} aria-label="Hapus foto"
                          className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-red-600 shadow hover:bg-red-50"><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-orange-100 bg-white p-4">
              <button type="button" onClick={tutupPanel} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Batal</button>
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-green-600/30 hover:bg-green-700">
                <Save size={18} /> {mode === "ubah" ? "Perbarui" : "Simpan"}
              </button>
            </div>
          </form>
        </aside>
      </div>

      {/* Popup sukses */}
      {sukses && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm print:hidden" onClick={() => setSukses(null)} role="alertdialog" aria-live="polite">
          <style>{`
            @keyframes pop { 0% { transform: scale(.6); opacity: 0 } 60% { transform: scale(1.05); opacity: 1 } 100% { transform: scale(1) } }
            @keyframes bar { from { width: 100% } to { width: 0% } }
          `}</style>
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl shadow-orange-300/50" style={{ animation: "pop .35s ease-out" }}>
            <button type="button" onClick={() => setSukses(null)} aria-label="Tutup" className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 hover:bg-orange-50 hover:text-orange-600"><X size={16} /></button>
            <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200/70" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={44} /></span>
            </span>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">{sukses.judul}</h3>
            <p className="mt-1 text-sm text-slate-500">{sukses.detail}</p>
            <button type="button" onClick={() => setSukses(null)} className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">Oke</button>
            <span className="absolute bottom-0 left-0 h-1 bg-orange-400" style={{ animation: "bar 3.5s linear forwards" }} />
          </div>
        </div>
      )}

      {pesan && <div role="status" className="fixed bottom-6 right-6 z-[80] rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg print:hidden">{pesan}</div>}
    </main>
  );
}
