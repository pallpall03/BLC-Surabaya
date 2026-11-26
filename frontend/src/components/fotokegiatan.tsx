"use client";

/* eslint-disable @next/next/no-img-element */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type FormEvent } from "react";
import {
  CalendarDays, CheckSquare, ImagePlus, Pencil, Plus, Printer, Save,
  Square, Trash2, X,
} from "lucide-react";
import {
  deleteFotoKegiatan, getFotoKegiatan, getFotoKegiatanOpsi, saveFotoKegiatan,
  type FotoKegiatan,
} from "@/lib/api";
import FotoDokumentasi from "@/components/shared/FotoDokumentasi";

type FotoTetap = { path: string; url: string; deskripsi: string };
type FotoBaru = { file: File; url: string; deskripsi: string };
type OpsiFoto = { blc: { id: number; nama: string }[]; sesi: { id: number; sesi: number; jam: string }[] };
export type FotoKegiatanHandle = { bukaForm: () => void };

const tanggalLokal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const fmt = (t: string) => t.split("-").reverse().join("/");
const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

const FotoKegiatan = forwardRef<FotoKegiatanHandle, { onPerubahan?: () => void | Promise<void> }>(function FotoKegiatan({ onPerubahan }, ref) {
  const [pesan, setPesan] = useState("");
  const [opsi, setOpsi] = useState<OpsiFoto>({ blc: [], sesi: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menghapusId, setMenghapusId] = useState<number | null>(null);
  const [formAktif, setFormAktif] = useState(false);
  const [editing, setEditing] = useState<FotoKegiatan | null>(null);
  const [tanggal, setTanggal] = useState(tanggalLokal);
  const [sesiId, setSesiId] = useState(0);
  const [lokasiId, setLokasiId] = useState(0);
  const [ket, setKet] = useState("");
  const [fotoTetap, setFotoTetap] = useState<FotoTetap[]>([]);
  const [fotoBaru, setFotoBaru] = useState<FotoBaru[]>([]);
  const [formError, setFormError] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);

  const [mulai, setMulai] = useState(() => tanggalLokal().slice(0, 8) + "01");
  const [sampai, setSampai] = useState(tanggalLokal);
  const [filterBlc, setFilterBlc] = useState("");
  const [filterSesi, setFilterSesi] = useState("");
  const [laporan, setLaporan] = useState<FotoKegiatan[]>([]);
  const [dipilih, setDipilih] = useState<Set<number>>(new Set());
  const [coba, setCoba] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const toast = useCallback((t: string) => setPesan(t), []);

  useEffect(() => {
    if (!pesan) return;
    const timer = setTimeout(() => setPesan(""), 3500);
    return () => clearTimeout(timer);
  }, [pesan]);

  const muatLaporan = useCallback(async () => {
    if (!mulai || !sampai || mulai > sampai) return;
    setLoading(true);
    setError("");
    try {
      const res = await getFotoKegiatan({
        mulai,
        sampai,
        lokasi_blc_id: filterBlc ? Number(filterBlc) : undefined,
        sesi_id: filterSesi ? Number(filterSesi) : undefined,
      });
      setLaporan(res.data ?? []);
      setDipilih(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat foto dan laporan pengunjung.");
      setLaporan([]);
    } finally {
      setLoading(false);
    }
  }, [mulai, sampai, filterBlc, filterSesi]);

  useEffect(() => {
    let aktif = true;
    getFotoKegiatanOpsi().then((res) => {
      if (!aktif) return;
      setOpsi(res.data);
      setSesiId((id) => id || res.data.sesi[0]?.id || 0);
      setLokasiId((id) => id || res.data.blc[0]?.id || 0);
    }).catch(() => {
      if (aktif) toast("Gagal memuat pilihan BLC dan sesi.");
    });
    return () => { aktif = false; };
  }, [toast]);

  useEffect(() => {
    void Promise.resolve().then(muatLaporan);
  }, [muatLaporan, coba]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (formAktif && !dialog.open) dialog.showModal();
    if (!formAktif && dialog.open) dialog.close();
  }, [formAktif]);

  const bersihkanFoto = () => {
    fotoBaru.forEach((foto) => URL.revokeObjectURL(foto.url));
    setFotoBaru([]);
    setFotoTetap([]);
  };

  const fotoDariData = (data: FotoKegiatan): FotoTetap[] =>
    data.foto.map((path, index) => ({
      path,
      url: data.foto_url[index] ?? "",
      deskripsi: data.foto_deskripsi?.[index] ?? "",
    }));

  const bukaForm = useCallback((item?: FotoKegiatan) => {
    fotoBaru.forEach((foto) => URL.revokeObjectURL(foto.url));
    setFotoBaru([]);
    setEditing(item ?? null);
    setTanggal(item?.tanggal ?? tanggalLokal());
    setSesiId(item?.sesi_id ?? sesiId);
    setLokasiId(item?.lokasi_blc_id ?? lokasiId);
    setKet(item?.keterangan ?? "");
    setFotoTetap(item ? fotoDariData(item) : []);
    setFormError("");
    setFormAktif(true);
  }, [fotoBaru, sesiId, lokasiId]);

  useImperativeHandle(ref, () => ({ bukaForm }), [bukaForm]);

  const tutupForm = () => {
    if (menyimpan) return;
    bersihkanFoto();
    setFormAktif(false);
  };

  const tambahFoto = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) &&
      file.size <= 5 * 1024 * 1024,
    );
    const sisa = Math.max(0, 10 - fotoTetap.length - fotoBaru.length);
    const diterima = valid.slice(0, sisa);
    if (valid.length !== files.length || diterima.length !== valid.length) {
      setFormError("Gunakan JPG, PNG, WebP, atau GIF maksimal 5 MB, dengan total maksimal 10 foto.");
    } else {
      setFormError("");
    }
    setFotoBaru((lama) => [...lama, ...diterima.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      deskripsi: "",
    }))]);
  };

  const hapusFotoBaru = (index: number) => setFotoBaru((lama) => {
    URL.revokeObjectURL(lama[index].url);
    return lama.filter((_, i) => i !== index);
  });

  const simpan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tanggal || !sesiId || !lokasiId) return setFormError("Pilih tanggal, BLC, dan sesi.");
    if (!ket.trim()) return setFormError("Laporan kegiatan pengunjung wajib diisi.");
    if (fotoTetap.length + fotoBaru.length === 0) return setFormError("Tambahkan minimal satu foto.");
    if ([...fotoTetap, ...fotoBaru].some((foto) => foto.deskripsi.length > 500)) {
      return setFormError("Deskripsi setiap foto maksimal 500 karakter.");
    }

    const form = new FormData();
    form.append("tanggal", tanggal);
    form.append("sesi_id", String(sesiId));
    form.append("lokasi_blc_id", String(lokasiId));
    form.append("keterangan", ket.trim());
    fotoTetap.forEach(({ path, deskripsi }) => {
      form.append("foto_tetap[]", path);
      form.append("foto_deskripsi_tetap[]", deskripsi.trim());
    });
    fotoBaru.forEach(({ file, deskripsi }) => {
      form.append("foto[]", file);
      form.append("foto_deskripsi[]", deskripsi.trim());
    });

    setMenyimpan(true);
    setFormError("");
    try {
      await saveFotoKegiatan(editing?.id ?? null, form);
      bersihkanFoto();
      setFormAktif(false);
      toast(editing ? "Data pengunjung berhasil diperbarui." : "Data pengunjung berhasil ditambahkan.");
      await muatLaporan();
      await onPerubahan?.();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Gagal menyimpan data pengunjung.");
    } finally {
      setMenyimpan(false);
    }
  };

  const hapusLaporan = async (item: FotoKegiatan) => {
    if (!window.confirm(`Hapus data pengunjung ${fmt(item.tanggal)} sesi ${item.sesi ?? "-"}?`)) return;
    setMenghapusId(item.id);
    try {
      await deleteFotoKegiatan(item.id);
      if (editing?.id === item.id) tutupForm();
      toast("Data pengunjung berhasil dihapus.");
      await muatLaporan();
      await onPerubahan?.();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal menghapus data pengunjung.");
    } finally {
      setMenghapusId(null);
    }
  };

  const toggleFoto = (id: number) => setDipilih((sebelumnya) => {
    const baru = new Set(sebelumnya);
    if (baru.has(id)) baru.delete(id);
    else baru.add(id);
    return baru;
  });
  const semuaDipilih = laporan.length > 0 && dipilih.size === laporan.length;
  const rentangValid = Boolean(mulai && sampai && mulai <= sampai);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-white p-4 shadow-lg shadow-orange-200/40 print:hidden">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Foto &amp; laporan pengunjung</h2>
          <p className="mt-1 text-sm text-slate-500">Tambah laporan sekaligus foto dan deskripsi kegiatannya.</p>
        </div>
        <button type="button" onClick={() => bukaForm()} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-300/50 hover:bg-orange-600"><Plus size={17} /> Tambah data</button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-lg shadow-orange-200/40 print:border-0 print:shadow-none">
        <div className="grid gap-4 border-b border-orange-100 p-5 print:hidden sm:grid-cols-2 lg:grid-cols-4">
          <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal mulai</span><input type="date" value={mulai} onChange={(event) => { setMulai(event.target.value); setDipilih(new Set()); }} className={inputCls} /></label>
          <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal sampai</span><input type="date" value={sampai} onChange={(event) => { setSampai(event.target.value); setDipilih(new Set()); }} className={inputCls} /></label>
          <label><span className="mb-1.5 block text-sm font-medium text-slate-700">BLC</span><select value={filterBlc} onChange={(event) => { setFilterBlc(event.target.value); setDipilih(new Set()); }} className={inputCls}><option value="">Semua BLC</option>{opsi.blc.map((blc) => <option key={blc.id} value={blc.id}>{blc.nama}</option>)}</select></label>
          <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Sesi</span><select value={filterSesi} onChange={(event) => { setFilterSesi(event.target.value); setDipilih(new Set()); }} className={inputCls}><option value="">Semua sesi</option>{opsi.sesi.map((sesi) => <option key={sesi.id} value={sesi.id}>Sesi {sesi.sesi}</option>)}</select></label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 p-4 print:hidden">
          <p className="text-sm text-slate-500">{rentangValid ? `${fmt(mulai)} – ${fmt(sampai)} · ${laporan.length} data` : "Tanggal mulai tidak boleh melewati tanggal sampai."}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setDipilih(semuaDipilih ? new Set() : new Set(laporan.map((item) => item.id)))} disabled={laporan.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-orange-50 disabled:opacity-40">{semuaDipilih ? <CheckSquare size={16} /> : <Square size={16} />} Pilih semua</button>
            <button type="button" onClick={() => window.print()} disabled={dipilih.size === 0} className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-40"><Printer size={16} /> Cetak terpilih</button>
          </div>
        </div>

        {loading ? (
          <div role="status" className="px-4 py-16 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" /><p className="mt-4 text-sm text-slate-500">Memuat data pengunjung...</p></div>
        ) : error ? (
          <div role="alert" className="flex flex-col items-center gap-3 px-4 py-14 text-center"><p className="font-medium text-slate-800">Data pengunjung belum dapat dimuat</p><p className="max-w-md text-sm text-slate-500">{error}</p><button type="button" onClick={() => setCoba((nilai) => nilai + 1)} className="rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50">Coba lagi</button></div>
        ) : laporan.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-16 text-center"><ImagePlus size={36} className="text-orange-400" /><p className="font-medium text-slate-800">Belum ada data pengunjung</p><p className="text-sm text-slate-500">Klik Tambah data untuk mengisi laporan dan foto kegiatan.</p><button type="button" onClick={() => bukaForm()} className="mt-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"><Plus size={16} /> Tambah data</button></div>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {laporan.map((item) => {
              const terpilih = dipilih.has(item.id);
              return (
                <article key={item.id} className={`overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg print:break-inside-avoid ${terpilih ? "border-orange-400 ring-4 ring-orange-200/60" : "border-orange-100"} ${dipilih.size > 0 && !terpilih ? "print:hidden" : ""}`}>
                  <button type="button" onClick={() => toggleFoto(item.id)} aria-pressed={terpilih} aria-label={`Pilih data ${fmt(item.tanggal)}`} className="relative block w-full text-left print:hidden">
                    <FotoDokumentasi key={item.foto_url[0]} src={item.foto_url[0]} alt={`Kegiatan pengunjung ${fmt(item.tanggal)}`} width={640} height={400} className="h-48 w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-lg bg-white/90 p-1 text-orange-500 shadow">{terpilih ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-400" />}</span>
                    {item.foto_url.length > 1 && <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/75 px-2.5 py-1 text-xs text-white">{item.foto_url.length} foto</span>}
                  </button>
                  <div className="print:hidden"><FotoDokumentasi key={`cetak-${item.foto_url[0]}`} src={item.foto_url[0]} alt={`Kegiatan pengunjung ${fmt(item.tanggal)}`} width={640} height={400} className="h-48 w-full object-cover" /></div>
                  <div className="p-4">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"><CalendarDays size={14} className="text-orange-400" />{fmt(item.tanggal)} · Sesi {item.sesi ?? "-"}</h3>
                    <p className="mt-1 text-xs font-medium text-orange-600">{item.blc ?? "BLC telah dihapus"}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.keterangan}</p>
                    {item.foto_deskripsi?.[0] && <div className="mt-3 rounded-lg bg-orange-50 p-3"><p className="text-xs font-medium text-orange-700">Deskripsi foto 1</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{item.foto_deskripsi[0]}</p></div>}
                    <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                      <button type="button" onClick={() => bukaForm(item)} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700 hover:bg-sky-100"><Pencil size={14} /> Ubah data</button>
                      <button type="button" onClick={() => void hapusLaporan(item)} disabled={menghapusId === item.id} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-40"><Trash2 size={14} /> {menghapusId === item.id ? "Menghapus..." : "Hapus"}</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <dialog ref={dialogRef} aria-labelledby="form-pengunjung-judul" onCancel={tutupForm} onClose={() => setFormAktif(false)} onClick={(event) => { if (event.target === event.currentTarget) tutupForm(); }} className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-orange-200 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-900/50">
        <form onSubmit={(event) => void simpan(event)}>
          <div className="flex items-start justify-between gap-4 border-b border-orange-100 p-5">
            <div><h2 id="form-pengunjung-judul" className="text-lg font-semibold text-slate-900">{editing ? "Ubah data pengunjung" : "Tambah data pengunjung"}</h2><p className="mt-1 text-sm text-slate-500">Isi laporan kegiatan dan unggah foto beserta deskripsinya.</p></div>
            <button type="button" onClick={tutupForm} aria-label="Tutup formulir" className="rounded-lg p-1.5 text-slate-400 hover:bg-orange-50 hover:text-orange-600"><X size={20} /></button>
          </div>
          <div className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal kegiatan</span><input type="date" required value={tanggal} onChange={(event) => setTanggal(event.target.value)} className={inputCls} /></label>
              <label><span className="mb-1.5 block text-sm font-medium text-slate-700">Sesi / jam</span><select required value={sesiId} onChange={(event) => setSesiId(Number(event.target.value))} className={inputCls}><option value={0}>Pilih sesi</option>{opsi.sesi.map((sesi) => <option key={sesi.id} value={sesi.id}>{sesi.sesi} · {sesi.jam}</option>)}</select></label>
              <label><span className="mb-1.5 block text-sm font-medium text-slate-700">BLC</span><select required value={lokasiId} onChange={(event) => setLokasiId(Number(event.target.value))} className={inputCls}><option value={0}>Pilih BLC</option>{opsi.blc.map((blc) => <option key={blc.id} value={blc.id}>{blc.nama}</option>)}</select></label>
            </div>
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700">Laporan kegiatan pengunjung</span><textarea required rows={4} value={ket} onChange={(event) => setKet(event.target.value)} placeholder="Ceritakan kegiatan pelayanan atau informasi penting pada sesi ini..." className={inputCls} /><span className="mt-1.5 block text-xs text-slate-400">Laporan ini otomatis muncul di tab Laporan pengunjung.</span></label>
            <section className="space-y-3 rounded-xl border border-orange-100 bg-orange-50/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h3 className="text-sm font-semibold text-slate-800">Foto &amp; deskripsi kegiatan</h3><p className="mt-1 text-xs text-slate-500">Maksimal 10 foto, masing-masing maksimal 5 MB dan 500 karakter deskripsi.</p></div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-300/50 hover:bg-orange-600"><ImagePlus size={16} /> Tambah foto<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" onChange={(event) => { tambahFoto(event.target.files); event.target.value = ""; }} /></label>
              </div>
              {fotoTetap.length + fotoBaru.length === 0 ? (
                <p className="rounded-xl border-2 border-dashed border-orange-200 bg-white px-4 py-8 text-center text-sm text-slate-500">Belum ada foto. Unggah foto dan tuliskan kegiatan yang sedang dilakukan.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {fotoTetap.map((foto, index) => (
                    <article key={foto.path} className="overflow-hidden rounded-xl border border-orange-100 bg-white">
                      <div className="relative"><img src={foto.url} alt={`Foto kegiatan ${index + 1}`} width={480} height={320} className="h-36 w-full object-cover" /><button type="button" onClick={() => setFotoTetap((items) => items.filter((_, i) => i !== index))} aria-label={`Hapus foto ${index + 1}`} className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-600 shadow hover:bg-red-50"><Trash2 size={15} /></button></div>
                      <label className="block p-3"><span className="mb-1 block text-xs font-medium text-slate-600">Deskripsi foto {index + 1}</span><textarea rows={2} maxLength={500} value={foto.deskripsi} onChange={(event) => setFotoTetap((items) => items.map((item, i) => i === index ? { ...item, deskripsi: event.target.value } : item))} placeholder="Jelaskan kegiatan pada foto ini..." className={inputCls} /></label>
                    </article>
                  ))}
                  {fotoBaru.map((foto, index) => (
                    <article key={foto.url} className="overflow-hidden rounded-xl border border-orange-100 bg-white">
                      <div className="relative"><img src={foto.url} alt={`Foto baru ${index + 1}`} width={480} height={320} className="h-36 w-full object-cover" /><button type="button" onClick={() => hapusFotoBaru(index)} aria-label={`Hapus foto baru ${index + 1}`} className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-600 shadow hover:bg-red-50"><Trash2 size={15} /></button></div>
                      <p className="truncate bg-white px-3 py-1.5 text-xs text-slate-500">{foto.file.name}</p>
                      <label className="block p-3"><span className="mb-1 block text-xs font-medium text-slate-600">Deskripsi foto {fotoTetap.length + index + 1}</span><textarea rows={2} maxLength={500} value={foto.deskripsi} onChange={(event) => setFotoBaru((items) => items.map((item, i) => i === index ? { ...item, deskripsi: event.target.value } : item))} placeholder="Jelaskan kegiatan pada foto ini..." className={inputCls} /></label>
                    </article>
                  ))}
                </div>
              )}
            </section>
            {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}
          </div>
          <div className="flex justify-end gap-3 border-t border-orange-100 bg-orange-50/40 px-5 py-4">
            <button type="button" onClick={tutupForm} disabled={menyimpan} className="rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 disabled:opacity-50">Batal</button>
            <button type="submit" disabled={menyimpan} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 hover:bg-orange-600 disabled:opacity-60"><Save size={17} /> {menyimpan ? "Menyimpan..." : editing ? "Simpan perubahan" : "Simpan data"}</button>
          </div>
        </form>
      </dialog>

      {pesan && <div role="status" className="fixed bottom-6 right-6 z-[80] max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg print:hidden">{pesan}</div>}
    </div>
  );
});

export default FotoKegiatan;
