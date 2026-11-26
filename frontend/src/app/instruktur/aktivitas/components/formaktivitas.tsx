"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarDays, Camera, Check, Clock, FileText, MapPin, Plus, Save, UploadCloud, X } from "lucide-react";
import FotoKotak from "./fotokotak";
import { useCrudNotification } from "@/components/CrudNotification";

// ===== Tipe data (dipakai halaman daftar, baru, dan ubah) =====
export type Foto = { id: number; url: string };
export type Aktivitas = { id: number; tanggal: string; sesi: number[]; lokasi: string; keterangan: string; foto: Foto[] };
export type NilaiAktivitas = {
  tanggal: string;      // format YYYY-MM-DD
  sesi: number[];       // contoh: [4, 5]
  lokasi: string;
  keterangan: string;
  fotoLama: Foto[];     // foto yang sudah tersimpan di server (hanya saat ubah)
  fotoBaru: File[];     // foto yang baru dipilih
};

// HARDCODE: daftar sesi. TODO: ganti dengan data dari API jika sesi bisa berubah.
export const SESI = [
  { no: 1, jam: "07.30-09.00" },
  { no: 2, jam: "09.00-10.30" },
  { no: 3, jam: "10.30-12.00" },
  { no: 4, jam: "13.00-14.30" },
  { no: 5, jam: "14.30-16.00" },
];
export const NILAI_KOSONG: NilaiAktivitas = { tanggal: "", sesi: [], lokasi: "", keterangan: "", fotoLama: [], fotoBaru: [] };

const MAKS_FOTO = 5;
const MAKS_UKURAN = 2 * 1024 * 1024; // 2 MB

export function hariIni() {
  const d = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function validasiAktivitas(n: NilaiAktivitas) {
  if (!n.tanggal) return "Tanggal wajib diisi.";
  if (n.sesi.length === 0) return "Pilih minimal satu sesi.";
  if (!n.lokasi.trim()) return "Lokasi wajib diisi.";
  if (!n.keterangan.trim()) return "Keterangan wajib diisi.";
  return "";
}

const inp =
  "w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";
const label = "mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800";

export default function FormAktivitas({ nilai, onChange, onSubmit, saving, error, kembali }: {
  nilai: NilaiAktivitas;
  onChange: (n: NilaiAktivitas) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving?: boolean;
  error?: string;
  kembali: string;
}) {
  const { showNotification } = useCrudNotification();
  const [errFoto, setErrFoto] = useState("");
  const [seret, setSeret] = useState(false);
  const inputFoto = useRef<HTMLInputElement>(null);

  const urlBaru = useMemo(() => nilai.fotoBaru.map((f) => URL.createObjectURL(f)), [nilai.fotoBaru]);
  useEffect(() => () => { urlBaru.forEach((u) => URL.revokeObjectURL(u)); }, [urlBaru]);

  const jumlahFoto = nilai.fotoLama.length + nilai.fotoBaru.length;

  const toggleSesi = (no: number) => {
    const next = nilai.sesi.includes(no) ? nilai.sesi.filter((x) => x !== no) : [...nilai.sesi, no];
    onChange({ ...nilai, sesi: next.sort((a, b) => a - b) });
  };

  const tambahFoto = (daftar: FileList | File[]) => {
    setErrFoto("");
    const diterima: File[] = [];
    let pesan = "";
    for (const f of Array.from(daftar)) {
      if (!f.type.startsWith("image/")) { pesan = "Hanya file gambar (JPG/PNG) yang boleh."; continue; }
      if (f.size > MAKS_UKURAN) { pesan = `"${f.name}" lebih dari 2 MB.`; continue; }
      if (jumlahFoto + diterima.length >= MAKS_FOTO) { pesan = `Maksimal ${MAKS_FOTO} foto.`; break; }
      diterima.push(f);
    }
    if (pesan) {
      setErrFoto(pesan);
      showNotification({ type: "error", title: "Foto tidak valid", message: pesan });
    }
    if (diterima.length) onChange({ ...nilai, fotoBaru: [...nilai.fotoBaru, ...diterima] });
  };

  const kirim = (e: React.FormEvent) => {
    const pesan = validasiAktivitas(nilai);
    if (pesan) showNotification({ type: "error", title: "Data aktivitas belum lengkap", message: pesan });
    onSubmit(e);
  };

  const tombolX = "absolute right-1 top-1 rounded-full bg-white/95 p-1 text-slate-600 shadow hover:bg-red-50 hover:text-red-600";

  return (
    <form onSubmit={kirim} noValidate className="space-y-6 rounded-2xl border border-orange-200 bg-white p-6 shadow-xl shadow-orange-300/40">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="tanggal" className={label}><CalendarDays size={18} className="text-orange-500" /> Tanggal</label>
          <div className="relative">
            <CalendarDays size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
            <input id="tanggal" type="date" className={inp} value={nilai.tanggal} onChange={(e) => onChange({ ...nilai, tanggal: e.target.value })} />
          </div>
        </div>
        <div>
          <label htmlFor="lokasi" className={label}><MapPin size={18} className="text-sky-500" /> Lokasi</label>
          <div className="relative">
            <MapPin size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
            <input id="lokasi" className={inp} placeholder="Contoh: Kelurahan Menur Pumpungan" value={nilai.lokasi} onChange={(e) => onChange({ ...nilai, lokasi: e.target.value })} />
          </div>
        </div>
      </div>

      <div>
        <p className={label}><Clock size={18} className="text-violet-500" /> Sesi / jam <span className="font-normal text-slate-400">(bisa lebih dari satu)</span></p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SESI.map((s) => {
            const aktif = nilai.sesi.includes(s.no);
            return (
              <button key={s.no} type="button" onClick={() => toggleSesi(s.no)} aria-pressed={aktif}
                className={`relative rounded-xl border p-3 text-left text-sm transition hover:-translate-y-0.5 ${
                  aktif ? "border-violet-400 bg-violet-50 ring-4 ring-violet-200/60" : "border-orange-100 bg-orange-50/30 hover:border-violet-300"}`}>
                {aktif && <Check size={16} className="absolute right-2 top-2 text-violet-600" />}
                <span className="block font-semibold text-slate-900">Sesi {s.no}</span>
                <span className="text-xs text-slate-500">{s.jam}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="keterangan" className={label}><FileText size={18} className="text-emerald-500" /> Keterangan</label>
        <textarea id="keterangan" rows={5} maxLength={1000} placeholder="Ceritakan kegiatan yang dilakukan"
          className="w-full rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60"
          value={nilai.keterangan} onChange={(e) => onChange({ ...nilai, keterangan: e.target.value })} />
        <p className="mt-1 text-right text-xs text-slate-400">{nilai.keterangan.length}/1000</p>
      </div>

      <div>
        <p className={label}><Camera size={18} className="text-orange-500" /> Foto kegiatan <span className="font-normal text-slate-400">(opsional, maks. {MAKS_FOTO} foto, 2 MB per foto)</span></p>
        <div
          onDragOver={(e) => { e.preventDefault(); setSeret(true); }}
          onDragLeave={() => setSeret(false)}
          onDrop={(e) => { e.preventDefault(); setSeret(false); tambahFoto(e.dataTransfer.files); }}
          className={`flex flex-wrap gap-3 rounded-xl border-2 border-dashed p-4 transition ${seret ? "border-orange-500 bg-orange-100" : "border-orange-200 bg-orange-50/40"}`}
        >
          {nilai.fotoLama.map((f, i) => (
            <div key={`lama-${f.id}`} className="relative h-24 w-24 overflow-hidden rounded-xl shadow-sm">
              <FotoKotak url={f.url} indeks={i} className="h-full w-full" />
              <button type="button" aria-label="Hapus foto" className={tombolX}
                onClick={() => onChange({ ...nilai, fotoLama: nilai.fotoLama.filter((x) => x.id !== f.id) })}><X size={14} /></button>
            </div>
          ))}
          {nilai.fotoBaru.map((f, i) => (
            <div key={`baru-${f.name}-${i}`} className="relative h-24 w-24 overflow-hidden rounded-xl shadow-sm">
              <FotoKotak url={urlBaru[i]} className="h-full w-full" />
              <button type="button" aria-label="Hapus foto" className={tombolX}
                onClick={() => onChange({ ...nilai, fotoBaru: nilai.fotoBaru.filter((_, j) => j !== i) })}><X size={14} /></button>
            </div>
          ))}
          {jumlahFoto < MAKS_FOTO && (
            <button type="button" onClick={() => inputFoto.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-orange-300 bg-white text-xs font-medium text-orange-700 transition hover:bg-orange-50">
              {jumlahFoto === 0 ? <UploadCloud size={24} /> : <Plus size={24} />}
              Tambah foto
            </button>
          )}
          {jumlahFoto === 0 && <p className="flex items-center text-sm text-slate-500">Tarik foto ke sini atau klik &quot;Tambah foto&quot;.</p>}
        </div>
        <input ref={inputFoto} type="file" accept="image/*" multiple className="sr-only"
          onChange={(e) => { if (e.target.files) tambahFoto(e.target.files); e.target.value = ""; }} />
        {errFoto && <p className="mt-2 flex items-center gap-1 text-xs text-red-600"><AlertTriangle size={14} /> {errFoto}</p>}
      </div>

      {error && <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertTriangle size={16} /> {error}</p>}

      <div className="flex justify-end gap-3 border-t border-orange-100 pt-5">
        <Link href={kembali} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Batal</Link>
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-green-600/30 hover:bg-green-700 disabled:opacity-60">
          <Save size={18} /> {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
