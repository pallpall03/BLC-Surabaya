import { AlertTriangle, CalendarDays, Check, Clock, Plus } from "lucide-react";
import { HARI, MATERI, SESI, type Kelas } from "../data";
import type { Sesi } from "@/lib/api";

// Warna kartu per materi (urutan mengikuti daftar MATERI), memakai warna bawaan Metronic
const WARNA = [
  { bg: "bg-light-primary", border: "border-primary", teks: "text-primary" },
  { bg: "bg-light-info", border: "border-info", teks: "text-info" },
  { bg: "bg-light-success", border: "border-success", teks: "text-success" },
  { bg: "bg-light-warning", border: "border-warning", teks: "text-warning" },
];

<<<<<<< HEAD
export default function JadwalKelas({ kelas, dipilih, onKlikKosong, sesi: sesiApi }: {
=======
const SEL = { minHeight: 76 };

export default function JadwalKelas({ kelas, dipilih, onKlikKosong }: {
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
  kelas: Kelas[];
  dipilih?: { sesi: number; hari: string[] };
  onKlikKosong?: (hari: string, sesi: number) => void;
  sesi?: Sesi[];
}) {
  const aktif = kelas.filter((k) => k.status === "Aktif");
  const sesi = sesiApi?.length ? sesiApi.map((s) => ({ id: s.id, no: s.sesi, jam: s.jam })) : SESI.map((s) => ({ ...s, id: s.no }));
  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered align-middle mb-0" style={{ minWidth: 900, tableLayout: "fixed" }}>
          <thead>
            <tr className="bg-light-primary fw-bold text-gray-800">
              <th style={{ width: 130 }}>
                <span className="d-flex align-items-center gap-2"><CalendarDays size={18} className="text-primary" /> Hari</span>
              </th>
<<<<<<< HEAD
              {sesi.map((s) => (
                <th key={s.id} className="border-l border-white/40 px-3 py-3 text-left font-medium">
                  <span className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold">{s.no}</span>
                    <span>
                      <span className="block text-sm font-semibold">Sesi {s.no}</span>
                      <span className="flex items-center gap-1 text-xs font-normal text-orange-50"><Clock size={12} />{s.jam}</span>
=======
              {SESI.map((s) => (
                <th key={s.no}>
                  <span className="d-flex align-items-center gap-3">
                    <span className="symbol symbol-circle symbol-30px">
                      <span className="symbol-label bg-primary text-white fw-bold fs-7">{s.no}</span>
                    </span>
                    <span className="d-flex flex-column">
                      <span className="fs-7 fw-bold text-gray-900">Sesi {s.no}</span>
                      <span className="d-flex align-items-center gap-1 fs-8 fw-normal text-gray-500"><Clock size={12} />{s.jam}</span>
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HARI.map((h) => {
              const terisi = aktif.filter((k) => k.hari.includes(h)).length;
              return (
                <tr key={h}>
                  <th className="bg-light">
                    <span className="d-block fw-bold text-gray-900">{h}</span>
                    <span className="fs-8 fw-normal text-gray-500">{terisi} kelas</span>
                  </th>
                  {sesi.map((s) => {
                    const k = aktif.find((x) => x.sesi_id === s.id && x.hari.includes(h));
                    const pilih = !!dipilih && dipilih.sesi === s.no && dipilih.hari.includes(h);
                    let isi: React.ReactNode;
                    if (k && pilih) {
                      isi = (
                        <div style={SEL} className="d-flex align-items-center gap-2 rounded border border-danger bg-light-danger px-3 fs-8 fw-bold text-danger">
                          <AlertTriangle size={14} /> Bentrok · {k.nama}
                        </div>
                      );
                    } else if (k) {
                      const w = WARNA[Math.max(0, MATERI.indexOf(k.materi)) % WARNA.length];
                      isi = (
                        <div style={SEL} className={`d-flex flex-column justify-content-center rounded border-start border-3 px-3 ${w.bg} ${w.border}`}>
                          <span className="fs-8 fw-bold text-gray-900">{k.materi}</span>
                          <span className={`fs-9 fw-semibold ${w.teks}`}>{k.nama}</span>
                        </div>
                      );
                    } else if (pilih) {
                      isi = (
<<<<<<< HEAD
                        <button type="button" onClick={() => onKlikKosong?.(h, s.id)}
                          className="flex h-14 w-full items-center justify-center gap-1 rounded-lg border border-green-400 bg-green-100 text-xs font-semibold text-green-800">
=======
                        <button type="button" style={SEL} onClick={() => onKlikKosong?.(h, s.no)}
                          className="btn btn-sm btn-light-success border border-success w-100 d-flex align-items-center justify-content-center gap-1 fs-8">
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
                          <Check size={14} /> Dipilih
                        </button>
                      );
                    } else {
                      isi = (
<<<<<<< HEAD
                        <button type="button" disabled={!onKlikKosong} onClick={() => onKlikKosong?.(h, s.id)}
                          className="flex h-14 w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-white/70 text-xs font-medium text-slate-500 transition enabled:hover:border-green-500 enabled:hover:bg-green-50 enabled:hover:text-green-700">
=======
                        <button type="button" style={SEL} disabled={!onKlikKosong} onClick={() => onKlikKosong?.(h, s.no)}
                          className="btn btn-sm btn-outline btn-outline-dashed btn-outline-default btn-active-light-success w-100 d-flex align-items-center justify-content-center gap-1 fs-8 text-gray-500">
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
                          {onKlikKosong && <Plus size={14} />} Kosong
                        </button>
                      );
                    }
<<<<<<< HEAD
                    return <td key={s.id} className="border-l border-orange-100 p-1.5 align-middle">{isi}</td>;
=======
                    return <td key={s.no} className="p-2">{isi}</td>;
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap gap-5 mt-4 fs-8 text-gray-600">
        <span className="d-flex align-items-center gap-2">
          <span className="d-inline-block w-15px h-15px rounded border-start border-3 border-primary bg-light-primary" /> Sudah terisi
        </span>
        <span className="d-flex align-items-center gap-2">
          <span className="d-inline-block w-15px h-15px rounded border border-dashed border-gray-400" /> Kosong{onKlikKosong && " (klik untuk memilih)"}
        </span>
        {dipilih && (
          <span className="d-flex align-items-center gap-2">
            <span className="d-inline-block w-15px h-15px rounded bg-success" /> Pilihanmu
          </span>
        )}
      </div>
    </div>
  );
}
