import type { LucideIcon } from "lucide-react";

// Satu kartu angka ringkasan di bagian atas laporan.
export default function KartuRingkasan({ icon: Icon, label, nilai, catatan, warna }: {
  icon: LucideIcon;
  label: string;
  nilai: string | number;
  catatan?: string;
  warna: string; // contoh: "bg-orange-100 text-orange-600"
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-200/40 print:shadow-none">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${warna}`}><Icon size={24} /></span>
      <span className="min-w-0">
        <span className="block text-2xl font-semibold tabular-nums text-slate-900">{nilai}</span>
        <span className="block text-sm text-slate-600">{label}</span>
        {catatan && <span className="block text-xs text-slate-400">{catatan}</span>}
      </span>
    </div>
  );
}
