"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Briefcase, Building2, ChevronLeft, ChevronRight, FileDown, GraduationCap,
  HeartHandshake, Pencil, Plus, Search, SearchX, Trash2, Users, UsersRound, X, type LucideIcon,
} from "lucide-react";
import {
  createPengunjung, deletePengunjung, getPengunjung, getPengunjungOpsi, updatePengunjung,
  type Pengunjung, type PengunjungInput, type PengunjungOpsi,
} from "@/lib/api";

type Grup = "semua" | "Pelajar" | "Pekerja" | "Non Pekerja" | "Organisasi";

const GRUP: Record<Exclude<Grup, "semua">, string[]> = {
  Pelajar: ["SD", "SMP", "SMA/SMK", "Mahasiswa"],
  Pekerja: ["PNS", "Karyawan", "Guru", "Wiraswasta"],
  "Non Pekerja": ["BK", "IRT", "Pensiunan"],
  Organisasi: ["UKM", "PKK", "Kartar", "Pendidik PAUD", "KIM", "Kader (KSH)"],
};
const GRUP_LIST = Object.keys(GRUP) as Exclude<Grup, "semua">[];
const grupDari = (kat: string | null) => GRUP_LIST.find((g) => GRUP[g].includes(kat ?? ""));
const IKON: Record<Grup, LucideIcon> = {
  semua: UsersRound, Pelajar: GraduationCap, Pekerja: Briefcase,
  "Non Pekerja": HeartHandshake, Organisasi: Building2,
};

const tanggalLokal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const fmt = (t: string | null) => t ? t.split("-").reverse().join("/") : "-";
const hitung = (rows: Pengunjung[]) => ({
  total: rows.length,
  L: rows.filter((d) => d.jenis_kelamin === "L").length,
  P: rows.filter((d) => d.jenis_kelamin === "P").length,
});
const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

export default function PengunjungPage() {
  const [data, setData] = useState<Pengunjung[]>([]);
  const [opsi, setOpsi] = useState<PengunjungOpsi>({ blc: [], sesi: [], kategori: [] });
  const [mulai, setMulai] = useState(() => tanggalLokal().slice(0, 8) + "01");
  const [sampai, setSampai] = useState(tanggalLokal);
  const [blc, setBlc] = useState("");
  const [sesi, setSesi] = useState("");
  const [loading, setLoading] = useState(true);
  const [grup, setGrup] = useState<Grup>("semua");
  const [sub, setSub] = useState("");
  const [cari, setCari] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [dipilih, setDipilih] = useState<Set<number>>(new Set());
  const [pesan, setPesan] = useState("");
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);
  const [form, setForm] = useState<PengunjungInput>({
    nama: "", lokasi_blc_id: 0, sesi_id: 0, instansi: "", email: "", telepon: "",
    pesan: "", jenis_kelamin: null, tanggal_lahir: null, alamat: "", kategori: null, rating: null,
  });

  const toast = useCallback((t: string) => {
    setPesan(t);
    setTimeout(() => setPesan(""), 3500);
  }, []);

  const muatData = useCallback(async () => {
    if (!mulai || !sampai || mulai > sampai) return;
    setLoading(true);
    try {
      const res = await getPengunjung({
        mulai, sampai,
        lokasi_blc_id: blc ? Number(blc) : undefined,
        sesi_id: sesi ? Number(sesi) : undefined,
      });
      setData(res.data ?? []);
      setDipilih(new Set());
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal memuat data pengunjung.");
    } finally {
      setLoading(false);
    }
  }, [mulai, sampai, blc, sesi, toast]);

  useEffect(() => {
    getPengunjungOpsi().then((res) => setOpsi(res.data)).catch(() => toast("Gagal memuat pilihan BLC dan sesi."));
  }, [toast]);

  useEffect(() => {
    void Promise.resolve().then(muatData);
  }, [muatData]);

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return data.filter((d) =>
      (grup === "semua" || grupDari(d.kategori) === grup) &&
      (!sub || d.kategori === sub) &&
      (!q || [d.nama, d.alamat, d.instansi, d.email, d.telepon].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [data, grup, sub, cari]);

  const ringkas = useMemo(() => {
    const per = { semua: hitung(data) } as Record<Grup, ReturnType<typeof hitung>>;
    GRUP_LIST.forEach((g) => { per[g] = hitung(data.filter((d) => grupDari(d.kategori) === g)); });
    return per;
  }, [data]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / perPage));
  const halaman = Math.min(page, totalHalaman);
  const mulaiIdx = (halaman - 1) * perPage;
  const baris = hasil.slice(mulaiIdx, mulaiIdx + perPage);

  const terapkanFilter = () => {
    if (!mulai || !sampai) return toast("Isi tanggal mulai dan sampai.");
    if (mulai > sampai) return toast("Tanggal mulai tidak boleh melewati tanggal sampai.");
    setPage(1);
    setGrup("semua");
    setSub("");
    setCari("");
  };

  const bukaTambah = () => {
    setEditId(null);
    setForm({
      nama: "", lokasi_blc_id: blc ? Number(blc) : opsi.blc[0]?.id ?? 0,
      sesi_id: sesi ? Number(sesi) : opsi.sesi[0]?.id ?? 0,
      instansi: "", email: "", telepon: "", pesan: "", jenis_kelamin: null,
      tanggal_lahir: null, alamat: "", kategori: null, rating: null,
    });
    setFormTerbuka(true);
  };

  const bukaEdit = (d: Pengunjung) => {
    setEditId(d.id);
    setForm({
      nama: d.nama, lokasi_blc_id: d.lokasi_blc_id ?? 0, sesi_id: d.sesi_id ?? 0,
      instansi: d.instansi ?? "", email: d.email ?? "", telepon: d.telepon ?? "",
      pesan: d.pesan, jenis_kelamin: d.jenis_kelamin, tanggal_lahir: d.tanggal_lahir,
      alamat: d.alamat ?? "", kategori: d.kategori, rating: d.rating,
    });
    setFormTerbuka(true);
  };

  const ubahForm = (kolom: keyof PengunjungInput, nilai: string) => {
    setForm((f) => ({
      ...f,
      [kolom]: kolom === "lokasi_blc_id" || kolom === "sesi_id"
        ? Number(nilai)
        : kolom === "rating" ? (nilai ? Number(nilai) : null) : nilai,
    }));
  };

  const simpan = async () => {
    if (!form.nama.trim()) return toast("Nama wajib diisi.");
    if (!form.lokasi_blc_id || !form.sesi_id) return toast("Pilih BLC dan sesi kunjungan.");
    setMenyimpan(true);
    try {
      const payload = {
        ...form,
        nama: form.nama.trim(),
        instansi: form.instansi || null,
        email: form.email || null,
        telepon: form.telepon || null,
        alamat: form.alamat || null,
        pesan: form.pesan || "-",
      };
      if (editId) await updatePengunjung(editId, payload);
      else await createPengunjung(payload);
      setFormTerbuka(false);
      toast(editId ? "Data pengunjung diperbarui." : "Pengunjung berhasil didaftarkan.");
      await muatData();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal menyimpan pengunjung.");
    } finally {
      setMenyimpan(false);
    }
  };

  const hapus = async (ids: number[]) => {
    if (ids.length === 0) return;
    if (!window.confirm(`Hapus ${ids.length} data pengunjung?`)) return;
    try {
      await Promise.all(ids.map(deletePengunjung));
      toast("Data pengunjung dihapus.");
      await muatData();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal menghapus pengunjung.");
    }
  };

  const toggle = (id: number) => setDipilih((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
  const semuaHalaman = baris.length > 0 && baris.every((b) => dipilih.has(b.id));
  const togglePage = () => setDipilih((s) => {
    const n = new Set(s);
    if (semuaHalaman) baris.forEach((b) => n.delete(b.id));
    else baris.forEach((b) => n.add(b.id));
    return n;
  });

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="instruktur-page-header mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25"><Users size={28} /></span>
            <div>
              <h1 className="text-2xl font-semibold">Pengunjung</h1>
              <p className="text-sm text-orange-50">Data Buku Tamu untuk seluruh BLC, dapat dikelola langsung.</p>
            </div>
          </div>
          <button type="button" onClick={bukaTambah}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition hover:bg-green-700">
            <Plus size={18} /> Daftarkan pengunjung
          </button>
        </div>

        <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40 print:hidden">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal mulai</span>
              <input type="date" value={mulai} onChange={(e) => { setMulai(e.target.value); setPage(1); }} className={inputCls} /></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal sampai</span>
              <input type="date" value={sampai} onChange={(e) => { setSampai(e.target.value); setPage(1); }} className={inputCls} /></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Semua BLC</span>
              <select value={blc} onChange={(e) => { setBlc(e.target.value); setPage(1); }} className={inputCls}>
                <option value="">Semua BLC</option>
                {opsi.blc.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
              </select></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Sesi</span>
              <select value={sesi} onChange={(e) => { setSesi(e.target.value); setPage(1); }} className={inputCls}>
                <option value="">Semua sesi</option>
                {opsi.sesi.map((s) => <option key={s.id} value={s.id}>Sesi {s.sesi} · {s.jam}</option>)}
              </select></label>
            <button type="button" onClick={terapkanFilter}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:bg-orange-600">
              <Search size={18} /> Cari
            </button>
          </div>
        </section>

        <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-5 print:hidden">
          {(["semua", ...GRUP_LIST] as Grup[]).map((g) => {
            const Icon = IKON[g];
            const r = ringkas[g];
            return <button key={g} type="button" onClick={() => { setGrup(g); setSub(""); setPage(1); }} aria-pressed={grup === g}
              className={`rounded-2xl border bg-white p-4 text-left shadow-lg shadow-orange-200/40 transition hover:-translate-y-0.5 ${grup === g ? "border-orange-400 ring-4 ring-orange-200/60" : "border-orange-100"}`}>
              <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${grup === g ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600"}`}><Icon size={20} /></span>
              <span className="block text-2xl font-semibold tabular-nums text-slate-900">{r.total}</span>
              <span className="text-sm text-slate-500">{g === "semua" ? "Total keseluruhan" : g}</span>
              <span className="mt-2 block text-xs text-slate-500">L {r.L} · P {r.P}</span>
            </button>;
          })}
        </div>

        {grup !== "semua" && <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-orange-100 bg-white p-4 print:hidden">
          <span className="mr-1 self-center text-sm font-medium text-slate-600">{grup}:</span>
          {GRUP[grup].map((s) => <button key={s} type="button" onClick={() => { setSub(sub === s ? "" : s); setPage(1); }} aria-pressed={sub === s}
            className={`rounded-full border px-3.5 py-1.5 text-sm ${sub === s ? "border-orange-500 bg-orange-500 text-white" : "border-orange-200 text-slate-600 hover:bg-orange-50"}`}>{s}</button>)}
        </div>}

        <section className="rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40 print:border-0 print:shadow-none">
          <div className="flex flex-wrap items-center gap-3 border-b border-orange-100 p-4 print:hidden">
            <div className="mr-auto">
              <h2 className="font-semibold text-slate-900">Daftar pengunjung</h2>
              <p className="text-sm text-slate-500">{fmt(mulai)} – {fmt(sampai)} · {hasil.length} data</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
              <input type="search" value={cari} onChange={(e) => { setCari(e.target.value); setPage(1); }} placeholder="Cari nama, alamat, atau instansi" aria-label="Cari pengunjung"
                className="w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60" />
            </div>
            {dipilih.size > 0 && <button type="button" onClick={() => void hapus([...dipilih])}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"><Trash2 size={16} /> Hapus ({dipilih.size})</button>}
            <button type="button" onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-50"><FileDown size={16} /> Simpan ke PDF</button>
          </div>

          {loading ? <p className="px-4 py-14 text-center text-sm text-slate-500">Memuat data pengunjung...</p> : baris.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-14 text-center"><SearchX size={32} className="text-orange-300" />
              <p className="font-medium text-slate-800">Data tidak ditemukan</p><p className="text-sm text-slate-500">Ubah filter atau daftarkan pengunjung baru.</p></div>
          ) : <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-orange-50 text-orange-900"><tr>
                <th className="w-10 px-4 py-3 print:hidden"><input type="checkbox" checked={semuaHalaman} onChange={togglePage} aria-label="Pilih halaman ini" className="h-4 w-4 accent-orange-500" /></th>
                {["Tanggal", "BLC", "Sesi", "Nama", "L/P", "Alamat", "Tgl lahir", "Kategori", "Instansi", "Aksi"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-orange-100">{baris.map((d) => <tr key={d.id} className={`hover:bg-orange-50/60 ${dipilih.has(d.id) ? "bg-orange-50" : ""}`}>
                <td className="px-4 py-3 print:hidden"><input type="checkbox" checked={dipilih.has(d.id)} onChange={() => toggle(d.id)} aria-label={`Pilih ${d.nama}`} className="h-4 w-4 accent-orange-500" /></td>
                <td className="px-4 py-3 tabular-nums text-slate-600">{fmt(d.tanggal)}</td>
                <td className="px-4 py-3 text-slate-600">{d.blc}</td>
                <td className="px-4 py-3 tabular-nums text-slate-600">{d.sesi}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{d.nama}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${d.jenis_kelamin === "L" ? "bg-sky-50 text-sky-600" : "bg-pink-50 text-pink-600"}`}>{d.jenis_kelamin ?? "-"}</span></td>
                <td className="max-w-56 truncate px-4 py-3 text-slate-600" title={d.alamat ?? ""}>{d.alamat || "-"}</td>
                <td className="px-4 py-3 tabular-nums text-slate-600">{fmt(d.tanggal_lahir)}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">{d.kategori || "Belum diisi"}</span></td>
                <td className="max-w-40 truncate px-4 py-3 text-slate-600" title={d.instansi ?? ""}>{d.instansi || "-"}</td>
                <td className="px-4 py-3 print:hidden"><div className="flex gap-1">
                  <button type="button" onClick={() => bukaEdit(d)} aria-label={`Ubah ${d.nama}`} className="rounded-lg p-2 text-sky-600 hover:bg-sky-50"><Pencil size={16} /></button>
                  <button type="button" onClick={() => void hapus([d.id])} aria-label={`Hapus ${d.nama}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                </div></td>
              </tr>)}</tbody>
            </table>
          </div>}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 px-4 py-3 text-sm text-slate-600 print:hidden">
            <div className="flex items-center gap-2"><span>Tampilkan</span>
              <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="rounded-lg border border-orange-200 px-2 py-1">
                {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
              </select><span>baris, {hasil.length === 0 ? 0 : mulaiIdx + 1}–{Math.min(mulaiIdx + perPage, hasil.length)} dari {hasil.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage(halaman - 1)} disabled={halaman <= 1} aria-label="Sebelumnya" className="rounded-lg border border-orange-200 p-1.5 disabled:opacity-40"><ChevronLeft size={18} /></button>
              <span>{halaman} / {totalHalaman}</span>
              <button type="button" onClick={() => setPage(halaman + 1)} disabled={halaman >= totalHalaman} aria-label="Berikutnya" className="rounded-lg border border-orange-200 p-1.5 disabled:opacity-40"><ChevronRight size={18} /></button>
            </div>
          </div>
        </section>

        <section className="hidden print:block">
          <h1 className="text-xl font-semibold">Laporan Pengunjung</h1>
          <p className="mb-4 text-sm">Periode {fmt(mulai)} – {fmt(sampai)} · {blc ? opsi.blc.find((b) => String(b.id) === blc)?.nama : "Semua BLC"}</p>
          <table className="w-full border-collapse text-sm"><thead><tr className="bg-slate-100">
            {["Kelompok", "Kategori", "Laki-laki", "Perempuan", "Jumlah"].map((h) => <th key={h} className="border border-slate-300 px-3 py-2 text-left">{h}</th>)}
          </tr></thead><tbody>{GRUP_LIST.flatMap((g) => GRUP[g].map((s, i) => {
            const r = hitung(data.filter((d) => d.kategori === s));
            return <tr key={g + s}><td className="border border-slate-300 px-3 py-1.5">{i === 0 ? g : ""}</td><td className="border border-slate-300 px-3 py-1.5">{s}</td><td className="border border-slate-300 px-3 py-1.5">{r.L}</td><td className="border border-slate-300 px-3 py-1.5">{r.P}</td><td className="border border-slate-300 px-3 py-1.5">{r.total}</td></tr>;
          }))}<tr className="bg-slate-100 font-semibold"><td className="border border-slate-300 px-3 py-2" colSpan={2}>TOTAL</td><td className="border border-slate-300 px-3 py-2">{ringkas.semua.L}</td><td className="border border-slate-300 px-3 py-2">{ringkas.semua.P}</td><td className="border border-slate-300 px-3 py-2">{ringkas.semua.total}</td></tr></tbody></table>
        </section>
      </div>

      {formTerbuka && <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm" onClick={() => setFormTerbuka(false)}>
        <div role="dialog" aria-modal="true" aria-labelledby="form-pengunjung" onClick={(e) => e.stopPropagation()} className="my-6 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between"><h2 id="form-pengunjung" className="text-xl font-semibold text-slate-900">{editId ? "Ubah Pengunjung" : "Daftarkan Pengunjung"}</h2>
            <button type="button" onClick={() => setFormTerbuka(false)} aria-label="Tutup" className="rounded-lg p-2 text-slate-400 hover:bg-orange-50"><X size={20} /></button></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-medium text-slate-700">Nama *</span><input value={form.nama} onChange={(e) => ubahForm("nama", e.target.value)} className={inputCls} autoFocus /></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">BLC *</span><select value={form.lokasi_blc_id} onChange={(e) => ubahForm("lokasi_blc_id", e.target.value)} className={inputCls}><option value={0}>Pilih BLC</option>{opsi.blc.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}</select></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Sesi *</span><select value={form.sesi_id} onChange={(e) => ubahForm("sesi_id", e.target.value)} className={inputCls}><option value={0}>Pilih sesi</option>{opsi.sesi.map((s) => <option key={s.id} value={s.id}>Sesi {s.sesi} · {s.jam}</option>)}</select></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Jenis kelamin</span><select value={form.jenis_kelamin ?? ""} onChange={(e) => ubahForm("jenis_kelamin", e.target.value)} className={inputCls}><option value="">Pilih</option><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal lahir</span><input type="date" value={form.tanggal_lahir ?? ""} onChange={(e) => ubahForm("tanggal_lahir", e.target.value)} className={inputCls} /></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Kategori</span><select value={form.kategori ?? ""} onChange={(e) => ubahForm("kategori", e.target.value)} className={inputCls}><option value="">Pilih kategori</option>{opsi.kategori.map((k) => <option key={k} value={k}>{k}</option>)}</select></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Instansi</span><input value={form.instansi ?? ""} onChange={(e) => ubahForm("instansi", e.target.value)} className={inputCls} /></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span><input type="email" value={form.email ?? ""} onChange={(e) => ubahForm("email", e.target.value)} className={inputCls} /></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Telepon</span><input type="tel" value={form.telepon ?? ""} onChange={(e) => ubahForm("telepon", e.target.value)} className={inputCls} /></label>
            <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Rating</span><select value={form.rating ?? ""} onChange={(e) => ubahForm("rating", e.target.value)} className={inputCls}><option value="">Tanpa rating</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
            <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-medium text-slate-700">Alamat</span><input value={form.alamat ?? ""} onChange={(e) => ubahForm("alamat", e.target.value)} className={inputCls} /></label>
            <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-medium text-slate-700">Pesan / keperluan</span><textarea rows={3} value={form.pesan ?? ""} onChange={(e) => ubahForm("pesan", e.target.value)} className={inputCls} /></label>
          </div>
          <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setFormTerbuka(false)} className="rounded-xl border border-orange-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50">Batal</button>
            <button type="button" onClick={() => void simpan()} disabled={menyimpan} className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60">{menyimpan ? "Menyimpan..." : editId ? "Simpan perubahan" : "Daftarkan"}</button></div>
        </div>
      </div>}

      {pesan && <div role="status" className="fixed bottom-6 right-6 z-[80] rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg print:hidden">{pesan}</div>}
    </main>
  );
}
