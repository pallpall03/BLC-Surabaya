"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

// Popup centang animasi. Kalau `children` diisi, itu jadi tombol aksi (menggantikan tombol "Oke").
// `otomatis` = milidetik sebelum menutup sendiri (0 = tidak menutup sendiri).
export default function PopupSukses({ judul, detail, onTutup, otomatis = 3000, children }: {
  judul: string;
  detail?: string;
  onTutup: () => void;
  otomatis?: number;
  children?: React.ReactNode;
}) {
  useEffect(() => {
    if (!otomatis) return;
    const t = setTimeout(onTutup, otomatis);
    return () => clearTimeout(t);
  }, [otomatis, onTutup]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onTutup} role="alertdialog" aria-live="polite">
      <style>{`
        @keyframes pop { 0% { transform: scale(.6); opacity: 0 } 60% { transform: scale(1.05); opacity: 1 } 100% { transform: scale(1) } }
        @keyframes bar { from { width: 100% } to { width: 0% } }
      `}</style>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl shadow-orange-300/50" style={{ animation: "pop .35s ease-out" }}>
        <button type="button" onClick={onTutup} aria-label="Tutup" className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 hover:bg-orange-50 hover:text-orange-600"><X size={16} /></button>
        <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200/70" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={44} /></span>
        </span>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">{judul}</h3>
        {detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}
        <div className="mt-6 space-y-2">
          {children ?? (
            <button type="button" onClick={onTutup} className="w-full rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">Oke</button>
          )}
        </div>
        {otomatis > 0 && !children && <span className="absolute bottom-0 left-0 h-1 bg-orange-400" style={{ animation: `bar ${otomatis}ms linear forwards` }} />}
      </div>
    </div>
  );
}
