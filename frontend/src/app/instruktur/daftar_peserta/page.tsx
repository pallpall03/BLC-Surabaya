"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, ChevronLeft, ChevronRight, CircleDashed, Fingerprint, LayoutGrid, LayoutList,
  MapPin, Mars, Pencil, Plus, Search, SearchX, Trash2, Users, Venus, X,
  type LucideIcon,
} from "lucide-react";

type Peserta = { id: number; nik: string; nama: string; blc: string; jk: "L" | "P"; tervalidasi: boolean };
type StatusFilter = "semua" | "valid" | "non";

// TODO: ganti dengan fetch ke API Laravel, mis. GET /api/peserta
const DATA_AWAL: Peserta[] = [
  { id: 1, nik: "0", nama: "Ahmat Ilham Khoirut Difin", blc: "Gunung Anyar", jk: "L", tervalidasi: true },
  { id: 2, nik: "00", nama: "Imelda", blc: "Gunung Anyar", jk: "P", tervalidasi: true },
  { id: 3, nik: "000", nama: "Aurelia Azzahra", blc: "Gunung Anyar", jk: "P", tervalidasi: true },
  { id: 4, nik: "0000", nama: "Javier Arsy Maulana", blc: "Bendul Merisi", jk: "L", tervalidasi: false },
  { id: 5, nik: "00000", nama: "Sridah Winarsih", blc: "Bendul Merisi", jk: "P", tervalidasi: false },
  { id: 6, nik: "000000", nama: "Roy Dwi Kusuma", blc: "Bendul Merisi", jk: "L", tervalidasi: true },
];

const WARNA_AVATAR = [
  "bg-orange-100 text-orange-700", "bg-sky-100 text-sky-700", "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700", "bg-pink-100 text-pink-700", "bg-amber-100 text-amber-700",
];

function Avatar({ nama, besar }: { nama: string; besar?: boolean }) {
  const inisial = nama.split(" ").filter(Boolean).slice(0, 2).map((k) => k[0].toUpperCase()).join("");
  const warna = WARNA_AVATAR[[...nama].reduce((a, c) => a + c.charCodeAt(0), 0) % WARNA_AVATAR.length];
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${warna} ${besar ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm"}`}>
      {inisial}
    </span>
  );
}

function StatusBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <BadgeCheck size={14} /> Tervalidasi
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      <CircleDashed size={14} /> Non validasi
    </span>
  );
}

function Aksi({ p, onValidasi, onHapus }: { p: Peserta; onValidasi: () => void; onHapus: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button type="button" onClick={onValidasi}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
          p.tervalidasi ? "text-slate-500 hover:bg-slate-100" : "bg-green-600 text-white shadow-sm hover:bg-green-700"}`}>
        {p.tervalidasi ? "Batalkan" : "Validasi"}
      </button>
      <button type="button" aria-label={`Ubah ${p.nama}`} title="Ubah"
        // TODO: buka halaman ubah peserta
        className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600">
        <Pencil size={16} />
      </button>
      <button type="button" onClick={onHapus} aria-label={`Hapus ${p.nama}`} title="Hapus"
        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function DaftarPesertaPage() {
  const [data, setData] = useState<Peserta[]>(DATA_AWAL);
  const [cari, setCari] = useState("");
  const [area, setArea] = useState("");
  const [cariArea, setCariArea] = useState("");
  const [bukaArea, setBukaArea] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("semua");
  const [tampilan, setTampilan] = useState<"tabel" | "kartu">("tabel");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [pesan, setPesan] = useState("");

  const daftarArea = useMemo(() => Array.from(new Set(data.map((d) => d.blc))).sort(), [data]);
  const jumlahValid = data.filter((d) => d.tervalidasi).length;

  const saranArea = useMemo(
    () => daftarArea.filter((a) => a.toLowerCase().includes(cariArea.trim().toLowerCase())),
    [daftarArea, cariArea]
  );

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    const qa = cariArea.trim().toLowerCase();
    return data.filter(
      (d) =>
        (!q || d.nama.toLowerCase().includes(q) || d.nik.includes(q)) &&
        (area ? d.blc === area : !qa || d.blc.toLowerCase().includes(qa)) &&
        (status === "semua" || (status === "valid") === d.tervalidasi)
    );
  }, [data, cari, area, cariArea, status]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / perPage));
  const halaman = Math.min(page, totalHalaman);
  const mulai = (halaman - 1) * perPage;
  const baris = hasil.slice(mulai, mulai + perPage);
  const adaFilter = cari !== "" || area !== "" || cariArea !== "" || status !== "semua";

  const ubah = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setPage(1); };
  const reset = () => { setCari(""); setArea(""); setCariArea(""); setStatus("semua"); setPage(1); };
  const pilihArea = (a: string) => { setArea(a); setCariArea(a); setBukaArea(false); setPage(1); };

  const tampilkanPesan = (teks: string) => { setPesan(teks); setTimeout(() => setPesan(""), 3000); };
  const toggleValidasi = (id: number) => setData((d) => d.map((p) => (p.id === id ? { ...p, tervalidasi: !p.tervalidasi } : p)));
  const hapus = (p: Peserta) => {
    if (!window.confirm(`Hapus peserta ${p.nama}?`)) return;
    setData((d) => d.filter((x) => x.id !== p.id));
    tampilkanPesan("Peserta dihapus.");
  };

  const statistik: { kunci: StatusFilter; label: string; nilai: number; icon: LucideIcon; warna: string; aktif: string }[] = [
    { kunci: "semua", label: "Semua peserta", nilai: data.length, icon: Users, warna: "bg-orange-100 text-orange-600", aktif: "border-orange-400 ring-4 ring-orange-200/60" },
    { kunci: "valid", label: "Tervalidasi", nilai: jumlahValid, icon: BadgeCheck, warna: "bg-emerald-100 text-emerald-600", aktif: "border-emerald-400 ring-4 ring-emerald-200/60" },
    { kunci: "non", label: "Belum validasi", nilai: data.length - jumlahValid, icon: CircleDashed, warna: "bg-slate-100 text-slate-500", aktif: "border-slate-400 ring-4 ring-slate-200" },
  ];

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25"><Users size={28} /></span>
            <div>
              <h1 className="text-2xl font-semibold">Daftar peserta pelatihan</h1>
              <p className="text-sm text-orange-50">Kelola dan validasi peserta di area BLC kamu.</p>
            </div>
          </div>
          <Link href="/instruktur/daftar_peserta/tambah_peserta"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-700">
            <Plus size={18} /> Tambah peserta
          </Link>
        </div>

        {/* Kartu statistik (bisa diklik untuk memfilter) */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {statistik.map(({ kunci, label, nilai, icon: Icon, warna, aktif }) => (
            <button key={kunci} type="button" onClick={() => ubah(setStatus)(kunci)} aria-pressed={status === kunci}
              className={`flex items-center gap-4 rounded-2xl border bg-white p-5 text-left shadow-lg shadow-orange-200/40 transition hover:-translate-y-0.5 ${status === kunci ? aktif : "border-orange-100"}`}>
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${warna}`}><Icon size={24} /></span>
              <span>
                <span className="block text-2xl font-semibold tabular-nums text-slate-900">{nilai}</span>
                <span className="text-sm text-slate-500">{label}</span>
              </span>
            </button>
          ))}
        </div>

        <section className="rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
          {/* Pencarian & filter */}
          <div className="border-b border-orange-100 p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Cari nama / NIK */}
              <div className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                <input type="search" value={cari} onChange={(e) => ubah(setCari)(e.target.value)}
                  placeholder="Cari nama atau NIK peserta" aria-label="Cari nama atau NIK peserta"
                  className="w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60" />
              </div>

              {/* Cari area BLC */}
              <div className="relative w-full sm:w-56">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                <input
                  type="text"
                  value={cariArea}
                  onChange={(e) => { setCariArea(e.target.value); setArea(""); setPage(1); setBukaArea(true); }}
                  onFocus={() => setBukaArea(true)}
                  onBlur={() => setBukaArea(false)}
                  placeholder="Cari area BLC"
                  aria-label="Cari area BLC"
                  className="w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-9 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60"
                />
                {cariArea && (
                  <button type="button" aria-label="Hapus area"
                    onMouseDown={(e) => { e.preventDefault(); pilihArea(""); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-orange-100 hover:text-orange-600">
                    <X size={14} />
                  </button>
                )}
                {bukaArea && (
                  <ul className="absolute z-20 mt-1.5 max-h-56 w-full overflow-auto rounded-xl border border-orange-100 bg-white py-1 shadow-xl shadow-orange-200/50">
                    <li>
                      <button type="button" onMouseDown={(e) => { e.preventDefault(); pilihArea(""); }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-600 hover:bg-orange-50">
                        Semua area <span className="text-xs text-slate-400">{data.length}</span>
                      </button>
                    </li>
                    {saranArea.map((a) => (
                      <li key={a}>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); pilihArea(a); }}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-orange-50 ${area === a ? "font-medium text-orange-700" : "text-slate-700"}`}>
                          {a} <span className="text-xs text-slate-400">{data.filter((d) => d.blc === a).length}</span>
                        </button>
                      </li>
                    ))}
                    {saranArea.length === 0 && <li className="px-3 py-2 text-sm text-slate-400">Area tidak ditemukan</li>}
                  </ul>
                )}
              </div>

              {/* Toggle tampilan */}
              <div className="flex rounded-xl border border-orange-100 bg-orange-50/40 p-1" role="group" aria-label="Pilih tampilan">
                {([["tabel", LayoutList, "Tabel"], ["kartu", LayoutGrid, "Kartu"]] as const).map(([k, Icon, label]) => (
                  <button key={k} type="button" onClick={() => setTampilan(k)} aria-pressed={tampilan === k}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${tampilan === k ? "bg-white font-medium text-orange-700 shadow-sm" : "text-slate-500 hover:text-orange-700"}`}>
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>

              {adaFilter && (
                <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50">
                  <X size={16} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Isi */}
          {baris.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={32} /></span>
              <p className="font-medium text-slate-800">Tidak ada peserta yang cocok</p>
              <p className="text-sm text-slate-500">Ubah kata kunci atau reset filter untuk melihat semua peserta.</p>
              {adaFilter && <button type="button" onClick={reset} className="mt-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">Reset filter</button>}
            </div>
          ) : tampilan === "tabel" ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-orange-50 text-orange-900">
                  <tr>
                    <th className="px-4 py-3 font-medium">Peserta</th>
                    <th className="px-4 py-3 font-medium">NIK</th>
                    <th className="px-4 py-3 font-medium">BLC</th>
                    <th className="px-4 py-3 font-medium">L/P</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {baris.map((p) => (
                    <tr key={p.id} className="transition hover:bg-orange-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar nama={p.nama} />
                          <span className="font-medium text-slate-900">{p.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-slate-600">{p.nik}</td>
                      <td className="px-4 py-3 text-slate-700"><span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-orange-400" />{p.blc}</span></td>
                      <td className="px-4 py-3">
                        {p.jk === "L"
                          ? <span className="inline-flex items-center gap-1 text-sky-600"><Mars size={16} /> L</span>
                          : <span className="inline-flex items-center gap-1 text-pink-600"><Venus size={16} /> P</span>}
                      </td>
                      <td className="px-4 py-3"><StatusBadge ok={p.tervalidasi} /></td>
                      <td className="px-4 py-3"><Aksi p={p} onValidasi={() => toggleValidasi(p.id)} onHapus={() => hapus(p)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {baris.map((p) => (
                <article key={p.id} className="rounded-2xl border border-orange-100 bg-orange-50/30 p-5 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-200/50">
                  <div className="flex items-center gap-3">
                    <Avatar nama={p.nama} besar />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">{p.nama}</h3>
                      <p className="flex items-center gap-1 text-xs tabular-nums text-slate-500"><Fingerprint size={13} /> {p.nik}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs text-slate-600 ring-1 ring-orange-100"><MapPin size={13} className="text-orange-400" />{p.blc}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${p.jk === "L" ? "bg-sky-50 text-sky-600" : "bg-pink-50 text-pink-600"}`}>
                      {p.jk === "L" ? <Mars size={13} /> : <Venus size={13} />}{p.jk === "L" ? "Laki-laki" : "Perempuan"}
                    </span>
                    <StatusBadge ok={p.tervalidasi} />
                  </div>
                  <div className="mt-4 border-t border-orange-100 pt-3"><Aksi p={p} onValidasi={() => toggleValidasi(p.id)} onHapus={() => hapus(p)} /></div>
                </article>
              ))}
            </div>
          )}

          {/* Paginasi */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 px-4 py-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span>Tampilkan</span>
              <select value={perPage} onChange={(e) => ubah(setPerPage)(Number(e.target.value))} aria-label="Jumlah baris per halaman"
                className="rounded-lg border border-orange-200 bg-white px-2 py-1 outline-none focus:ring-4 focus:ring-orange-200/60">
                {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
              </select>
              <span>baris, {hasil.length === 0 ? 0 : mulai + 1}–{Math.min(mulai + perPage, hasil.length)} dari {hasil.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage(halaman - 1)} disabled={halaman <= 1} aria-label="Halaman sebelumnya"
                className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronLeft size={18} /></button>
              <span className="tabular-nums">{halaman} / {totalHalaman}</span>
              <button type="button" onClick={() => setPage(halaman + 1)} disabled={halaman >= totalHalaman} aria-label="Halaman berikutnya"
                className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronRight size={18} /></button>
            </div>
          </div>
        </section>
      </div>

      {pesan && <div role="status" className="fixed bottom-6 right-6 z-[60] rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{pesan}</div>}
    </main>
  );
}