"use client";

import Link from "next/link";
import { AlertTriangle, BookOpen, CalendarDays, Check, Clock, Save } from "lucide-react";
import { HARI, MATERI, SESI } from "../data";

export type NilaiKelas = { sesi: number; hari: string[]; materi: string };

export default function FormKelas({ nilai, onChange, onSubmit, saving, bentrok, error, kembali }: {
  nilai: NilaiKelas;
  onChange: (n: NilaiKelas) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving?: boolean;
  bentrok: string[];
  error?: string;
  kembali: string;
}) {
  const toggleHari = (h: string) => {
    const next = nilai.hari.includes(h) ? nilai.hari.filter((x) => x !== h) : [...nilai.hari, h];
    onChange({ ...nilai, hari: HARI.filter((x) => next.includes(x)) });
  };
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
      </div>
    </form>
  );
}
