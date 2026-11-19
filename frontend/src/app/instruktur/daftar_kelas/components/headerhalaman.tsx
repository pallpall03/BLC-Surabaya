import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

export default function HeaderHalaman({ icon: Icon, judul, deskripsi, kembali, children }: {
  icon: LucideIcon; judul: string; deskripsi?: React.ReactNode; kembali?: string; children?: React.ReactNode;
}) {
  return (
    <>
      {kembali && (
        <Link href={kembali} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-700">
          <ArrowLeft size={16} /> Kembali
        </Link>
      )}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25"><Icon size={28} /></span>
          <div>
            <h1 className="text-2xl font-semibold">{judul}</h1>
            {deskripsi && <div className="mt-1 text-sm text-orange-50">{deskripsi}</div>}
          </div>
        </div>
        {children}
      </div>
    </>
  );
}