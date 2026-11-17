"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck, CalendarDays, CheckCheck, CheckCircle2, ClipboardCheck, FilePlus2, ImagePlus, Info,
  Pencil, Phone, Save, Search, SearchX, Trash2, UserCheck, UserX, Users, X,
} from "lucide-react";

type Peserta = { id: number; nama: string; jk: "L" | "P"; phone: string; alamat: string; kategori: string };
type Status = "hadir" | "tidak";

// TODO: ganti dengan fetch ke API Laravel, mis. GET /api/kelas dan GET /api/kelas/{id}/peserta
const KELAS = [
  { id: 1, nama: "Aplikasi Perkantoran - Sesi 1" },
  { id: 2, nama: "Desain Grafis - Sesi 2" },
  { id: 3, nama: "Desain Web - Sesi 1" },
  { id: 4, nama: "Komputer Akuntansi - Sesi 3" },
];
const PESERTA: Record<number, Peserta[]> = {
  1: [
    { id: 1, nama: "Gita Herliana Safitri", jk: "P", phone: "082333683700", alamat: "Tambak Segaran Wetan 1/48", kategori: "SMA/SMK" },
    { id: 2, nama: "Intan Novianty", jk: "P", phone: "081936458024", alamat: "Komp Sidotopo Dipo 1/2-c", kategori: "SMA/SMK" },
    { id: 3, nama: "Meyva Berlian Harianto", jk: "P", phone: "082333683700", alamat: "Tambak Wedi Tengah 5/30", kategori: "SMA/SMK" },
  ],
  2: [
    { id: 4, nama: "Achmad Haikal Aditiya", jk: "L", phone: "085712345678", alamat: "Bogen 2/25", kategori: "SMA/SMK" },
    { id: 5, nama: "Aditia Sastra Widjaya", jk: "L", phone: "081234567890", alamat: "Setro 2/25", kategori: "SMA/SMK" },
  ],
};
// TODO: ganti dengan GET /api/absensi?kelas_id=&tanggal= (kosong/404 = entry baru, ada data = mode update)
const ABSENSI_TERSIMPAN: Record<string, Record<number, Status>> = {
  "1|2026-11-16": { 1: "hadir", 2: "tidak", 3: "hadir" },
};

const WARNA = [
  "bg-orange-100 text-orange-700", "bg-sky-100 text-sky-700", "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700", "bg-pink-100 text-pink-700", "bg-amber-100 text-amber-700",
];
const hariIni = () => new Date().toLocaleDateString("en-CA");
const fmt = (t: string) => t.split("-").reverse().join("/");

function Avatar({ nama }: { nama: string }) {
  const inisial = nama.split(" ").filter(Boolean).slice(0, 2).map((k) => k[0].toUpperCase()).join("");
  const warna = WARNA[[...nama].reduce((a, c) => a + c.charCodeAt(0), 0) % WARNA.length];
  return <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${warna}`}>{inisial}</span>;
}

export default function DaftarHadirPage() {
  const [kelasId, setKelasId] = useState("");
  const [kelasCari, setKelasCari] = useState("");
  const [bukaKelas, setBukaKelas] = useState(false);
  const [tanggal, setTanggal] = useState(hariIni());
  const [dicari, setDicari] = useState<{ kelasId: number; tanggal: string; update: boolean } | null>(null);
  const [hadir, setHadir] = useState<Record<number, Status>>({});
  const [cari, setCari] = useState("");
  const [foto, setFoto] = useState<{ file: File; url: string }[]>([]);
  const [pesan, setPesan] = useState("");
  const [sukses, setSukses] = useState<{ judul: string; detail: string } | null>(null);

  useEffect(() => {
    if (!sukses) return;
    const t = setTimeout(() => setSukses(null), 4000);
    return () => clearTimeout(t);
  }, [sukses]);

  const toast = (t: string) => { setPesan(t); setTimeout(() => setPesan(""), 3000); };

  const saranKelas = useMemo(() => {
    const q = kelasCari.trim().toLowerCase();
    return KELAS.filter((k) => !q || k.nama.toLowerCase().includes(q));
  }, [kelasCari]);

  const pilihKelas = (id: number | "") => {
    const k = KELAS.find((x) => x.id === id);
    setKelasId(k ? String(k.id) : "");
    setKelasCari(k ? k.nama : "");
    setBukaKelas(false);
  };

  const peserta = dicari ? PESERTA[dicari.kelasId] ?? [] : [];
  const jumlahHadir = peserta.filter((p) => hadir[p.id] === "hadir").length;

  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return peserta.filter((p) => !q || p.nama.toLowerCase().includes(q) || p.alamat.toLowerCase().includes(q));
  }, [peserta, cari]);

  const cariDaftar = () => {
    if (!kelasId) return toast("Pilih kelas dari daftar dulu.");
    const id = Number(kelasId);
    const tersimpan = ABSENSI_TERSIMPAN[`${id}|${tanggal}`];
    const awal: Record<number, Status> = {};
    (PESERTA[id] ?? []).forEach((p) => (awal[p.id] = tersimpan?.[p.id] ?? "hadir"));
    setHadir(awal);
    setCari("");
    setFoto([]);
    setDicari({ kelasId: id, tanggal, update: !!tersimpan });
  };

  const hadirSemua = () => setHadir((h) => Object.fromEntries(Object.keys(h).map((k) => [k, "hadir"])) as Record<number, Status>);

  const tambahFoto = (files: FileList | null) => {
    if (!files) return;
    const baru = Array.from(files).filter((f) => f.type.startsWith("image/")).map((file) => ({ file, url: URL.createObjectURL(file) }));
    setFoto((f) => [...f, ...baru]);
  };
  const hapusFoto = (i: number) => setFoto((f) => { URL.revokeObjectURL(f[i].url); return f.filter((_, x) => x !== i); });

  const simpan = () => {
    // TODO: kirim ke API Laravel (FormData: kelas_id, tanggal, kehadiran, foto[])
    // dicari.update ? PUT /api/absensi : POST /api/absensi
    setSukses({
      judul: dicari?.update ? "Daftar hadir diperbarui" : "Daftar hadir tersimpan",
      detail: `${jumlahHadir} hadir dari ${peserta.length} peserta · ${foto.length} foto`,
    });
  };

  const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Banner */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25"><ClipboardCheck size={28} /></span>
          <div>
            <h1 className="text-2xl font-semibold">Daftar hadir pelatihan</h1>
            <p className="text-sm text-orange-50">Isi atau perbarui kehadiran peserta per kelas dan tanggal.</p>
          </div>
        </div>

        {/* Form cari */}
        <section className="relative z-10 mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40">
          <div className="grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
            {/* Kelas (bisa dicari) */}
            <div className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><Users size={15} className="text-orange-500" /> Kelas</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                <input
                  type="text"
                  value={kelasCari}
                  onChange={(e) => { setKelasCari(e.target.value); setKelasId(""); setBukaKelas(true); }}
                  onFocus={() => setBukaKelas(true)}
                  onBlur={() => setBukaKelas(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); if (saranKelas[0]) pilihKelas(saranKelas[0].id); }
                    if (e.key === "Escape") setBukaKelas(false);
                  }}
                  placeholder="Cari / pilih kelas"
                  aria-label="Cari kelas"
                  autoComplete="off"
                  className={`${inputCls} pl-10 pr-9`}
                />
                {kelasCari && (
                  <button type="button" aria-label="Hapus kelas"
                    onMouseDown={(e) => { e.preventDefault(); pilihKelas(""); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-orange-100 hover:text-orange-600">
                    <X size={14} />
                  </button>
                )}
                {bukaKelas && (
                  <ul className="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-xl border border-orange-100 bg-white py-1 shadow-xl shadow-orange-200/50">
                    {saranKelas.map((k) => (
                      <li key={k.id}>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); pilihKelas(k.id); }}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-orange-50 ${String(k.id) === kelasId ? "font-medium text-orange-700" : "text-slate-700"}`}>
                          {k.nama}
                          {String(k.id) === kelasId && <BadgeCheck size={16} className="text-orange-500" />}
                        </button>
                      </li>
                    ))}
                    {saranKelas.length === 0 && <li className="px-3 py-2 text-sm text-slate-400">Kelas tidak ditemukan</li>}
                  </ul>
                )}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarDays size={15} className="text-orange-500" /> Tanggal absensi</span>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} suppressHydrationWarning className={inputCls} />
            </label>
            <button type="button" onClick={cariDaftar}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">
              <Search size={18} /> Cari daftar hadir
            </button>
          </div>
        </section>

        {dicari && (
          <>
            {dicari.update && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                <Info size={18} className="mt-0.5 shrink-0" />
                <p>Daftar hadir untuk kelas dan tanggal ini <b>sudah pernah disimpan</b>. Kehadiran di bawah dimuat dari data tersimpan, perubahan yang kamu simpan akan menimpa data lama.</p>
              </div>
            )}

            {/* Status form + statistik */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-lg shadow-orange-200/40">
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${dicari.update ? "bg-sky-100 text-sky-600" : "bg-orange-100 text-orange-600"}`}>
                  {dicari.update ? <Pencil size={24} /> : <FilePlus2 size={24} />}
                </span>
                <span className="cursor-default select-none">
                  <span className="block text-xs uppercase tracking-wide text-slate-400">Status form</span>
                  <span className="block text-lg font-semibold text-slate-900">{dicari.update ? "Mode update" : "Entry baru"}</span>
                  <span className="text-sm text-slate-500">{fmt(dicari.tanggal)}</span>
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-lg shadow-orange-200/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><UserCheck size={24} /></span>
                <span>
                  <span className="block text-2xl font-semibold tabular-nums text-slate-900">{jumlahHadir}</span>
                  <span className="text-sm text-slate-500">Hadir</span>
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-lg shadow-orange-200/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><UserX size={24} /></span>
                <span>
                  <span className="block text-2xl font-semibold tabular-nums text-slate-900">{peserta.length - jumlahHadir}</span>
                  <span className="text-sm text-slate-500">Tidak hadir</span>
                </span>
              </div>
            </div>

            {/* Daftar peserta */}
            <section className="mb-6 rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
              <div className="flex flex-wrap items-center gap-3 border-b border-orange-100 p-4">
                <div className="relative min-w-[220px] flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                  <input type="search" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama atau alamat" aria-label="Cari peserta"
                    className="w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60" />
                </div>
                <button type="button" onClick={hadirSemua}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
                  <CheckCheck size={16} /> Hadirkan semua
                </button>
              </div>

              {tampil.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={32} /></span>
                  <p className="font-medium text-slate-800">Peserta tidak ditemukan</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="bg-orange-50 text-orange-900">
                      <tr>
                        <th className="px-4 py-3 font-medium">Peserta</th>
                        <th className="px-4 py-3 font-medium">Telepon</th>
                        <th className="px-4 py-3 font-medium">Alamat</th>
                        <th className="px-4 py-3 font-medium">Kategori</th>
                        <th className="px-4 py-3 text-right font-medium">Kehadiran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-100">
                      {tampil.map((p) => (
                        <tr key={p.id} className="transition hover:bg-orange-50/60">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar nama={p.nama} />
                              <div>
                                <p className="font-medium text-slate-900">{p.nama}</p>
                                <p className="text-xs text-slate-500">{p.jk === "L" ? "Laki-laki" : "Perempuan"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600"><span className="inline-flex items-center gap-1.5"><Phone size={14} className="text-orange-400" />{p.phone}</span></td>
                          <td className="px-4 py-3 text-slate-600">{p.alamat}</td>
                          <td className="px-4 py-3"><span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">{p.kategori}</span></td>
                          <td className="px-4 py-3">
                            <div className="ml-auto flex w-fit rounded-xl border border-orange-100 bg-orange-50/40 p-1" role="group" aria-label={`Kehadiran ${p.nama}`}>
                              {(["hadir", "tidak"] as const).map((s) => (
                                <button key={s} type="button" onClick={() => setHadir((h) => ({ ...h, [p.id]: s }))} aria-pressed={hadir[p.id] === s}
                                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    hadir[p.id] === s
                                      ? s === "hadir" ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-600 text-white shadow-sm"
                                      : "text-slate-500 hover:text-orange-700"}`}>
                                  {s === "hadir" ? <BadgeCheck size={14} /> : <UserX size={14} />}
                                  {s === "hadir" ? "Hadir" : "Tidak"}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Foto kegiatan */}
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
                  Belum ada foto. Klik "Tambah foto" untuk mengunggah.
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
                <Save size={18} /> {dicari.update ? "Perbarui" : "Simpan"} daftar hadir
              </button>
            </div>
          </>
        )}
      </div>

      {/* Popup sukses */}
      {sukses && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setSukses(null)} role="alertdialog" aria-live="polite">
          <style>{`
            @keyframes pop { 0% { transform: scale(.6); opacity: 0 } 60% { transform: scale(1.05); opacity: 1 } 100% { transform: scale(1) } }
            @keyframes bar { from { width: 100% } to { width: 0% } }
          `}</style>
          <div onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl shadow-orange-300/50"
            style={{ animation: "pop .35s ease-out" }}>
            <button type="button" onClick={() => setSukses(null)} aria-label="Tutup"
              className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 hover:bg-orange-50 hover:text-orange-600"><X size={16} /></button>
            <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200/70" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={44} />
              </span>
            </span>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">{sukses.judul}</h3>
            <p className="mt-1 text-sm text-slate-500">{sukses.detail}</p>
            <button type="button" onClick={() => setSukses(null)}
              className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">
              Oke
            </button>
            <span className="absolute bottom-0 left-0 h-1 bg-orange-400" style={{ animation: "bar 4s linear forwards" }} />
          </div>
        </div>
      )}

      {pesan && <div role="status" className="fixed bottom-6 right-6 z-[60] rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{pesan}</div>}
    </main>
  );
}