"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase, Building2, CalendarDays, ChevronLeft, ChevronRight, FileDown, GraduationCap,
  HeartHandshake, Plus, Search, SearchX, Trash2, Users, UsersRound, type LucideIcon,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";

type Pengunjung = {
  id: number; tanggal: string; sesi: number; nama: string; jk: "L" | "P";
  alamat: string; tanggalLahir: string; kategori: string;
};
type Grup = "semua" | "Pelajar" | "Pekerja" | "Non Pekerja" | "Organisasi";

const GRUP: Record<Exclude<Grup, "semua">, string[]> = {
  "Pelajar": ["SD", "SMP", "SMA/SMK", "Mahasiswa"],
  "Pekerja": ["PNS", "Karyawan", "Guru", "Wiraswasta"],
  "Non Pekerja": ["BK", "IRT", "Pensiunan"],
  "Organisasi": ["UKM", "PKK", "Kartar", "Pendidik PAUD", "KIM", "Kader (KSH)"],
};
const GRUP_LIST = Object.keys(GRUP) as Exclude<Grup, "semua">[];
const grupDari = (kat: string) => GRUP_LIST.find((g) => GRUP[g].includes(kat));

const IKON: Record<Grup, LucideIcon> = {
  semua: UsersRound, Pelajar: GraduationCap, Pekerja: Briefcase, "Non Pekerja": HeartHandshake, Organisasi: Building2,
};

// TODO: ganti dengan fetch ke API Laravel, mis. GET /api/pengunjung?mulai=&sampai=
const DATA_AWAL: Pengunjung[] = [
  { id: 1, tanggal: "2026-11-02", sesi: 3, nama: "Rahmatullah", jk: "L", alamat: "Donorejo Wetan Gang Langgar", tanggalLahir: "2019-01-12", kategori: "SD" },
  { id: 2, tanggal: "2026-11-02", sesi: 3, nama: "Iqbal Ramadhani", jk: "L", alamat: "Donorejo Wetan Gang Langgar", tanggalLahir: "2016-06-20", kategori: "SD" },
  { id: 3, tanggal: "2026-11-04", sesi: 1, nama: "Achmad Haikal Aditiya Pratama", jk: "L", alamat: "Bogen 2/25", tanggalLahir: "2008-03-14", kategori: "SMA/SMK" },
  { id: 4, tanggal: "2026-11-05", sesi: 2, nama: "Siti Aisyah", jk: "P", alamat: "Setro 2/25", tanggalLahir: "2009-08-01", kategori: "SMA/SMK" },
  { id: 5, tanggal: "2026-11-06", sesi: 2, nama: "Budi Santoso", jk: "L", alamat: "Tambak Wedi 5/30", tanggalLahir: "1990-05-09", kategori: "Karyawan" },
  { id: 6, tanggal: "2026-11-09", sesi: 1, nama: "Dewi Lestari", jk: "P", alamat: "Komp Sidotopo Dipo 1/2-c", tanggalLahir: "1985-11-23", kategori: "Guru" },
  { id: 7, tanggal: "2026-11-10", sesi: 4, nama: "Nur Hidayati", jk: "P", alamat: "Tambak Segaran Wetan 1/48", tanggalLahir: "1978-02-17", kategori: "IRT" },
  { id: 8, tanggal: "2026-11-12", sesi: 3, nama: "Fajar Nugroho", jk: "L", alamat: "Gunung Anyar Tambak 3/7", tanggalLahir: "2002-09-30", kategori: "Mahasiswa" },
  { id: 9, tanggal: "2026-11-13", sesi: 1, nama: "Ratna Sari", jk: "P", alamat: "Rungkut Menanggal 9", tanggalLahir: "1982-07-04", kategori: "PKK" },
  { id: 10, tanggal: "2026-11-16", sesi: 2, nama: "Hendra Wijaya", jk: "L", alamat: "Bendul Merisi 12", tanggalLahir: "1995-12-12", kategori: "Wiraswasta" },
  { id: 11, tanggal: "2026-11-17", sesi: 3, nama: "Agus Salim", jk: "L", alamat: "Wonocolo 4/8", tanggalLahir: "1960-04-21", kategori: "Pensiunan" },
  { id: 12, tanggal: "2026-11-18", sesi: 1, nama: "Putri Ayu", jk: "P", alamat: "Gunung Anyar 6/2", tanggalLahir: "2011-10-10", kategori: "SMP" },
];

const hariIni = () => new Date().toLocaleDateString("en-CA");
const awalBulan = () => hariIni().slice(0, 8) + "01";
const fmt = (t: string) => t.split("-").reverse().join("/");

const hitung = (rows: Pengunjung[]) => ({
  total: rows.length,
  L: rows.filter((d) => d.jk === "L").length,
  P: rows.filter((d) => d.jk === "P").length,
});

export default function PengunjungPage() {
  const { showNotification } = useCrudNotification();
  const [data, setData] = useState<Pengunjung[]>(DATA_AWAL);
  const [mulai, setMulai] = useState(awalBulan());
  const [sampai, setSampai] = useState(hariIni());
  const [dicari, setDicari] = useState<{ mulai: string; sampai: string } | null>(null);
  const [grup, setGrup] = useState<Grup>("semua");
  const [sub, setSub] = useState("");
  const [cari, setCari] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [dipilih, setDipilih] = useState<Set<number>>(new Set());

  const dalamRentang = useMemo(
    () => (dicari ? data.filter((d) => d.tanggal >= dicari.mulai && d.tanggal <= dicari.sampai) : []),
    [data, dicari]
  );

  const ringkas = useMemo(() => {
    const per = { semua: hitung(dalamRentang) } as Record<Grup, ReturnType<typeof hitung>>;
    GRUP_LIST.forEach((g) => { per[g] = hitung(dalamRentang.filter((d) => grupDari(d.kategori) === g)); });
    return per;
  }, [dalamRentang]);

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return dalamRentang.filter(
      (d) =>
        (grup === "semua" || grupDari(d.kategori) === grup) &&
        (!sub || d.kategori === sub) &&
        (!q || d.nama.toLowerCase().includes(q) || d.alamat.toLowerCase().includes(q))
    );
  }, [dalamRentang, grup, sub, cari]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / perPage));
  const halaman = Math.min(page, totalHalaman);
  const mulaiIdx = (halaman - 1) * perPage;
  const baris = hasil.slice(mulaiIdx, mulaiIdx + perPage);

  const cariData = () => {
    if (!mulai || !sampai) {
      showNotification({ type: "error", title: "Pencarian gagal", message: "Isi tanggal mulai dan sampai." });
      return;
    }
    if (mulai > sampai) {
      showNotification({ type: "error", title: "Pencarian gagal", message: "Tanggal mulai tidak boleh melewati tanggal sampai." });
      return;
    }
    setDicari({ mulai, sampai });
    setGrup("semua"); setSub(""); setCari(""); setPage(1); setDipilih(new Set());
  };
  const pilihGrup = (g: Grup) => { setGrup(g); setSub(""); setPage(1); };

  const toggle = (id: number) => setDipilih((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });
  const semuaHalaman = baris.length > 0 && baris.every((b) => dipilih.has(b.id));
  const togglePage = () => setDipilih((s) => {
    const n = new Set(s);
    if (semuaHalaman) baris.forEach((b) => n.delete(b.id));
    else baris.forEach((b) => n.add(b.id));
    return n;
  });
  const hapusTerpilih = () => {
    if (!window.confirm(`Hapus ${dipilih.size} pengunjung terpilih?`)) return;
    // TODO: DELETE ke API Laravel
    const jumlah = dipilih.size;
    setData((d) => d.filter((x) => !dipilih.has(x.id)));
    setDipilih(new Set());
    showNotification({
      type: "success",
      title: "Pengunjung dihapus",
      message: `${jumlah} pengunjung terpilih berhasil dihapus.`,
    });
  };

  const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";
  const subJumlah = (s: string) => dalamRentang.filter((d) => d.kategori === s).length;

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Banner */}
        <div className="instruktur-page-header mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25"><Users size={28} /></span>
            <div>
              <h1 className="text-2xl font-semibold">Pengunjung</h1>
              <p className="text-sm text-orange-50">Lihat data dan rekap pengunjung per tanggal.</p>
            </div>
          </div>
          <Link href="/instruktur/tambah_pengunjung"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-700">
            <Plus size={18} /> Buat pengunjung baru
          </Link>
        </div>

        {/* Filter tanggal */}
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
            <button type="button" onClick={cariData}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">
              <Search size={18} /> Cari pengunjung
            </button>
          </div>
        </section>

        {!dicari && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-white/60 px-4 py-14 text-center print:hidden">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><Search size={30} /></span>
            <p className="text-sm text-slate-500">Pilih rentang tanggal lalu klik &quot;Cari pengunjung&quot;.</p>
          </div>
        )}

        {dicari && (
          <>
            {/* Kartu ringkasan */}
            <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-5 print:hidden">
              {(["semua", ...GRUP_LIST] as Grup[]).map((g) => {
                const Icon = IKON[g];
                const r = ringkas[g];
                const aktif = grup === g;
                return (
                  <button key={g} type="button" onClick={() => pilihGrup(g)} aria-pressed={aktif}
                    className={`rounded-2xl border bg-white p-4 text-left shadow-lg shadow-orange-200/40 transition hover:-translate-y-0.5 ${aktif ? "border-orange-400 ring-4 ring-orange-200/60" : "border-orange-100"}`}>
                    <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${aktif ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600"}`}><Icon size={20} /></span>
                    <span className="block text-2xl font-semibold tabular-nums text-slate-900">{r.total}</span>
                    <span className="text-sm text-slate-500">{g === "semua" ? "Total keseluruhan" : g}</span>
                    <span className="mt-2 block text-xs text-slate-500">L {r.L} · P {r.P}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-kategori */}
            {grup !== "semua" && (
              <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-orange-100 bg-white p-4 shadow-lg shadow-orange-200/40 print:hidden">
                <span className="mr-1 text-sm font-medium text-slate-600">{grup}:</span>
                {GRUP[grup].map((s) => {
                  const n = subJumlah(s);
                  const aktif = sub === s;
                  return (
                    <button key={s} type="button" disabled={n === 0} onClick={() => { setSub(aktif ? "" : s); setPage(1); }} aria-pressed={aktif}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        aktif ? "border-orange-500 bg-orange-500 font-medium text-white shadow-sm" : "border-orange-200 bg-white text-slate-600 hover:bg-orange-50"}`}>
                      {s} <span className={`ml-1 text-xs ${aktif ? "text-orange-100" : "text-slate-400"}`}>{n}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tabel pengunjung */}
            <section className="rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40 print:hidden">
              <div className="flex flex-wrap items-center gap-3 border-b border-orange-100 p-4">
                <div className="mr-auto">
                  <h2 className="font-semibold text-slate-900">Daftar pengunjung</h2>
                  <p className="text-sm text-slate-500">{fmt(dicari.mulai)} – {fmt(dicari.sampai)} · {hasil.length} data</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                  <input type="search" value={cari} onChange={(e) => { setCari(e.target.value); setPage(1); }} placeholder="Cari nama atau alamat" aria-label="Cari pengunjung"
                    className="w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60" />
                </div>
                {dipilih.size > 0 && (
                  <button type="button" onClick={hapusTerpilih}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-300/40 transition hover:bg-red-600">
                    <Trash2 size={16} /> Hapus bertanda ({dipilih.size})
                  </button>
                )}
                <button type="button" onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-50">
                  <FileDown size={16} /> Simpan ke PDF
                </button>
              </div>

              {baris.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={32} /></span>
                  <p className="font-medium text-slate-800">Data tidak ditemukan</p>
                  <p className="text-sm text-slate-500">Ubah rentang tanggal, kategori, atau kata kunci.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="bg-orange-50 text-orange-900">
                      <tr>
                        <th className="w-10 px-4 py-3">
                          <input type="checkbox" checked={semuaHalaman} onChange={togglePage} aria-label="Pilih semua di halaman ini" className="h-4 w-4 accent-orange-500" />
                        </th>
                        {["Tanggal", "Sesi", "Nama", "L/P", "Alamat", "Tgl lahir", "Kategori"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-100">
                      {baris.map((d) => (
                        <tr key={d.id} className={`transition hover:bg-orange-50/60 ${dipilih.has(d.id) ? "bg-orange-50" : ""}`}>
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={dipilih.has(d.id)} onChange={() => toggle(d.id)} aria-label={`Pilih ${d.nama}`} className="h-4 w-4 accent-orange-500" />
                          </td>
                          <td className="px-4 py-3 tabular-nums text-slate-600">{fmt(d.tanggal)}</td>
                          <td className="px-4 py-3 tabular-nums text-slate-600">{d.sesi}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{d.nama}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${d.jk === "L" ? "bg-sky-50 text-sky-600" : "bg-pink-50 text-pink-600"}`}>{d.jk}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{d.alamat}</td>
                          <td className="px-4 py-3 tabular-nums text-slate-600">{fmt(d.tanggalLahir)}</td>
                          <td className="px-4 py-3"><span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">{d.kategori}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 px-4 py-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Tampilkan</span>
                  <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} aria-label="Jumlah baris"
                    className="rounded-lg border border-orange-200 bg-white px-2 py-1 outline-none focus:ring-4 focus:ring-orange-200/60">
                    {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
                  </select>
                  <span>baris, {hasil.length === 0 ? 0 : mulaiIdx + 1}–{Math.min(mulaiIdx + perPage, hasil.length)} dari {hasil.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPage(halaman - 1)} disabled={halaman <= 1} aria-label="Sebelumnya"
                    className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronLeft size={18} /></button>
                  <span className="tabular-nums">{halaman} / {totalHalaman}</span>
                  <button type="button" onClick={() => setPage(halaman + 1)} disabled={halaman >= totalHalaman} aria-label="Berikutnya"
                    className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronRight size={18} /></button>
                </div>
              </div>
            </section>

            {/* Rekap untuk PDF (hanya tampil saat dicetak) */}
            <section className="hidden print:block">
              <h1 className="text-xl font-semibold">Laporan Kegiatan Pengunjung</h1>
              <p className="mb-4 text-sm">Periode {fmt(dicari.mulai)} – {fmt(dicari.sampai)}</p>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    {["Kelompok", "Kategori", "Laki-laki", "Perempuan", "Jumlah"].map((h) => <th key={h} className="border border-slate-300 px-3 py-2 text-left">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {GRUP_LIST.flatMap((g) =>
                    GRUP[g].map((s, i) => {
                      const r = hitung(dalamRentang.filter((d) => d.kategori === s));
                      return (
                        <tr key={g + s}>
                          <td className="border border-slate-300 px-3 py-1.5">{i === 0 ? g : ""}</td>
                          <td className="border border-slate-300 px-3 py-1.5">{s}</td>
                          <td className="border border-slate-300 px-3 py-1.5">{r.L}</td>
                          <td className="border border-slate-300 px-3 py-1.5">{r.P}</td>
                          <td className="border border-slate-300 px-3 py-1.5">{r.total}</td>
                        </tr>
                      );
                    })
                  )}
                  <tr className="bg-slate-100 font-semibold">
                    <td className="border border-slate-300 px-3 py-2" colSpan={2}>TOTAL KESELURUHAN</td>
                    <td className="border border-slate-300 px-3 py-2">{ringkas.semua.L}</td>
                    <td className="border border-slate-300 px-3 py-2">{ringkas.semua.P}</td>
                    <td className="border border-slate-300 px-3 py-2">{ringkas.semua.total}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>

    </main>
  );
}
