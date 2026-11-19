"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarClock, Clock, Download, FileQuestion, RotateCcw, Search, SearchX, Shuffle, Trash2, UserCheck, UserPlus, X } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
import Paginasi from "../../components/paginasi";
import PopupSukses from "../../components/popupsukses";
import TokenUjian from "../../components/tokenujian";

type Peserta = { id: number; nik: string; username: string; nama: string; jk: "L" | "P"; kategori: string; area: string; noDaftar: string; tglDaftar: string };
type Terdaftar = { p: Peserta; benar: number | null; nilai: number | null; mulai: string; selesai: string; waktu: string };
type Tab = "belum" | "sudah";

const AREA = ["Simokerto", "Gunung Anyar", "Bendul Merisi", "Wonokromo", "Rungkut"];
const PER_HALAMAN = 10;

// TODO: ganti dengan GET /api/ujian/{id}
const INFO: Record<string, { nama: string; token: string; soal: number; waktu: number; acak: boolean }> = {
  "1": { nama: "PRE TEST - APLIKASI PERKANTORAN PERTEMUAN 1", token: "YQVWE", soal: 5, waktu: 60, acak: true },
  "2": { nama: "POST TEST - APLIKASI PERKANTORAN PERTEMUAN 1", token: "JPQFG", soal: 5, waktu: 60, acak: true },
  "3": { nama: "POST TEST - APLIKASI PERKANTORAN PERTEMUAN 2", token: "JDIGK", soal: 5, waktu: 60, acak: true },
  "4": { nama: "POST TEST - APLIKASI PERKANTORAN PERTEMUAN 2", token: "QYCZC", soal: 5, waktu: 60, acak: false },
  "5": { nama: "POST TEST - APLIKASI PERKANTORAN PERTEMUAN 3", token: "BLSMQ", soal: 5, waktu: 60, acak: true },
  "6": { nama: "PRE TEST - APLIKASI PERKANTORAN PERTEMUAN 4", token: "OJQJD", soal: 5, waktu: 60, acak: true },
  "7": { nama: "POST TEST - APLIKASI PERKANTORAN PERTEMUAN 5", token: "GBHCK", soal: 5, waktu: 60, acak: true },
};

const DEPAN = ["Budi", "Siti", "Ahmad", "Dewi", "Rizky", "Putri", "Agus", "Nur", "Eko", "Rina", "Dimas", "Fitri"];
const BELAKANG = ["Santoso", "Rahayu", "Hidayat", "Lestari", "Pratama", "Wulandari", "Saputra", "Kurniawan", "Utami", "Wibowo"];
const KATEGORI = ["Pencari kerja", "Pelajar", "Pelaku UMKM", "Umum"];

// TODO: ganti dengan GET /api/peserta?search=&area=&dari=&sampai=&page= (backend wajib paging, data bisa belasan ribu)
const SEMUA: Peserta[] = Array.from({ length: 240 }, (_, i) => {
  const d = new Date(2026, 5, 1 + (i % 60));
  return {
    id: i + 1,
    nik: "3578" + String(100000000000 + i * 7919).slice(0, 12),
    username: `peserta${String(i + 1).padStart(3, "0")}`,
    nama: `${DEPAN[i % DEPAN.length]} ${BELAKANG[(i * 3) % BELAKANG.length]}`,
    jk: i % 3 === 0 ? "P" : "L",
    kategori: KATEGORI[i % KATEGORI.length],
    area: AREA[i % AREA.length],
    noDaftar: `${14500 - i}/31/F-I/2026`,
    tglDaftar: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
  };
});

const TERDAFTAR_AWAL: Terdaftar[] = [
  { p: SEMUA[0], benar: 4, nilai: 80, mulai: "03/06/2026 09:30", selesai: "03/06/2026 09:52", waktu: "22 menit" },
  { p: SEMUA[1], benar: 2, nilai: 40, mulai: "03/06/2026 09:31", selesai: "03/06/2026 10:01", waktu: "30 menit" },
  { p: SEMUA[2], benar: null, nilai: null, mulai: "-", selesai: "-", waktu: "-" },
];

const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

export default function IsiPesertaPage() {
  const { id } = useParams<{ id: string }>();
  const info = INFO[id];

  const [tab, setTab] = useState<Tab>("belum");
  const [terdaftar, setTerdaftar] = useState<Terdaftar[]>(id === "1" ? TERDAFTAR_AWAL : []);
  const [cari, setCari] = useState("");
  const [area, setArea] = useState("");
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  const [pilih, setPilih] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [cariSudah, setCariSudah] = useState("");
  const [pageSudah, setPageSudah] = useState(1);
  const [sukses, setSukses] = useState<number | null>(null);

  const idTerdaftar = useMemo(() => new Set(terdaftar.map((t) => t.p.id)), [terdaftar]);

  const belum = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return SEMUA.filter((p) =>
      !idTerdaftar.has(p.id) &&
      (!q || p.nama.toLowerCase().includes(q) || p.nik.includes(q) || p.username.toLowerCase().includes(q) || p.noDaftar.includes(q)) &&
      (!area || p.area === area) && (!dari || p.tglDaftar >= dari) && (!sampai || p.tglDaftar <= sampai));
  }, [cari, area, dari, sampai, idTerdaftar]);

  const sudah = useMemo(() => {
    const q = cariSudah.trim().toLowerCase();
    return terdaftar.filter((t) => !q || t.p.nama.toLowerCase().includes(q) || t.p.nik.includes(q) || t.p.username.toLowerCase().includes(q));
  }, [terdaftar, cariSudah]);

  if (!info) {
    return (
      <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-orange-200 bg-white p-10 text-center shadow-xl shadow-orange-300/40">
          <p className="mb-1 font-medium text-slate-800">Ujian tidak ditemukan</p>
          <p className="mb-5 text-sm text-slate-500">Nomor ujian tidak ada dalam data.</p>
          <Link href="/instruktur/master_ujian" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 hover:bg-orange-600"><ArrowLeft size={16} /> Kembali ke daftar ujian</Link>
        </div>
      </main>
    );
  }

  const hal = Math.min(page, Math.max(1, Math.ceil(belum.length / PER_HALAMAN)));
  const baris = belum.slice((hal - 1) * PER_HALAMAN, hal * PER_HALAMAN);
  const halS = Math.min(pageSudah, Math.max(1, Math.ceil(sudah.length / PER_HALAMAN)));
  const barisS = sudah.slice((halS - 1) * PER_HALAMAN, halS * PER_HALAMAN);

  const semuaHalamanTerpilih = baris.length > 0 && baris.every((p) => pilih.has(p.id));
  const adaFilter = !!(cari || area || dari || sampai);

  const ubahFilter = (fn: () => void) => { fn(); setPage(1); setPilih(new Set()); };
  const reset = () => ubahFilter(() => { setCari(""); setArea(""); setDari(""); setSampai(""); });

  const togglePilih = (pid: number) => setPilih((s) => { const n = new Set(s); if (n.has(pid)) n.delete(pid); else n.add(pid); return n; });
  const pilihHalaman = () => setPilih((s) => {
    const n = new Set(s);
    if (semuaHalamanTerpilih) baris.forEach((p) => n.delete(p.id)); else baris.forEach((p) => n.add(p.id));
    return n;
  });

  const daftarkan = () => {
    const baru = SEMUA.filter((p) => pilih.has(p.id)).map<Terdaftar>((p) => ({ p, benar: null, nilai: null, mulai: "-", selesai: "-", waktu: "-" }));
    if (baru.length === 0) return;
    // TODO: POST /api/ujian/{id}/peserta dengan body { peserta_ids: [...] }
    setTerdaftar((t) => [...baru, ...t]);
    setPilih(new Set());
    setSukses(baru.length);
  };

  const resetUjian = (t: Terdaftar) => {
    if (!window.confirm(`Reset ujian ${t.p.nama}? Nilai dan jawaban akan dihapus, peserta bisa mengulang.`)) return;
    // TODO: POST /api/ujian/{id}/peserta/{pesertaId}/reset
    setTerdaftar((l) => l.map((x) => (x.p.id === t.p.id ? { ...x, benar: null, nilai: null, mulai: "-", selesai: "-", waktu: "-" } : x)));
  };

  const hapusPeserta = (t: Terdaftar) => {
    if (!window.confirm(`Hapus ${t.p.nama} dari ujian ini?`)) return;
    // TODO: DELETE /api/ujian/{id}/peserta/{pesertaId}
    setTerdaftar((l) => l.filter((x) => x.p.id !== t.p.id));
  };

  const excel = () => {
    const q = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const kepala = ["NIK", "Username", "Nama", "L/P", "Kategori", "Benar", "Nilai", "Mulai", "Selesai", "Waktu"];
    const isi = sudah.map((t) => [`'${t.p.nik}`, t.p.username, t.p.nama, t.p.jk, t.p.kategori, t.benar, t.nilai, t.mulai, t.selesai, t.waktu].map(q).join(","));
    const blob = new Blob(["﻿" + [kepala.map(q).join(","), ...isi].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `peserta-ujian-${id}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const tabCls = (aktif: boolean) => `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${aktif ? "bg-orange-500 font-medium text-white shadow-sm" : "text-slate-500 hover:text-orange-700"}`;
  const badge = (aktif: boolean) => `rounded-full px-2 text-xs tabular-nums ${aktif ? "bg-white/25" : "bg-orange-100 text-orange-700"}`;

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 pb-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <HeaderHalaman icon={UserPlus} judul="Isi peserta ujian" deskripsi={info.nama} kembali="/instruktur/master_ujian">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white"><FileQuestion size={14} /> {info.soal} soal</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white"><Clock size={14} /> {info.waktu} menit</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white"><Shuffle size={14} /> {info.acak ? "Acak soal" : "Urut soal"}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white"><CalendarClock size={14} /> Token <b className="font-mono tracking-wider">{info.token}</b></span>
        </HeaderHalaman>

        <div className="mb-4 inline-flex rounded-xl border border-orange-100 bg-white p-1 shadow-sm" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "belum"} onClick={() => setTab("belum")} className={tabCls(tab === "belum")}>
            <UserPlus size={16} /> Belum terdaftar <span className={badge(tab === "belum")}>{belum.length.toLocaleString("id-ID")}</span>
          </button>
          <button type="button" role="tab" aria-selected={tab === "sudah"} onClick={() => setTab("sudah")} className={tabCls(tab === "sudah")}>
            <UserCheck size={16} /> Sudah terdaftar <span className={badge(tab === "sudah")}>{terdaftar.length}</span>
          </button>
        </div>

        {tab === "belum" ? (
          <section className="rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
            <div className="grid gap-3 border-b border-orange-100 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                <input type="search" value={cari} onChange={(e) => ubahFilter(() => setCari(e.target.value))} placeholder="Cari nama, NIK, username, no. daftar" aria-label="Cari peserta" className={`${inputCls} pl-10`} />
              </div>
              <select value={area} onChange={(e) => ubahFilter(() => setArea(e.target.value))} aria-label="Area BLC" className={inputCls}>
                <option value="">Semua area BLC</option>
                {AREA.map((a) => <option key={a}>{a}</option>)}
              </select>
              <input type="date" value={dari} onChange={(e) => ubahFilter(() => setDari(e.target.value))} aria-label="Daftar dari tanggal" suppressHydrationWarning className={inputCls} />
              <input type="date" value={sampai} onChange={(e) => ubahFilter(() => setSampai(e.target.value))} aria-label="Daftar sampai tanggal" suppressHydrationWarning className={inputCls} />
              <button type="button" onClick={reset} disabled={!adaFilter} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-orange-200 px-4 py-2.5 text-sm text-orange-700 transition hover:bg-orange-50 disabled:opacity-40"><X size={16} /> Reset</button>
            </div>

            {semuaHalamanTerpilih && belum.length > baris.length && pilih.size < belum.length && (
              <div className="flex flex-wrap items-center justify-center gap-2 bg-orange-50 px-4 py-2.5 text-sm text-orange-900">
                {pilih.size} peserta di halaman ini dipilih.
                <button type="button" onClick={() => setPilih(new Set(belum.map((p) => p.id)))} className="font-medium underline underline-offset-2 hover:text-orange-700">Pilih semua {belum.length.toLocaleString("id-ID")} hasil</button>
              </div>
            )}

            {baris.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={32} /></span>
                <p className="font-medium text-slate-800">Peserta tidak ditemukan</p>
                <p className="text-sm text-slate-500">Ubah kata kunci atau filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-orange-50 text-orange-900">
                    <tr>
                      <th className="w-12 px-4 py-3"><input type="checkbox" checked={semuaHalamanTerpilih} onChange={pilihHalaman} aria-label="Pilih semua di halaman ini" className="h-4 w-4 accent-orange-500" /></th>
                      <th className="px-4 py-3 font-medium">No. daftar</th>
                      <th className="px-4 py-3 font-medium">NIK</th>
                      <th className="px-4 py-3 font-medium">Nama</th>
                      <th className="px-4 py-3 font-medium">Kategori</th>
                      <th className="px-4 py-3 font-medium">Area BLC</th>
                      <th className="px-4 py-3 font-medium">Tgl daftar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {baris.map((p) => (
                      <tr key={p.id} onClick={() => togglePilih(p.id)} className={`cursor-pointer transition ${pilih.has(p.id) ? "bg-orange-50" : "hover:bg-orange-50/50"}`}>
                        <td className="px-4 py-3"><input type="checkbox" checked={pilih.has(p.id)} onChange={() => togglePilih(p.id)} onClick={(e) => e.stopPropagation()} aria-label={`Pilih ${p.nama}`} className="h-4 w-4 accent-orange-500" /></td>
                        <td className="px-4 py-3 tabular-nums text-slate-600">{p.noDaftar}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-600">{p.nik}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{p.nama}</td>
                        <td className="px-4 py-3 text-slate-600">{p.kategori}</td>
                        <td className="px-4 py-3 text-slate-600">{p.area}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-600">{p.tglDaftar.split("-").reverse().join("/")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Paginasi page={page} setPage={setPage} jumlah={belum.length} perPage={PER_HALAMAN} satuan="peserta" />
          </section>
        ) : (
          <section className="rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
            <div className="flex flex-wrap items-center gap-3 border-b border-orange-100 p-4">
              <div className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                <input type="search" value={cariSudah} onChange={(e) => { setCariSudah(e.target.value); setPageSudah(1); }} placeholder="Cari nama, NIK, username" aria-label="Cari peserta terdaftar" className={`${inputCls} pl-10`} />
              </div>
              <button type="button" onClick={excel} disabled={sudah.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-green-600/30 transition hover:bg-green-700 disabled:opacity-40"><Download size={16} /> Excel</button>
            </div>

            {barisS.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500"><UserCheck size={32} /></span>
                <p className="font-medium text-slate-800">Belum ada peserta terdaftar</p>
                <button type="button" onClick={() => setTab("belum")} className="text-sm font-medium text-orange-600 underline underline-offset-2">Pilih peserta</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead className="bg-orange-50 text-orange-900">
                    <tr>
                      {["NIK", "Username", "Nama", "L/P", "Kategori", "Benar", "Nilai", "Mulai", "Selesai", "Waktu"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
                      <th className="px-4 py-3 text-right font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {barisS.map((t) => (
                      <tr key={t.p.id} className="transition hover:bg-orange-50/50">
                        <td className="px-4 py-3 tabular-nums text-slate-600">{t.p.nik}</td>
                        <td className="px-4 py-3 text-slate-600">{t.p.username}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{t.p.nama}</td>
                        <td className="px-4 py-3 text-slate-600">{t.p.jk}</td>
                        <td className="px-4 py-3 text-slate-600">{t.p.kategori}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-600">{t.benar ?? "-"}</td>
                        <td className="px-4 py-3">
                          {t.nilai === null
                            ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">Belum ujian</span>
                            : <span className={`rounded-full px-2.5 py-1 text-xs font-medium tabular-nums ${t.nilai >= 60 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{t.nilai}</span>}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-slate-600">{t.mulai}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-600">{t.selesai}</td>
                        <td className="px-4 py-3 text-slate-600">{t.waktu}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => resetUjian(t)} disabled={t.nilai === null} aria-label={`Reset ujian ${t.p.nama}`} title="Reset ujian" className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"><RotateCcw size={16} /></button>
                            <button type="button" onClick={() => hapusPeserta(t)} aria-label={`Hapus ${t.p.nama}`} title="Hapus dari ujian" className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Paginasi page={pageSudah} setPage={setPageSudah} jumlah={sudah.length} perPage={PER_HALAMAN} satuan="peserta" />
          </section>
        )}
      </div>

      {tab === "belum" && pilih.size > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-white px-5 py-3 shadow-2xl shadow-orange-400/40">
          <p className="text-sm text-slate-700"><b className="tabular-nums text-orange-600">{pilih.size.toLocaleString("id-ID")}</b> peserta dipilih</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPilih(new Set())} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-orange-50">Batal pilihan</button>
            <button type="button" onClick={daftarkan} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-green-600/30 hover:bg-green-700"><UserPlus size={16} /> Daftarkan</button>
          </div>
        </div>
      )}

      {sukses !== null && <PopupSukses judul="Peserta didaftarkan" detail={`${sukses.toLocaleString("id-ID")} peserta masuk ke ujian ini.`} onTutup={() => { setSukses(null); setTab("sudah"); }} />}
    </main>
  );
}
