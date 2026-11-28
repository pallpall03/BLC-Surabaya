"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, FileText, ImagePlus, Plus, Printer, Save, Trash2, X,
} from "lucide-react";
import {
  deleteLaporan, getLaporan, getLaporanOpsi, saveLaporan,
  type LaporanHarian, type LaporanKelasOpsi,
} from "@/lib/api";
import TabelRekap from "./components/tabelrekap";

type FotoLaporan = { path: string | null; file: File | null; url: string; deskripsi: string };

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";
const tombolPanah = "rounded-lg border border-orange-200 p-2 text-slate-600 transition hover:bg-orange-50";

const bulanLokal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const tanggalLokal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const namaBulan = (ym: string) => {
  const [y, m] = ym.split("-");
  return `${BULAN[Number(m) - 1]} ${y}`;
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

export default function LaporanKegiatanPelatihanPage() {
  const [bulan, setBulan] = useState(bulanLokal);
  const [namaInstruktur, setNamaInstruktur] = useState("Instruktur");
  const [laporan, setLaporan] = useState<LaporanHarian[]>([]);
  const [opsiKelas, setOpsiKelas] = useState<LaporanKelasOpsi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOpsi, setLoadingOpsi] = useState(true);
  const [error, setError] = useState("");
  const [errorOpsi, setErrorOpsi] = useState("");
  const [pesan, setPesan] = useState("");
  const [menghapusId, setMenghapusId] = useState<number | null>(null);

  const [formAktif, setFormAktif] = useState(false);
  const [editing, setEditing] = useState<LaporanHarian | null>(null);
  const [formTanggal, setFormTanggal] = useState(tanggalLokal);
  const [formKelas, setFormKelas] = useState("");
  const [formAktivitas, setFormAktivitas] = useState("");
  const [formFoto, setFormFoto] = useState<FotoLaporan[]>([]);
  const [formError, setFormError] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const permintaanLaporan = useRef(0);

  const { mulai, sampai } = useMemo(() => rentangBulan(bulan), [bulan]);

  const muatLaporan = useCallback(async () => {
    const permintaan = ++permintaanLaporan.current;
    setLoading(true);
    setError("");
    try {
      const res = await getLaporan(mulai, sampai);
      if (permintaan === permintaanLaporan.current) setLaporan(res.data);
    } catch (e) {
      if (permintaan === permintaanLaporan.current) {
        setError(e instanceof Error ? e.message : "Gagal memuat laporan kegiatan pelatihan.");
        setLaporan([]);
      }
    } finally {
      if (permintaan === permintaanLaporan.current) setLoading(false);
    }
  }, [mulai, sampai]);

  const muatOpsi = useCallback(async () => {
    setLoadingOpsi(true);
    setErrorOpsi("");
    try {
      const res = await getLaporanOpsi();
      setOpsiKelas(res.data.kelas);
    } catch (e) {
      setErrorOpsi(e instanceof Error ? e.message : "Gagal memuat pilihan kelas.");
    } finally {
      setLoadingOpsi(false);
    }
  }, []);

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
    return () => { aktif = false; };
  }, []);

  useEffect(() => {
    void Promise.resolve().then(muatLaporan);
  }, [muatLaporan]);

  useEffect(() => {
    void Promise.resolve().then(muatOpsi);
  }, [muatOpsi]);

  useEffect(() => {
    if (!pesan) return;
    const timer = setTimeout(() => setPesan(""), 3500);
    return () => clearTimeout(timer);
  }, [pesan]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (formAktif && !dialog.open) dialog.showModal();
    if (!formAktif && dialog.open) dialog.close();
  }, [formAktif]);

  const kelasEditingHilang = editing?.kelas_id !== null && editing?.kelas_id !== undefined && !opsiKelas.some((kelas) => kelas.id === editing.kelas_id);
  const kelasTerpilih = opsiKelas.find((kelas) => kelas.id === Number(formKelas)) ?? (
    kelasEditingHilang && editing && Number(formKelas) === editing.kelas_id
      ? { id: editing.kelas_id as number, nama_kelas: editing.kelas ?? "Kelas", materi: editing.materi, materi_id: null, jumlah_peserta: editing.total }
      : undefined
  );
  const hadirEditing = editing && Number(formKelas) === editing.kelas_id ? editing.hadir : null;

  const bersihkanFoto = () => {
    formFoto.forEach((foto) => {
      if (foto.file) URL.revokeObjectURL(foto.url);
    });
    setFormFoto([]);
  };

  const tambahFoto = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) && file.size <= 5 * 1024 * 1024,
    );
    const sisa = Math.max(0, 10 - formFoto.length);
    const diterima = valid.slice(0, sisa);
    if (valid.length !== files.length || diterima.length !== valid.length) {
      setFormError("Gunakan JPG, PNG, WebP, atau GIF maksimal 5 MB, dengan total maksimal 10 foto.");
    }
    setFormFoto((foto) => [...foto, ...diterima.map((file) => ({
      path: null, file, url: URL.createObjectURL(file), deskripsi: "",
    }))]);
  };

  const hapusFoto = (index: number) => {
    const foto = formFoto[index];
    if (foto.file) URL.revokeObjectURL(foto.url);
    setFormFoto((items) => items.filter((_, i) => i !== index));
  };

  const bukaForm = (item?: LaporanHarian) => {
    setEditing(item ?? null);
    setFormTanggal(item?.tanggal ?? tanggalLokal());
    setFormKelas(item?.kelas_id !== null && item?.kelas_id !== undefined ? String(item.kelas_id) : "");
    setFormAktivitas(item?.aktivitas ?? "");
    setFormFoto(item?.foto.map((path, index) => ({
      path,
      file: null,
      url: item.foto_url[index] ?? "",
      deskripsi: item.foto_deskripsi[index] ?? "",
    })) ?? []);
    setFormError("");
    setFormAktif(true);
  };

  const tutupForm = () => {
    if (!menyimpan) {
      bersihkanFoto();
      setFormAktif(false);
    }
  };

  const simpan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formTanggal) return setFormError("Tanggal kegiatan wajib diisi.");
    if (!formAktivitas.trim()) return setFormError("Aktivitas wajib diisi.");
    if (formFoto.length === 0) return setFormError("Tambahkan minimal satu foto kegiatan.");
    setMenyimpan(true);
    setFormError("");
    try {
      const form = new FormData();
      form.append("tanggal", formTanggal);
      form.append("kelas_id", formKelas ? formKelas : "");
      form.append("aktivitas", formAktivitas.trim());
      formFoto.forEach((foto) => {
        if (foto.path) {
          form.append("foto_tetap[]", foto.path);
          form.append("foto_deskripsi_tetap[]", foto.deskripsi.trim());
        } else if (foto.file) {
          form.append("foto[]", foto.file);
          form.append("foto_deskripsi[]", foto.deskripsi.trim());
        }
      });
      await saveLaporan(editing?.id ?? null, form);
      bersihkanFoto();
      setFormAktif(false);
      setPesan(editing ? "Laporan kegiatan diperbarui." : "Laporan kegiatan disimpan.");
      const bulanLaporan = formTanggal.slice(0, 7);
      if (bulanLaporan === bulan) await muatLaporan();
      else setBulan(bulanLaporan);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Gagal menyimpan laporan kegiatan pelatihan.");
    } finally {
      setMenyimpan(false);
    }
  };

  const hapus = async (item: LaporanHarian) => {
    const label = `${item.kelas ?? "Aktivitas"} pada ${item.tanggal.split("-").reverse().join("/")}`;
    if (!window.confirm(`Hapus laporan ${label}?`)) return;
    setMenghapusId(item.id);
    try {
      await deleteLaporan(item.id);
      setLaporan((items) => items.filter((laporanItem) => laporanItem.id !== item.id));
      setPesan("Laporan kegiatan dihapus.");
    } catch (e) {
      setPesan(e instanceof Error ? e.message : "Gagal menghapus laporan kegiatan pelatihan.");
    } finally {
      setMenghapusId(null);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-6 sm:px-8 sm:py-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="instruktur-page-header flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25"><FileText size={28} /></span>
            <div>
              <h1 className="text-2xl font-semibold">Laporan Kegiatan Pelatihan</h1>
              <p className="mt-1 max-w-2xl text-sm text-orange-50">Catat kegiatan mengajar yang telah dilaksanakan. Pilih kelas milikmu, isi tanggal dan aktivitas; kehadiran peserta dihitung otomatis dari absensi kelas.</p>
            </div>
          </div>
          <span className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"><span className="text-slate-400">Instruktur: </span><span className="font-medium text-slate-800">{namaInstruktur}</span></span>
        </header>

        <div className="hidden text-center print:block">
          <h2 className="text-xl font-bold">Laporan Kegiatan Pelatihan BLC Surabaya</h2>
          <p className="mt-1 text-sm">Nama: {namaInstruktur} · Bulan: {namaBulan(bulan)}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-white p-4 shadow-lg shadow-orange-200/40 print:hidden">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setBulan(geser(bulan, -1))} aria-label="Bulan sebelumnya" className={tombolPanah}><ChevronLeft size={18} /></button>
            <div className="relative">
              <CalendarDays size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
              <input type="month" value={bulan} onChange={(event) => event.target.value && setBulan(event.target.value)} aria-label="Pilih bulan" className={`${inputCls} w-auto py-2 pl-10 pr-3 font-medium`} />
            </div>
            <button type="button" onClick={() => setBulan(geser(bulan, 1))} aria-label="Bulan berikutnya" className={tombolPanah}><ChevronRight size={18} /></button>
            <span className="ml-2 hidden text-sm font-semibold text-slate-800 sm:inline">{namaBulan(bulan)}</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => window.print()} disabled={loading || laporan.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50 disabled:opacity-40"><Printer size={16} /> Cetak</button>
            <button type="button" onClick={() => bukaForm()} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-300/50 hover:bg-orange-600"><Plus size={17} /> Tambah laporan</button>
          </div>
        </div>

        {errorOpsi && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 print:hidden"><span>Pilihan kelas belum dapat dimuat: {errorOpsi}</span><button type="button" onClick={() => void muatOpsi()} className="font-semibold underline">Coba lagi</button></div>
        )}

        <section aria-label="Rekap laporan kegiatan">
          <TabelRekap data={laporan} loading={loading} error={error} onTambah={() => bukaForm()} onEdit={bukaForm} onHapus={(item) => void hapus(item)} onCobaLagi={() => void muatLaporan()} menghapusId={menghapusId} />
        </section>

        {laporan.length > 0 && !loading && (
          <div className="hidden justify-end pt-10 print:flex">
            <div className="w-64 text-center text-sm"><p>Surabaya, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p><p className="mt-1">Instruktur,</p><div className="h-20" /><p className="font-semibold underline">{namaInstruktur}</p></div>
          </div>
        )}
      </div>

      <dialog ref={dialogRef} aria-labelledby="form-laporan-judul" onCancel={tutupForm} onClose={() => setFormAktif(false)} onClick={(event) => { if (event.target === event.currentTarget) tutupForm(); }} className="m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-900/50">
        <form onSubmit={(event) => void simpan(event)} className="flex max-h-[92dvh] flex-col">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><ImagePlus size={20} /></span>
              <div>
                <h2 id="form-laporan-judul" className="text-lg font-semibold text-slate-900">{editing ? "Ubah laporan kegiatan" : "Tambah laporan kegiatan"}</h2>
                <p className="mt-1 text-sm text-slate-500">Lengkapi detail kegiatan dan dokumentasikan dengan foto.</p>
              </div>
            </div>
            <button type="button" onClick={tutupForm} aria-label="Tutup formulir" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
          </header>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-slate-50/50 px-5 py-5 sm:px-6 sm:py-6">
            <section aria-labelledby="bagian-detail-kegiatan" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">1</span>
                <h3 id="bagian-detail-kegiatan" className="text-sm font-semibold text-slate-900">Detail kegiatan</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal kegiatan <span className="text-red-500">*</span></span>
                  <input type="date" required max={tanggalLokal()} value={formTanggal} onChange={(event) => setFormTanggal(event.target.value)} className={inputCls} />
                  <span className="mt-1.5 block text-xs text-slate-500">Kegiatan yang sudah dilaksanakan.</span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Kelas <span className="font-normal text-slate-400">(opsional)</span></span>
                  <select value={formKelas} onChange={(event) => setFormKelas(event.target.value)} disabled={loadingOpsi} className={inputCls}>
                    <option value="">{loadingOpsi ? "Memuat kelas..." : "Tanpa kelas / aktivitas lain"}</option>
                    {kelasEditingHilang && editing && <option value={editing.kelas_id ?? ""}>{editing.kelas ?? "Kelas lama"}</option>}
                    {opsiKelas.map((kelas) => <option key={kelas.id} value={kelas.id}>{kelas.nama_kelas}</option>)}
                  </select>
                  <span className="mt-1.5 block text-xs text-slate-500">Hanya kelas milik instruktur ini.</span>
                </label>
              </div>
              {kelasTerpilih ? (
                <div className="mt-4 grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm sm:grid-cols-3">
                  <div><span className="block text-xs text-slate-500">Materi</span><span className="mt-1 block font-medium text-slate-800">{kelasTerpilih.materi ?? "Belum ditentukan"}</span></div>
                  <div><span className="block text-xs text-slate-500">Total peserta</span><span className="mt-1 block font-semibold text-slate-800">{kelasTerpilih.jumlah_peserta} orang</span></div>
                  <div><span className="block text-xs text-slate-500">Kehadiran</span><span className="mt-1 block font-semibold text-slate-800">{hadirEditing === null ? "Dihitung otomatis dari absensi" : `${hadirEditing} dari ${kelasTerpilih.jumlah_peserta} orang`}</span></div>
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">Tanpa kelas, kehadiran peserta tidak dihitung.</p>
              )}
            </section>

            <section aria-labelledby="bagian-aktivitas" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">2</span>
                <h3 id="bagian-aktivitas" className="text-sm font-semibold text-slate-900">Uraian aktivitas</h3>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Kegiatan yang dilakukan <span className="text-red-500">*</span></span>
                <textarea required rows={5} value={formAktivitas} onChange={(event) => setFormAktivitas(event.target.value)} placeholder="Contoh: peserta mempraktikkan penggunaan aplikasi perkantoran dengan pendampingan instruktur..." className={inputCls} />
                <span className="mt-1.5 block text-xs text-slate-500">Tuliskan materi, metode, dan hasil kegiatan secara ringkas.</span>
              </label>
            </section>

            <section aria-labelledby="bagian-foto" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">3</span>
                  <div>
                    <h3 id="bagian-foto" className="text-sm font-semibold text-slate-900">Foto &amp; deskripsi kegiatan <span className="text-red-500">*</span></h3>
                    <p className="mt-1 text-xs text-slate-500">Minimal 1 foto, maksimal 10 foto · 5 MB per foto.</p>
                  </div>
                </div>
                {formFoto.length > 0 && <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">{formFoto.length} / 10 foto</span>}
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 px-5 py-7 text-center transition hover:border-orange-400 hover:bg-orange-50">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm"><ImagePlus size={22} /></span>
                <span className="mt-3 text-sm font-semibold text-slate-800">Klik untuk memilih foto</span>
                <span className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, atau GIF · dapat memilih beberapa foto sekaligus</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" onChange={(event) => { tambahFoto(event.target.files); event.target.value = ""; }} />
              </label>

              {formFoto.length > 0 && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {formFoto.map((foto, index) => (
                    <article key={foto.path ?? foto.url} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <div className="relative bg-slate-100">
                        <img src={foto.url} alt={`Foto kegiatan ${index + 1}`} width={480} height={320} className="h-40 w-full object-cover" />
                        <span className="absolute left-3 top-3 rounded-lg bg-slate-900/70 px-2 py-1 text-[11px] font-medium text-white">Foto {index + 1}</span>
                        <button type="button" onClick={() => hapusFoto(index)} aria-label={`Hapus foto ${index + 1}`} className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow hover:bg-red-50"><Trash2 size={15} /></button>
                      </div>
                      <label className="block p-4">
                        <span className="mb-1.5 block text-sm font-medium text-slate-700">Deskripsi foto {index + 1} <span className="font-normal text-slate-400">(opsional)</span></span>
                        <textarea rows={2} maxLength={500} value={foto.deskripsi} onChange={(event) => setFormFoto((items) => items.map((item, i) => i === index ? { ...item, deskripsi: event.target.value } : item))} placeholder="Jelaskan kegiatan yang terlihat pada foto ini..." className={inputCls} />
                        <span className="mt-1 block text-right text-[11px] text-slate-400">{foto.deskripsi.length} / 500</span>
                      </label>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}
          </div>

          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
            <p className="text-xs text-slate-500"><span className="text-red-500">*</span> Wajib diisi · minimal satu foto kegiatan</p>
            <div className="flex gap-2">
              <button type="button" onClick={tutupForm} disabled={menyimpan} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Batal</button>
              <button type="submit" disabled={menyimpan} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"><Save size={17} /> {menyimpan ? "Menyimpan..." : editing ? "Simpan perubahan" : "Simpan laporan"}</button>
            </div>
          </footer>
        </form>
      </dialog>

      {pesan && <div role="status" className="fixed bottom-6 right-6 z-[80] max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg print:hidden">{pesan}</div>}
    </main>
  );
}
