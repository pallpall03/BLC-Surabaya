"use client";

import { AlertCircle, CheckCircle2, type LucideIcon } from "lucide-react";

// Gaya kolom isian (sama dengan halaman tambah peserta)
export const inp =
  "w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/50";

// Kartu pembungkus satu bagian form
export function Card({ icon: Icon, tone, title, desc, children }: {
  icon: LucideIcon; tone: string; title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-200/40">
      <div className="mb-5 flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon size={22} /></span>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

// Satu kolom isian: label + ikon + pesan error. "diubah" menampilkan label kecil kalau nilainya sudah berbeda dari aslinya.
export function Field({ label, id, icon: Icon, error, top, diubah, className = "", children }: {
  label: string; id?: string; icon?: LucideIcon; error?: string; top?: boolean; diubah?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center text-sm font-medium text-slate-700">
        {label}
        {diubah && <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">diubah</span>}
      </label>
      <div className="relative">
        {Icon && <Icon size={18} className={`pointer-events-none absolute left-3 text-orange-400 ${top ? "top-3" : "top-1/2 -translate-y-1/2"}`} />}
        {children}
      </div>
      {error && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {error}</p>}
    </div>
  );
}

// Popup sukses (sama dengan halaman tambah peserta)
export function PopupSukses({ judul, pesan, tombol, onLanjut }: { judul: string; pesan: React.ReactNode; tombol: string; onLanjut: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" role="alertdialog" aria-live="polite">
      <style>{`
        @keyframes pop { 0% { transform: scale(.6); opacity: 0 } 60% { transform: scale(1.05); opacity: 1 } 100% { transform: scale(1) } }
        @keyframes bar { from { width: 100% } to { width: 0% } }
      `}</style>
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl shadow-orange-300/50" style={{ animation: "pop .35s ease-out" }}>
        <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200/70" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={44} /></span>
        </span>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">{judul}</h3>
        <p className="mt-1 text-sm text-slate-500">{pesan}</p>
        <button type="button" onClick={onLanjut}
          className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">
          {tombol}
        </button>
        <span className="absolute bottom-0 left-0 h-1 bg-orange-400" style={{ animation: "bar 2.5s linear forwards" }} />
      </div>
    </div>
  );
}
