import { AlertTriangle, CalendarDays, Check, Clock, Plus } from "lucide-react";
import { HARI, MATERI, SESI, type Kelas } from "../data";
import type { Sesi } from "@/lib/api";

// Warna kartu per materi (urutan mengikuti daftar MATERI)
const WARNA = [
  { kotak: "border-orange-200 border-l-orange-500 bg-orange-50 text-orange-900", sub: "text-orange-700" },
  { kotak: "border-sky-200 border-l-sky-500 bg-sky-50 text-sky-900", sub: "text-sky-700" },
  { kotak: "border-violet-200 border-l-violet-500 bg-violet-50 text-violet-900", sub: "text-violet-700" },
  { kotak: "border-emerald-200 border-l-emerald-500 bg-emerald-50 text-emerald-900", sub: "text-emerald-700" },
];

export default function JadwalKelas({ kelas, dipilih, onKlikKosong, sesi: sesiApi }: {
  kelas: Kelas[];
  dipilih?: { sesi: number; hari: string[] };
  onKlikKosong?: (hari: string, sesi: number) => void;
  sesi?: Sesi[];
}) {
  const aktif = kelas.filter((k) => k.status === "Aktif");
  const sesi = sesiApi?.length ? sesiApi.map((s) => ({ id: s.id, no: s.sesi, jam: s.jam })) : SESI.map((s) => ({ ...s, id: s.no }));
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-orange-200 shadow-sm">
        <table className="w-full min-w-[900px] table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-orange-500 to-amber-400 text-white">
              <th className="w-32 px-4 py-3 text-left font-semibold">
                <span className="flex items-center gap-2"><CalendarDays size={18} /> Hari</span>
              </th>
              {sesi.map((s) => (
                <th key={s.id} className="border-l border-white/40 px-3 py-3 text-left font-medium">
                  <span className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold">{s.no}</span>
                    <span>
                      <span className="block text-sm font-semibold">Sesi {s.no}</span>
                      <span className="flex items-center gap-1 text-xs font-normal text-orange-50"><Clock size={12} />{s.jam}</span>
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HARI.map((h, i) => {
              const terisi = aktif.filter((k) => k.hari.includes(h)).length;
              return (
                <tr key={h} className={`border-t border-orange-100 ${i % 2 ? "bg-orange-50/40" : "bg-white"}`}>
                  <th className="border-r border-orange-100 px-4 py-3 text-left align-middle">
                    <span className="block font-semibold text-slate-900">{h}</span>
                    <span className="text-xs font-normal text-slate-500">{terisi} kelas</span>
                  </th>
                  {sesi.map((s) => {
                    const k = aktif.find((x) => x.sesi_id === s.id && x.hari.includes(h));
                    const pilih = !!dipilih && dipilih.sesi === s.no && dipilih.hari.includes(h);
                    let isi: React.ReactNode;
                    if (k && pilih) {
                      isi = (
                        <div className="flex h-14 items-center gap-1.5 rounded-lg border border-red-300 bg-red-100 px-3 text-xs font-semibold text-red-800">
                          <AlertTriangle size={14} /> Bentrok · {k.nama}
                        </div>
                      );
                    } else if (k) {
                      const w = WARNA[Math.max(0, MATERI.indexOf(k.materi)) % WARNA.length];
                      isi = (
                        <div className={`flex h-14 flex-col justify-center rounded-lg border border-l-4 px-3 text-xs font-semibold shadow-sm ${w.kotak}`}>
                          {k.materi}
                          <span className={`block text-[11px] font-medium ${w.sub}`}>{k.nama}</span>
                        </div>
                      );
                    } else if (pilih) {
                      isi = (
                        <button type="button" onClick={() => onKlikKosong?.(h, s.id)}
                          className="flex h-14 w-full items-center justify-center gap-1 rounded-lg border border-green-400 bg-green-100 text-xs font-semibold text-green-800">
                          <Check size={14} /> Dipilih
                        </button>
                      );
                    } else {
                      isi = (
                        <button type="button" disabled={!onKlikKosong} onClick={() => onKlikKosong?.(h, s.id)}
                          className="flex h-14 w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-white/70 text-xs font-medium text-slate-500 transition enabled:hover:border-green-500 enabled:hover:bg-green-50 enabled:hover:text-green-700">
                          {onKlikKosong && <Plus size={14} />} Kosong
                        </button>
                      );
                    }
                    return <td key={s.id} className="border-l border-orange-100 p-1.5 align-middle">{isi}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-l-4 border-orange-200 border-l-orange-500 bg-orange-50" /> Sudah terisi</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-dashed border-slate-400 bg-white" /> Kosong{onKlikKosong && " (klik untuk memilih)"}</span>
        {dipilih && <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-green-300" /> Pilihanmu</span>}
      </div>
    </div>
  );
}