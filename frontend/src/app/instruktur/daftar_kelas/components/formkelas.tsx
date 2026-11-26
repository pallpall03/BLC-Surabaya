"use client";

import Link from "next/link";
import { AlertTriangle, BookOpen, CalendarDays, Check, Clock, MapPin, Save } from "lucide-react";
import { HARI } from "../data";
import type { Materi, Sesi } from "@/lib/api";

export type NilaiKelas = { nama: string; sesi: number; hari: string[]; materi: string; lokasiBlcId: number };
export type OpsiKelas = { sesi: Sesi[]; materi: Materi[]; blc: { id: number; nama_blc: string }[] };

export default function FormKelas({ nilai, onChange, onSubmit, saving, bentrok, error, kembali, opsi }: {
  nilai: NilaiKelas;
  onChange: (n: NilaiKelas) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving?: boolean;
  bentrok: string[];
  error?: string;
  kembali: string;
  opsi: OpsiKelas;
}) {
  const toggleHari = (h: string) => {
    const next = nilai.hari.includes(h) ? nilai.hari.filter((x) => x !== h) : [...nilai.hari, h];
    onChange({ ...nilai, hari: HARI.filter((x) => next.includes(x)) });
  };
<<<<<<< HEAD
  const label = "mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800";
  const input = "w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-200/60";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-2xl border border-orange-200 bg-white p-6 shadow-xl shadow-orange-300/40">
      <div>
        <label htmlFor="nama-kelas" className={label}><BookOpen size={18} className="text-orange-500" /> Nama kelas</label>
        <input id="nama-kelas" value={nilai.nama} onChange={(e) => onChange({ ...nilai, nama: e.target.value })} placeholder="Contoh: Kelas Pagi A" className={input} />
      </div>

      <div>
        <p className={label}><Clock size={18} className="text-orange-500" /> Sesi / jam</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {opsi.sesi.map((s) => (
            <button key={s.id} type="button" onClick={() => onChange({ ...nilai, sesi: s.id })} aria-pressed={nilai.sesi === s.id}
              className={`rounded-xl border p-3 text-left text-sm transition hover:-translate-y-0.5 ${nilai.sesi === s.id ? "border-orange-500 bg-orange-50 ring-4 ring-orange-200/60" : "border-orange-100 bg-orange-50/30 hover:border-orange-300"}`}>
              <span className="block font-semibold text-slate-900">Sesi {s.sesi}</span><span className="text-xs text-slate-500">{s.jam}</span>
            </button>
          ))}
        </div>
        {!opsi.sesi.length && <p className="text-sm text-amber-700">Belum ada data sesi. Hubungi admin untuk melengkapi data master.</p>}
      </div>

      <div>
        <p className={label}><CalendarDays size={18} className="text-sky-500" /> Hari <span className="font-normal text-slate-400">(bisa lebih dari satu)</span></p>
        <div className="flex flex-wrap gap-2">
          {HARI.map((h) => {
            const aktif = nilai.hari.includes(h);
            return <button key={h} type="button" onClick={() => toggleHari(h)} aria-pressed={aktif}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${aktif ? "border-sky-500 bg-sky-500 font-medium text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50"}`}>
              {aktif && <Check size={15} />} {h}
            </button>;
          })}
        </div>
      </div>

      <div>
        <p className={label}><BookOpen size={18} className="text-violet-500" /> Materi</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {opsi.materi.map((m) => (
            <button key={m.id} type="button" onClick={() => onChange({ ...nilai, materi: m.id })} aria-pressed={nilai.materi === m.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition hover:-translate-y-0.5 ${nilai.materi === m.id ? "border-violet-400 bg-violet-50 font-medium text-violet-700" : "border-orange-100 bg-orange-50/30 text-slate-700 hover:border-violet-300"}`}>
              {m.nama_materi} {nilai.materi === m.id && <Check size={16} />}
            </button>
          ))}
        </div>
        {!opsi.materi.length && <p className="text-sm text-amber-700">Belum ada data materi. Hubungi admin untuk melengkapi data master.</p>}
      </div>

      <div>
        <label htmlFor="lokasi-kelas" className={label}><MapPin size={18} className="text-emerald-500" /> BLC</label>
        <select id="lokasi-kelas" value={nilai.lokasiBlcId || ""} onChange={(e) => onChange({ ...nilai, lokasiBlcId: Number(e.target.value) })} className={input}>
          <option value="">Pilih BLC</option>{opsi.blc.map((b) => <option key={b.id} value={b.id}>{b.nama_blc}</option>)}
        </select>
      </div>

      {bentrok.length > 0 && <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertTriangle size={16} /> Jadwal bentrok pada hari {bentrok.join(", ")}. Pilih sesi atau hari yang masih kosong.</p>}
      {error && bentrok.length === 0 && <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertTriangle size={16} /> {error}</p>}

      <div className="flex justify-end gap-3 border-t border-orange-100 pt-5">
        <Link href={kembali} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Batal</Link>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-green-600/30 hover:bg-green-700 disabled:opacity-60"><Save size={18} /> {saving ? "Menyimpan..." : "Simpan"}</button>
=======
  const label = "d-flex align-items-center gap-2 fs-6 fw-bold text-gray-900 mb-3";

  return (
    <form onSubmit={onSubmit} noValidate className="card">
      <div className="card-body d-flex flex-column gap-8">
        <div>
          <div className={label}><Clock size={18} className="text-primary" /> Sesi / jam</div>
          <div className="row g-3">
            {SESI.map((s) => {
              const aktif = nilai.sesi === s.no;
              return (
                <div className="col-6 col-sm" key={s.no}>
                  <button type="button" onClick={() => onChange({ ...nilai, sesi: s.no })} aria-pressed={aktif}
                    className={`btn w-100 text-start d-flex flex-column py-3 ${aktif ? "btn-light-primary border border-primary" : "btn-outline btn-outline-dashed btn-outline-default"}`}>
                    <span className="fw-bold text-gray-900">Sesi {s.no}</span>
                    <span className="fs-8 fw-normal text-gray-500">{s.jam}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className={label}>
            <CalendarDays size={18} className="text-info" /> Hari <span className="fw-normal text-gray-500">(bisa lebih dari satu)</span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {HARI.map((h) => {
              const aktif = nilai.hari.includes(h);
              return (
                <button key={h} type="button" onClick={() => toggleHari(h)} aria-pressed={aktif}
                  className={`btn btn-sm d-inline-flex align-items-center gap-1 ${aktif ? "btn-info" : "btn-light"}`}>
                  {aktif && <Check size={15} />} {h}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className={label}><BookOpen size={18} className="text-primary" /> Materi</div>
          <div className="row g-3">
            {MATERI.map((m) => {
              const aktif = nilai.materi === m;
              return (
                <div className="col-sm-6" key={m}>
                  <button type="button" onClick={() => onChange({ ...nilai, materi: m })} aria-pressed={aktif}
                    className={`btn w-100 d-flex align-items-center justify-content-between ${aktif ? "btn-light-primary border border-primary" : "btn-outline btn-outline-dashed btn-outline-default"}`}>
                    {m} {aktif && <Check size={16} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {(bentrok.length > 0 || error) && (
          <div role="alert" className="alert alert-danger d-flex align-items-center gap-2 py-3 mb-0">
            <AlertTriangle size={16} />
            {bentrok.length > 0 ? `Jadwal bentrok pada hari ${bentrok.join(", ")}. Pilih sesi atau hari yang masih kosong.` : error}
          </div>
        )}
      </div>

      <div className="card-footer d-flex justify-content-end gap-3">
        <Link href={kembali} className="btn btn-light">Batal</Link>
        <button type="submit" disabled={saving} className="btn btn-primary d-inline-flex align-items-center gap-2">
          <Save size={18} /> {saving ? "Menyimpan..." : "Simpan"}
        </button>
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
      </div>
    </form>
  );
}
