import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

// Banner oren di atas setiap halaman. `kembali` = alamat untuk tautan "Kembali".
export default function HeaderHalaman({ icon: Icon, judul, deskripsi, kembali, aksi, children }: {
  icon: LucideIcon;
  judul: string;
  deskripsi?: string;
  kembali?: string;
  aksi?: React.ReactNode; // tombol di kanan banner
  children?: React.ReactNode; // isi tambahan di bawah judul (mis. chip info)
}) {
  return (
    <div className="mb-6">
      {kembali && (
        <Link href={kembali} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-700">
          <ArrowLeft size={16} /> Kembali
        </Link>
      )}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25"><Icon size={28} /></span>
            <div>
              <h1 className="text-xl font-semibold sm:text-2xl">{judul}</h1>
              {deskripsi && <p className="text-sm text-orange-50">{deskripsi}</p>}
            </div>
          </div>
          {aksi}
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
