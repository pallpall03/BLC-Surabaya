"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bold, Eye, ImagePlus, Italic, Link2, List, ListOrdered, Newspaper, Pencil, Plus, Search, Star, Tags, Trash2, Underline, Undo, Redo, Table2, X } from "lucide-react";
import { ambilArtikel, ambilKategori, formatTanggal, hapusArtikel, hapusKategori, sekarang, simpanArtikel, simpanKategori, type Artikel, type Kategori, type StatusArtikel } from "./data";

const BARIS = 10;
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";
const tampilWaktu = (s: string) => s.replace("T", " ");
const teksBiasa = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

export default function HalamanArtikel() {
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [tab, setTab] = useState<"semua" | StatusArtikel>("semua");
  const [filterKat, setFilterKat] = useState<number | "">("");
  const [cari, setCari] = useState("");
  const [halaman, setHalaman] = useState(1);
  const [modal, setModal] = useState<{ id?: number } | null>(null);
  const [judul, setJudul] = useState("");
  const [kategoriIds, setKategoriIds] = useState<number[]>([]);
  const [isi, setIsi] = useState("");
  const [status, setStatus] = useState<StatusArtikel>("nonaktif");
  const [foto, setFoto] = useState<string | null>(null);
  const [unggulan, setUnggulan] = useState(false);
  const [urutan, setUrutan] = useState("1");
  const [galat, setGalat] = useState("");
  const [preview, setPreview] = useState(false);
  const [modalKat, setModalKat] = useState(false);
  const [editKat, setEditKat] = useState<number | null>(null);
  const [namaKat, setNamaKat] = useState("");
  const [galatKat, setGalatKat] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([ambilArtikel(), ambilKategori()]).then(([a, k]) => { setArtikel(a); setKategori(k); }).finally(() => setMemuat(false));
  }, []);

  const namaKategori = useMemo(() => (ids: number[]) => ids.map((id) => kategori.find((k) => k.id === id)?.nama).filter(Boolean).join(", ") || "Tanpa kategori", [kategori]);
  const jumlahPerKategori = (id: number) => artikel.filter((a) => a.kategoriIds.includes(id)).length;
  const hasil = useMemo(() => artikel.filter((a) => (tab === "semua" || a.status === tab) && (filterKat === "" || a.kategoriIds.includes(filterKat)) && a.judul.toLowerCase().includes(cari.toLowerCase())).sort((a, b) => a.urutan - b.urutan || b.diubah.localeCompare(a.diubah)), [artikel, tab, filterKat, cari]);
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS));
  const halamanAman = Math.min(halaman, totalHalaman);
  const awal = (halamanAman - 1) * BARIS;
  const tampil = hasil.slice(awal, awal + BARIS);

  function bukaTambah() {
    setJudul(""); setKategoriIds([]); setIsi(""); setStatus("nonaktif"); setFoto(null); setUnggulan(false);
    setUrutan(String(artikel.reduce((m, a) => Math.max(m, a.urutan), 0) + 1)); setGalat(""); setPreview(false); setModal({});
  }
  function bukaUbah(a: Artikel) {
    setJudul(a.judul); setKategoriIds(a.kategoriIds); setIsi(a.isi); setStatus(a.status); setFoto(a.foto); setUnggulan(a.unggulan); setUrutan(String(a.urutan)); setGalat(""); setPreview(false); setModal({ id: a.id });
  }
  function formatEditor(perintah: string, nilai?: string) {
    editorRef.current?.focus();
    document.execCommand(perintah, false, nilai);
    setIsi(editorRef.current?.innerHTML ?? "");
  }
  function tambahLink() {
    const url = window.prompt("Masukkan URL tautan:");
    if (url) formatEditor("createLink", url);
  }
  function tambahGambarNarasi() {
    const url = window.prompt("Masukkan URL gambar:");
    if (url) formatEditor("insertImage", url);
  }
  function tambahTabel() {
    const html = '<table border="1" style="border-collapse:collapse;width:100%"><tbody><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><p></p>';
    formatEditor("insertHTML", html);
  }
  async function pilihFoto(file?: File) {
    if (!file) return;
    if (!/^image\/(jpeg|png|gif)$/.test(file.type)) { setGalat("Foto harus berformat JPEG, PNG, atau GIF."); return; }
    if (file.size > 2 * 1024 * 1024) { setGalat("Ukuran foto maksimal 2 MB agar dapat disimpan di penyimpanan browser."); return; }
    const reader = new FileReader();
    reader.onload = () => setFoto(String(reader.result));
    reader.readAsDataURL(file);
  }
  async function handleSimpan() {
    const html = editorRef.current?.innerHTML ?? isi;
    const ringkasan = teksBiasa(html).slice(0, 160);
    const nomorUrutan = Number(urutan);
    if (!judul.trim()) return setGalat("Judul artikel wajib diisi.");
    if (!teksBiasa(html)) return setGalat("Narasi artikel wajib diisi.");
    if (!kategoriIds.length) return setGalat("Pilih minimal satu kategori artikel.");
    if (!Number.isInteger(nomorUrutan) || nomorUrutan < 1) return setGalat("Urutan harus berupa angka bulat positif.");
    try {
      const hasilSimpan = await simpanArtikel({ judul: judul.trim(), kategoriId: kategoriIds[0], kategoriIds, ringkasan, isi: html, foto, status, unggulan, urutan: nomorUrutan }, modal?.id);
      setArtikel((lama) => modal?.id ? lama.map((a) => a.id === modal.id ? hasilSimpan : a) : [hasilSimpan, ...lama]);
      setModal(null); setPreview(false); setGalat("");
    } catch (e) { setGalat(e instanceof Error ? e.message : "Gagal menyimpan artikel."); }
  }
  async function handleHapus(a: Artikel) {
    if (!window.confirm(`Hapus artikel "${a.judul}"?`)) return;
    await hapusArtikel(a.id); setArtikel((lama) => lama.filter((x) => x.id !== a.id));
  }
  async function simpanKat() {
    const nama = namaKat.trim();
    if (!nama) return setGalatKat("Nama kategori wajib diisi.");
    if (kategori.some((k) => k.nama.toLowerCase() === nama.toLowerCase() && k.id !== editKat)) return setGalatKat("Nama kategori sudah ada.");
    const hasilSimpan = await simpanKategori(nama, editKat ?? undefined);
    setKategori((lama) => editKat ? lama.map((k) => k.id === editKat ? hasilSimpan : k) : [...lama, hasilSimpan]);
    setNamaKat(""); setEditKat(null); setGalatKat("");
  }
  async function hapusKat(k: Kategori) {
    const jumlah = jumlahPerKategori(k.id);
    if (jumlah) { window.alert(`Kategori ${k.nama} masih digunakan oleh ${jumlah} artikel.`); return; }
    if (!window.confirm(`Hapus kategori ${k.nama}?`)) return;
    await hapusKategori(k.id); setKategori((lama) => lama.filter((x) => x.id !== k.id));
    if (filterKat === k.id) setFilterKat("");
  }
  const tabStatus = [{ kode: "semua" as const, label: "Semua", jumlah: artikel.length }, { kode: "aktif" as const, label: "Aktif", jumlah: artikel.filter((a) => a.status === "aktif").length }, { kode: "nonaktif" as const, label: "Nonaktif", jumlah: artikel.filter((a) => a.status === "nonaktif").length }];

  return <div className="space-y-5">
    <section className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <div><h2 className="text-lg font-semibold text-slate-800">Pengelolaan Artikel</h2><p className="text-sm text-slate-400">Kelola artikel dan kategori website</p></div>
        <div className="flex gap-2"><button onClick={() => { setModalKat(true); setEditKat(null); setNamaKat(""); setGalatKat(""); }} className="flex items-center gap-2 rounded-xl border border-violet-200 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"><Tags size={16}/> Kelola Kategori</button><button onClick={bukaTambah} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"><Plus size={16}/> Tambah Artikel</button></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex gap-2">{tabStatus.map((t) => <button key={t.kode} onClick={() => { setTab(t.kode); setHalaman(1); }} className={`rounded-full px-4 py-1.5 text-sm ${tab === t.kode ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>{t.label} ({t.jumlah})</button>)}</div>
        <div className="flex flex-wrap gap-2"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={cari} onChange={(e) => { setCari(e.target.value); setHalaman(1); }} placeholder="Cari judul artikel..." className={`${inputClass} pl-9`}/></div><select value={filterKat} onChange={(e) => { setFilterKat(e.target.value ? Number(e.target.value) : ""); setHalaman(1); }} className={`${inputClass} w-auto`}><option value="">Semua kategori</option>{kategori.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}</select></div>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left text-sm"><thead><tr className="bg-slate-50 text-xs uppercase text-slate-500"><th className="px-6 py-3">No</th><th className="px-4 py-3">Urutan</th><th className="px-4 py-3">Judul Artikel</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Penulis</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Dipublikasikan</th><th className="px-6 py-3 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100">{memuat ? <tr><td colSpan={8} className="py-12 text-center text-slate-400">Memuat data...</td></tr> : tampil.length === 0 ? <tr><td colSpan={8} className="py-12 text-center text-slate-400">Belum ada artikel.</td></tr> : tampil.map((a, i) => <tr key={a.id} className="hover:bg-slate-50"><td className="px-6 py-3.5 text-slate-400">{awal + i + 1}</td><td className="px-4 py-3.5">{a.urutan}</td><td className="max-w-xs px-4 py-3.5"><div className="flex items-center gap-2">{a.unggulan && <Star size={14} className="fill-amber-400 text-amber-400"/>}<span className="truncate font-medium text-slate-800">{a.judul}</span></div><p className="truncate text-xs text-slate-400">{a.ringkasan}</p></td><td className="px-4 py-3.5">{namaKategori(a.kategoriIds)}</td><td className="px-4 py-3.5">{a.penulis}</td><td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.status === "aktif" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>{a.status === "aktif" ? "Aktif" : "Nonaktif"}</span></td><td className="px-4 py-3.5">{a.dipublikasi ? formatTanggal(a.dipublikasi) : "-"}</td><td className="px-6 py-3.5"><div className="flex justify-end gap-2"><button onClick={() => bukaUbah(a)} className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-700"><Pencil size={14}/></button><button onClick={() => handleHapus(a)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-600"><Trash2 size={14}/></button></div></td></tr>)}</tbody></table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-500"><span>Menampilkan {hasil.length ? awal + 1 : 0}–{Math.min(awal + BARIS, hasil.length)} dari {hasil.length} artikel</span><div className="flex gap-1"><button disabled={halamanAman === 1} onClick={() => setHalaman(halamanAman - 1)} className="rounded-lg px-3 py-1.5 hover:bg-slate-100 disabled:opacity-40">Sebelumnya</button><span className="px-2 py-1.5">{halamanAman}/{totalHalaman}</span><button disabled={halamanAman === totalHalaman} onClick={() => setHalaman(halamanAman + 1)} className="rounded-lg px-3 py-1.5 hover:bg-slate-100 disabled:opacity-40">Berikutnya</button></div></div>
    </section>

    {modal && <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"><div className="my-6 w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b px-6 py-4"><h3 className="font-semibold text-slate-800">{modal.id ? "Ubah Artikel" : "Tambah Artikel"}</h3><button onClick={() => setModal(null)} aria-label="Tutup" className="rounded-lg p-2 hover:bg-slate-100"><X size={18}/></button></div>
      <div className="space-y-5 p-6">
        <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center"><label className="text-sm font-medium text-slate-700">Judul Artikel</label><input value={judul} onChange={(e) => setJudul(e.target.value)} className={inputClass} placeholder="Masukkan judul artikel"/></div>
        <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center"><label className="text-sm font-medium text-slate-700">Aktif</label><select value={status} onChange={(e) => setStatus(e.target.value as StatusArtikel)} className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="aktif">Ya</option><option value="nonaktif">Tidak</option></select></div>
        <div className="grid gap-2 md:grid-cols-[180px_1fr]"><label className="pt-2 text-sm font-medium text-slate-700">Narasi</label><div className="overflow-hidden rounded-lg border border-slate-300"><div className="flex flex-wrap items-center gap-1 border-b bg-slate-50 p-2">{[{label:"B",icon:<Bold size={15}/>,cmd:"bold"},{label:"I",icon:<Italic size={15}/>,cmd:"italic"},{label:"U",icon:<Underline size={15}/>,cmd:"underline"},{label:"•",icon:<List size={15}/>,cmd:"insertUnorderedList"},{label:"1.",icon:<ListOrdered size={15}/>,cmd:"insertOrderedList"}].map((b) => <button key={b.cmd} type="button" title={b.label} onClick={() => formatEditor(b.cmd)} className="rounded border bg-white p-2 hover:bg-violet-50">{b.icon}</button>)}<span className="mx-1 h-6 border-l"/><button type="button" title="Tambah tautan" onClick={tambahLink} className="rounded border bg-white p-2 hover:bg-violet-50"><Link2 size={15}/></button><button type="button" title="Tambah gambar dari URL" onClick={tambahGambarNarasi} className="rounded border bg-white p-2 hover:bg-violet-50"><ImagePlus size={15}/></button><button type="button" title="Tambah tabel 2x2" onClick={tambahTabel} className="rounded border bg-white p-2 hover:bg-violet-50"><Table2 size={15}/></button><span className="mx-1 h-6 border-l"/><button type="button" title="Undo" onClick={() => formatEditor("undo")} className="rounded border bg-white p-2 hover:bg-violet-50"><Undo size={15}/></button><button type="button" title="Redo" onClick={() => formatEditor("redo")} className="rounded border bg-white p-2 hover:bg-violet-50"><Redo size={15}/></button></div><div key={modal.id ?? "baru"} ref={editorRef} contentEditable suppressContentEditableWarning onInput={(e) => setIsi(e.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: isi }} className="min-h-[300px] max-h-[520px] overflow-y-auto p-4 text-sm leading-7 outline-none [&_img]:my-2 [&_img]:max-w-full [&_table]:my-3 [&_td]:border [&_td]:p-2"/><div className="border-t bg-slate-50 px-3 py-2 text-xs text-slate-400">Gunakan toolbar untuk format teks, tautan, gambar, dan tabel.</div></div></div>
        <div className="grid gap-2 md:grid-cols-[180px_1fr]"><label className="pt-1 text-sm font-medium text-slate-700">Kategori Artikel</label><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{kategori.map((k) => <label key={k.id} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={kategoriIds.includes(k.id)} onChange={(e) => setKategoriIds((old) => e.target.checked ? [...old, k.id] : old.filter((id) => id !== k.id))} className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"/>{k.nama}</label>)}{kategori.length === 0 && <p className="text-sm text-slate-400">Belum ada kategori. Tambahkan melalui tombol Kelola Kategori.</p>}</div></div>
        <div className="grid gap-2 md:grid-cols-[180px_1fr]"><label className="pt-1 text-sm font-medium text-slate-700">Foto (JPEG, PNG, GIF)</label><div><input type="file" accept="image/jpeg,image/png,image/gif" onChange={(e) => pilihFoto(e.target.files?.[0])} className="w-full rounded-lg border border-slate-200 p-2 text-sm"/>{foto && <div className="mt-3"><img src={foto} alt="Preview foto artikel" className="max-h-64 max-w-xs rounded-lg border object-contain"/><button type="button" onClick={() => setFoto(null)} className="mt-2 text-xs text-red-600">Hapus foto</button></div>}<p className="mt-1 text-xs text-slate-400">Maksimal 2 MB untuk penyimpanan browser sementara.</p></div></div>
        <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center"><label className="text-sm font-medium text-slate-700">Urutan tampil</label><input type="number" min="1" step="1" value={urutan} onChange={(e) => setUrutan(e.target.value)} className={`${inputClass} max-w-xs`}/></div>
        <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center"><label className="text-sm font-medium text-slate-700">Artikel unggulan</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={unggulan} onChange={(e) => setUnggulan(e.target.checked)}/> Prioritaskan di landing page</label></div>
        {galat && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{galat}</p>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-slate-50 px-6 py-4"><button onClick={() => setPreview(true)} className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm text-violet-700"><Eye size={16}/> Preview</button><div className="flex gap-2"><button onClick={() => setModal(null)} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-200">Batal</button><button onClick={handleSimpan} className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700">Simpan</button></div></div>
    </div></div>}

    {preview && modal && <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4"><div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white"><div className="flex justify-between border-b p-4"><b>Preview Artikel</b><button onClick={() => setPreview(false)}><X size={18}/></button></div><div className="space-y-4 p-6"><h1 className="text-2xl font-bold">{judul || "Judul Artikel"}</h1><p className="text-xs text-slate-500">{namaKategori(kategoriIds)} · {status === "aktif" ? formatTanggal(sekarang()) : "Belum dipublikasikan"}</p>{foto && <img src={foto} alt="Foto artikel" className="max-h-80 rounded-lg object-contain"/>}<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: isi || "<p>Narasi artikel akan tampil di sini.</p>" }}/></div><div className="border-t p-4 text-right"><button onClick={() => setPreview(false)} className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white">Kembali ke form</button></div></div></div>}

    {modalKat && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4"><div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b px-5 py-4"><h3 className="font-semibold">Kelola Kategori Artikel</h3><button onClick={() => setModalKat(false)}><X size={18}/></button></div><div className="space-y-4 p-5"><div className="flex gap-2"><input value={namaKat} onChange={(e) => setNamaKat(e.target.value)} placeholder="Nama kategori" className={inputClass}/><button onClick={simpanKat} className="shrink-0 rounded-xl bg-violet-600 px-4 text-sm text-white">{editKat ? "Simpan" : "Tambah"}</button></div>{galatKat && <p className="text-sm text-red-600">{galatKat}</p>}<div className="divide-y rounded-xl border">{kategori.map((k) => <div key={k.id} className="flex items-center justify-between p-3"><div><p className="text-sm font-medium">{k.nama}</p><p className="text-xs text-slate-400">Dipakai {jumlahPerKategori(k.id)} artikel</p></div><div className="flex gap-2"><button onClick={() => { setEditKat(k.id); setNamaKat(k.nama); setGalatKat(""); }} className="rounded-lg bg-amber-50 p-2 text-amber-700"><Pencil size={14}/></button><button onClick={() => hapusKat(k)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 size={14}/></button></div></div>)}{kategori.length === 0 && <p className="p-4 text-center text-sm text-slate-400">Belum ada kategori.</p>}</div></div><div className="border-t bg-slate-50 p-4 text-right"><button onClick={() => setModalKat(false)} className="rounded-lg px-4 py-2 text-sm hover:bg-slate-200">Tutup</button></div></div></div>}
  </div>;
}
