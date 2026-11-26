"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CalendarClock, CheckCircle2, Clock, Hash, Save, Shuffle } from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";

// TODO: ganti dengan GET /api/materi (berisi pertemuan dan jumlah soal yang tersedia)
export const MATERI: { nama: string; pertemuan: { no: number; soal: number }[] }[] = [
  { nama: "APLIKASI PERKANTORAN", pertemuan: [1, 2, 3, 4, 5].map((no) => ({ no, soal: 10 })) },
  { nama: "DESAIN GRAFIS", pertemuan: [1, 2, 3, 4].map((no) => ({ no, soal: 8 })) },
  { nama: "PEMROGRAMAN DASAR", pertemuan: [1, 2, 3].map((no) => ({ no, soal: 12 })) },
];

export type NilaiUjian = {
  materi: string;
  pertemuan: string;
  jenis: "Pre Test" | "Post Test";
  jumlahSoal: string;
  mulai: string; // "2026-06-03T09:24"
  sampai: string;
  waktu: string; // menit
  acak: "acak" | "urut";
};

export const namaUjian = (jenis: string, materi: string, pertemuan: number | string) =>
  `${jenis.toUpperCase()} - ${materi} PERTEMUAN ${pertemuan}`;

const pad = (n: number) => String(n).padStart(2, "0");
const lokal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const nilaiAwal = (): NilaiUjian => ({
  materi: "", pertemuan: "", jenis: "Pre Test", jumlahSoal: "5",
  mulai: lokal(new Date()), sampai: lokal(new Date(Date.now() + 24 * 3600 * 1000)), waktu: "60", acak: "acak",
});

const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/50";

function Err({ t }: { t?: string }) {
  return t ? <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {t}</p> : null;
}

function Pilihan<T extends string>({ nama, nilai, opsi, onPilih }: {
  nama: string; nilai: T; opsi: { v: T; label: string }[]; onPilih: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {opsi.map((o) => (
        <label key={o.v} className="cursor-pointer">
          <input type="radio" name={nama} className="peer sr-only" checked={nilai === o.v} onChange={() => onPilih(o.v)} />
          <span className="flex items-center justify-center rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 text-sm text-slate-600 transition hover:border-orange-300 peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:font-medium peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-orange-200/60">{o.label}</span>
        </label>
      ))}
    </div>
  );
}

// Form dipakai bersama oleh halaman "ujianbaru" dan "[id]/ubah".
export default function FormUjian({ awal, kembali, labelSimpan = "Simpan", saving, onSimpan }: {
  awal?: NilaiUjian;
  kembali: string;
  labelSimpan?: string;
  saving?: boolean;
  onSimpan: (nilai: NilaiUjian) => void;
}) {
  const { showNotification } = useCrudNotification();
  const [f, setF] = useState<NilaiUjian>(awal ?? nilaiAwal());
  const [errors, setErrors] = useState<Partial<Record<keyof NilaiUjian, string>>>({});

  const set = <K extends keyof NilaiUjian>(k: K, v: NilaiUjian[K]) => {
    setF((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const daftarPertemuan = MATERI.find((m) => m.nama === f.materi)?.pertemuan ?? [];
  const soalTersedia = daftarPertemuan.find((p) => String(p.no) === f.pertemuan)?.soal;
  const preview = f.materi && f.pertemuan ? namaUjian(f.jenis, f.materi, f.pertemuan) : "";

  const kirim = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Partial<Record<keyof NilaiUjian, string>> = {};
    const js = Number(f.jumlahSoal);
    if (!f.materi) e.materi = "Pilih materi.";
    if (!f.pertemuan) e.pertemuan = "Pilih pertemuan.";
    if (!Number.isInteger(js) || js < 1) e.jumlahSoal = "Isi jumlah soal minimal 1.";
    else if (soalTersedia !== undefined && js > soalTersedia) e.jumlahSoal = `Maksimal ${soalTersedia} soal.`;
    if (!f.mulai) e.mulai = "Isi tanggal mulai.";
    if (!f.sampai) e.sampai = "Isi tanggal sampai.";
    else if (f.mulai && f.sampai <= f.mulai) e.sampai = "Harus setelah tanggal mulai.";
    if (!(Number(f.waktu) >= 1)) e.waktu = "Isi waktu dalam menit.";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      showNotification({ type: "error", title: "Data ujian belum valid", message: Object.values(e).join(" ") });
      return;
    }
    onSimpan(f);
  };

  return (
    <form onSubmit={kirim} noValidate className="space-y-5 rounded-2xl border border-orange-200 bg-white p-6 shadow-xl shadow-orange-300/40">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="u-materi" className="mb-1.5 block text-sm font-medium text-slate-700">Materi</label>
          <select id="u-materi" value={f.materi} onChange={(e) => { set("materi", e.target.value); set("pertemuan", ""); }} aria-invalid={!!errors.materi} className={inputCls}>
            <option value="">-- Pilih materi --</option>
            {MATERI.map((m) => <option key={m.nama}>{m.nama}</option>)}
          </select>
          <Err t={errors.materi} />
        </div>
        <div>
          <label htmlFor="u-pert" className="mb-1.5 block text-sm font-medium text-slate-700">Pertemuan</label>
          <select id="u-pert" value={f.pertemuan} disabled={!f.materi} onChange={(e) => set("pertemuan", e.target.value)} aria-invalid={!!errors.pertemuan} className={inputCls}>
            <option value="">-- Pilih pertemuan --</option>
            {daftarPertemuan.map((p) => <option key={p.no} value={p.no}>Pertemuan {p.no}</option>)}
          </select>
          <Err t={errors.pertemuan} />
        </div>
      </div>

      {soalTersedia !== undefined && (
        <p className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-800"><CheckCircle2 size={16} /> Tersedia <b>{soalTersedia} soal</b> untuk pertemuan ini.</p>
      )}

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Jenis ujian</span>
        <Pilihan nama="jenis" nilai={f.jenis} onPilih={(v) => set("jenis", v)}
          opsi={[{ v: "Pre Test", label: "Pre Test" }, { v: "Post Test", label: "Post Test" }]} />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Nama ujian (otomatis)</span>
        <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-3 py-2.5 text-sm font-medium text-slate-700">
          {preview || <span className="font-normal text-slate-400">Terisi setelah materi dan pertemuan dipilih</span>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="u-soal" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><Hash size={14} className="text-orange-500" /> Jumlah soal</label>
          <input id="u-soal" type="number" min={1} max={soalTersedia} value={f.jumlahSoal} onChange={(e) => set("jumlahSoal", e.target.value)} aria-invalid={!!errors.jumlahSoal} className={inputCls} />
          <Err t={errors.jumlahSoal} />
        </div>
        <div>
          <label htmlFor="u-waktu" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><Clock size={14} className="text-orange-500" /> Waktu (menit)</label>
          <input id="u-waktu" type="number" min={1} value={f.waktu} onChange={(e) => set("waktu", e.target.value)} aria-invalid={!!errors.waktu} className={inputCls} />
          <Err t={errors.waktu} />
        </div>
      </div>

      <div>
        <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><Shuffle size={14} className="text-orange-500" /> Urutan soal</span>
        <Pilihan nama="acak" nilai={f.acak} onPilih={(v) => set("acak", v)}
          opsi={[{ v: "acak", label: "Acak soal" }, { v: "urut", label: "Urut soal" }]} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="u-mulai" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarClock size={14} className="text-orange-500" /> Tanggal mulai</label>
          <input id="u-mulai" type="datetime-local" value={f.mulai} onChange={(e) => set("mulai", e.target.value)} aria-invalid={!!errors.mulai} suppressHydrationWarning className={inputCls} />
          <Err t={errors.mulai} />
        </div>
        <div>
          <label htmlFor="u-sampai" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarClock size={14} className="text-orange-500" /> Tanggal sampai</label>
          <input id="u-sampai" type="datetime-local" value={f.sampai} onChange={(e) => set("sampai", e.target.value)} aria-invalid={!!errors.sampai} suppressHydrationWarning className={inputCls} />
          <Err t={errors.sampai} />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-orange-100 pt-5">
        <Link href={kembali} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Batal</Link>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-green-600/30 hover:bg-green-700 disabled:opacity-60">
          <Save size={18} /> {saving ? "Menyimpan..." : labelSimpan}
        </button>
      </div>
    </form>
  );
}
