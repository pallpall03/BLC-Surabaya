"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
<<<<<<< HEAD
import {
  AlertCircle, BookOpen, CheckCircle2, Clock, Download, FileQuestion,
  FileUp, Plus, Save, Shuffle, Trash2, UploadCloud,
} from "lucide-react";
import {
  getUjianOpsi, type SoalUjian, type Ujian, type UjianInput, type UjianOpsi,
} from "@/lib/api";
import { bacaFileSoal, MAX_SOAL, validasiSoal, type HasilImporSoal } from "./imporSoal";
=======
import { AlertCircle, CalendarClock, CheckCircle2, Clock, Hash, Save, Shuffle } from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

export type NilaiUjian = UjianInput;

const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";
const labelCls = "mb-1.5 block text-sm font-medium text-slate-700";

export const nilaiAwal = (): NilaiUjian => ({
  judul: "",
  materi_id: null,
  tipe: "pretest",
  durasi_menit: 60,
  nilai_minimum: 70,
  acak_soal: false,
  is_aktif: true,
  soal: [soalKosong(1)],
});

export function soalKosong(nomor: number): SoalUjian {
  return { pertanyaan: "", pilihan: ["", "", "", ""], jawaban_benar: 0, nomor, bobot: 1, penjelasan: "" };
}

function Err({ t }: { t?: string }) {
  return t ? <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {t}</p> : null;
}

function unduhTemplate() {
  const csv = "pertanyaan,pilihan_a,pilihan_b,pilihan_c,pilihan_d,jawaban_benar,penjelasan\n\"Apa fungsi Ctrl+S?\",\"Menyimpan\",\"Menyalin\",\"Mencetak\",\"Menghapus\",A,\"Shortcut menyimpan dokumen\"";
  const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "template-soal-ujian.csv"; a.click();
  URL.revokeObjectURL(url);
}

function unduhTxt(hasil: HasilImporSoal) {
  const nama = hasil.namaFile.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]/g, "-") || "soal";
  const url = URL.createObjectURL(new Blob(["\uFEFF" + hasil.teks], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nama}-konversi.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function FormUjian({ awal, kembali, labelSimpan = "Simpan ujian", saving = false, onSimpan }: {
  awal?: Ujian;
  kembali: string;
  labelSimpan?: string;
  saving?: boolean;
  onSimpan: (nilai: NilaiUjian) => void | Promise<void>;
}) {
<<<<<<< HEAD
  const [f, setF] = useState<NilaiUjian>(() => awal ? {
    judul: awal.judul, materi_id: awal.materi_id, tipe: awal.tipe,
    durasi_menit: awal.durasi_menit, nilai_minimum: awal.nilai_minimum,
    acak_soal: awal.acak_soal, is_aktif: awal.is_aktif,
    soal: awal.soal.length ? awal.soal.map((s, i) => ({ ...s, nomor: i + 1 })) : [soalKosong(1)],
  } : nilaiAwal());
  const [opsi, setOpsi] = useState<UjianOpsi>({ materi: [], kelas: [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pesan, setPesan] = useState("");
  const [pesanGagal, setPesanGagal] = useState(false);
  const [hasilImpor, setHasilImpor] = useState<HasilImporSoal | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUjianOpsi().then((res) => setOpsi(res.data)).catch((e: unknown) => {
      setPesanGagal(true);
      setPesan(e instanceof Error ? e.message : "Gagal memuat pilihan materi.");
    });
  }, []);
=======
  const { showNotification } = useCrudNotification();
  const [f, setF] = useState<NilaiUjian>(awal ?? nilaiAwal());
  const [errors, setErrors] = useState<Partial<Record<keyof NilaiUjian, string>>>({});
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

  const set = <K extends keyof NilaiUjian>(k: K, v: NilaiUjian[K]) => {
    setF((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const setSoal = (index: number, patch: Partial<SoalUjian>) => {
    setF((x) => ({ ...x, soal: x.soal.map((s, i) => i === index ? { ...s, ...patch } : s) }));
    setErrors((e) => ({ ...e, soal: "" }));
  };

  const tambahSoal = () => {
    if (f.soal.length >= MAX_SOAL) {
      setPesanGagal(true);
      return setPesan(`Maksimal ${MAX_SOAL} soal per ujian.`);
    }
    setF((x) => ({ ...x, soal: [...x.soal, soalKosong(x.soal.length + 1)] }));
  };

  const hapusSoal = (index: number) => {
    if (f.soal.length === 1) {
      setPesanGagal(true);
      return setPesan("Ujian harus memiliki minimal satu soal.");
    }
    setF((x) => ({ ...x, soal: x.soal.filter((_, i) => i !== index).map((s, i) => ({ ...s, nomor: i + 1 })) }));
  };

  const prosesImport = useCallback(async (file?: File) => {
    if (!file) return;
    setImporting(true);
    setPesan("");
    setPesanGagal(false);
    setHasilImpor(null);
    try {
      const hasil = await bacaFileSoal(file);
      setF((x) => ({ ...x, soal: hasil.soal }));
      setErrors((e) => ({ ...e, soal: "" }));
      setHasilImpor(hasil);
      setPesan(`${hasil.soal.length} soal berhasil diimpor. Periksa kembali kunci jawabannya.`);
    } catch (e) {
      setPesanGagal(true);
      setPesan(e instanceof Error ? e.message : "File soal tidak dapat dibaca.");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, []);

  const kirim = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!f.judul.trim()) e.judul = "Nama ujian wajib diisi.";
    if (f.materi_id === null) e.materi_id = "Pilih materi.";
    if (!Number.isInteger(f.durasi_menit) || f.durasi_menit < 1 || f.durasi_menit > 480) e.durasi_menit = "Durasi harus 1–480 menit.";
    if (!Number.isInteger(f.nilai_minimum) || f.nilai_minimum < 0 || f.nilai_minimum > 100) e.nilai_minimum = "Nilai minimum harus 0–100.";
    if (f.soal.length < 1 || f.soal.length > MAX_SOAL) e.soal = `Jumlah soal harus 1–${MAX_SOAL}.`;
    try { validasiSoal(f.soal); } catch (err) { e.soal = err instanceof Error ? err.message : "Soal belum lengkap."; }
    setErrors(e);
<<<<<<< HEAD
    if (Object.keys(e).length === 0) void onSimpan({ ...f, judul: f.judul.trim() });
=======
    if (Object.keys(e).length > 0) {
      showNotification({ type: "error", title: "Data ujian belum valid", message: Object.values(e).join(" ") });
      return;
    }
    onSimpan(f);
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
  };

  return (
    <form onSubmit={kirim} noValidate className="space-y-6">
      <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40 sm:p-6">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-900"><FileQuestion size={20} className="text-orange-500" /> Informasi ujian</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="u-judul" className={labelCls}>Nama ujian</label>
            <input id="u-judul" value={f.judul} onChange={(e) => set("judul", e.target.value)} placeholder="Contoh: Pre Test APL Pertemuan 1" aria-invalid={!!errors.judul} className={inputCls} />
            <Err t={errors.judul} />
          </div>
          <div>
            <label htmlFor="u-materi" className={labelCls}>Materi</label>
            <select id="u-materi" value={f.materi_id ?? ""} onChange={(e) => set("materi_id", e.target.value || null)} aria-invalid={!!errors.materi_id} className={inputCls}>
              <option value="">-- Pilih materi --</option>
              {opsi.materi.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
            <Err t={errors.materi_id} />
          </div>
          <div>
            <span className={labelCls}>Jenis ujian</span>
            <div className="grid grid-cols-2 gap-3">
              {([["pretest", "Pre Test"], ["posttest", "Post Test"]] as const).map(([v, label]) => (
                <label key={v} className="cursor-pointer">
                  <input type="radio" name="tipe" className="peer sr-only" checked={f.tipe === v} onChange={() => set("tipe", v)} />
                  <span className="flex items-center justify-center rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 text-sm text-slate-600 peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:font-medium peer-checked:text-white">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="u-durasi" className={`${labelCls} flex items-center gap-1.5`}><Clock size={14} className="text-orange-500" /> Durasi (menit)</label>
            <input id="u-durasi" type="number" min={1} max={480} value={f.durasi_menit} onChange={(e) => set("durasi_menit", Number(e.target.value))} aria-invalid={!!errors.durasi_menit} className={inputCls} />
            <Err t={errors.durasi_menit} />
          </div>
          <div>
            <label htmlFor="u-nilai" className={labelCls}>Nilai minimum</label>
            <input id="u-nilai" type="number" min={0} max={100} value={f.nilai_minimum} onChange={(e) => set("nilai_minimum", Number(e.target.value))} aria-invalid={!!errors.nilai_minimum} className={inputCls} />
            <Err t={errors.nilai_minimum} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-700">
          <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={f.acak_soal} onChange={(e) => set("acak_soal", e.target.checked)} className="h-4 w-4 accent-orange-500" /><Shuffle size={15} className="text-orange-500" /> Acak urutan soal</label>
          <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={f.is_aktif} onChange={(e) => set("is_aktif", e.target.checked)} className="h-4 w-4 accent-orange-500" /><CheckCircle2 size={15} className="text-orange-500" /> Ujian aktif</label>
        </div>
      </section>

      <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><BookOpen size={20} className="text-orange-500" /> Soal ujian</h2>
            <p className="mt-1 text-sm text-slate-500">Isi manual atau impor file. Maksimal {MAX_SOAL} soal.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${f.soal.length >= MAX_SOAL ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700"}`}>{f.soal.length} / {MAX_SOAL} soal</span>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); void prosesImport(e.dataTransfer.files[0]); }}
          className={`rounded-2xl border-2 border-dashed p-5 text-center transition ${dragging ? "border-orange-500 bg-orange-100" : "border-orange-200 bg-orange-50/50"}`}
        >
          <UploadCloud size={32} className="mx-auto text-orange-400" />
          <p className="mt-2 text-sm font-medium text-slate-800">Tarik dan lepas file soal di sini</p>
          <p className="mt-1 text-xs text-slate-500">PDF, DOCX, XLSX/XLS, CSV, TXT, JSON, HTML, atau RTF · dokumen maksimal 10 MB, teks maksimal 1 MB</p>
          <p className="mt-1 text-xs text-slate-500">Impor akan mengganti daftar soal saat ini, maksimal {MAX_SOAL} soal. Format .doc lama tidak didukung.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={importing} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"><FileUp size={16} /> {importing ? "Membaca file..." : "Pilih file"}</button>
            <button type="button" onClick={unduhTemplate} className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"><Download size={16} /> Template CSV</button>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.xls,.xlsx,.csv,.txt,.text,.json,.html,.htm,.rtf" className="hidden" onChange={(e) => void prosesImport(e.target.files?.[0])} />
        </div>
        <details className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <summary className="cursor-pointer font-medium text-slate-700">Format file TXT, CSV, dan Excel</summary>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">{`1. Apa fungsi Ctrl+S?\nA. Menyalin\nB. Menyimpan\nC. Mencetak\nD. Menghapus\nJawaban: B\nPenjelasan: Shortcut menyimpan dokumen`}</pre>
          <p className="mt-2 text-xs">Pisahkan setiap soal TXT dengan satu baris kosong. Kunci jawaban menggunakan A, B, C, atau D.</p>
          <p className="mt-2 text-xs">CSV/Excel menggunakan header <code>pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar</code> dan kolom opsional <code>penjelasan</code>. Satu baris berisi satu soal.</p>
          <p className="mt-2 text-xs">PDF, DOCX, HTML, dan RTF diekstrak lalu dinormalisasi ke format TXT di atas. PDF scan/gambar harus melalui OCR terlebih dahulu.</p>
        </details>
        {pesan && <p role={pesanGagal ? "alert" : "status"} className={`mt-3 rounded-xl px-3 py-2 text-sm ${pesanGagal ? "bg-red-50 text-red-700" : "bg-sky-50 text-sky-800"}`}>{pesan}</p>}
        {hasilImpor && (
          <details open className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3">
            <summary className="cursor-pointer font-medium text-emerald-800">Hasil konversi {hasilImpor.namaFile} menjadi TXT</summary>
            <p className="mt-2 text-xs text-slate-600">{hasilImpor.format} dinormalisasi menjadi TXT, lalu diparse menjadi {hasilImpor.soal.length} soal.</p>
            <textarea
              readOnly
              rows={10}
              value={hasilImpor.teks}
              aria-label="Hasil konversi soal ke TXT"
              className="mt-2 max-h-80 w-full resize-y overflow-auto rounded-xl border border-emerald-200 bg-white px-3 py-2 font-mono text-xs text-slate-800 outline-none"
            />
            <button type="button" onClick={() => unduhTxt(hasilImpor)} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"><Download size={16} /> Unduh TXT</button>
          </details>
        )}
        <Err t={errors.soal} />

        <div className="mt-5 space-y-4">
          {f.soal.map((s, index) => (
            <article key={index} className="rounded-2xl border border-orange-100 bg-orange-50/30 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">Soal {index + 1}</h3>
                <button type="button" onClick={() => hapusSoal(index)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"><Trash2 size={14} /> Hapus soal</button>
              </div>
              <label className={labelCls} htmlFor={`soal-${index}`}>Pertanyaan</label>
              <textarea id={`soal-${index}`} rows={3} value={s.pertanyaan} onChange={(e) => setSoal(index, { pertanyaan: e.target.value })} placeholder="Ketik pertanyaan..." className={inputCls} />
              <fieldset className="mt-4">
                <legend className={`${labelCls} mt-1`}>Pilihan jawaban dan kunci</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {s.pilihan.map((p, pIndex) => (
                    <label key={pIndex} className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2 ${s.jawaban_benar === pIndex ? "border-emerald-400 ring-2 ring-emerald-100" : "border-orange-100"}`}>
                      <input type="radio" name={`kunci-${index}`} checked={s.jawaban_benar === pIndex} onChange={() => setSoal(index, { jawaban_benar: pIndex })} aria-label={`Kunci soal ${index + 1}: ${String.fromCharCode(65 + pIndex)}`} className="h-4 w-4 shrink-0 accent-emerald-600" />
                      <span className="font-semibold text-slate-500">{String.fromCharCode(65 + pIndex)}.</span>
                      <input value={p} onChange={(e) => setSoal(index, { pilihan: s.pilihan.map((v, i) => i === pIndex ? e.target.value : v) })} placeholder={`Pilihan ${String.fromCharCode(65 + pIndex)}`} aria-label={`Pilihan ${String.fromCharCode(65 + pIndex)} soal ${index + 1}`} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">Pilih lingkaran pada jawaban yang benar.</p>
              </fieldset>
              <label className={`${labelCls} mt-4`} htmlFor={`penjelasan-${index}`}>Penjelasan (opsional)</label>
              <textarea id={`penjelasan-${index}`} rows={2} value={s.penjelasan} onChange={(e) => setSoal(index, { penjelasan: e.target.value })} className={inputCls} />
            </article>
          ))}
        </div>
        <button type="button" onClick={tambahSoal} disabled={f.soal.length >= MAX_SOAL} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"><Plus size={17} /> Tambah soal manual</button>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Link href={kembali} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Batal</Link>
        <button type="submit" disabled={saving || importing} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 hover:bg-green-700 disabled:opacity-60"><Save size={18} /> {saving ? "Menyimpan..." : labelSimpan}</button>
      </div>
    </form>
  );
}
