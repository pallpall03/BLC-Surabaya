import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

export default function HeaderHalaman({ icon: Icon, judul, deskripsi, kembali, children }: {
  icon: LucideIcon; judul: string; deskripsi?: React.ReactNode; kembali?: string; children?: React.ReactNode;
}) {
  return (
    <>
      {kembali && (
        <Link href={kembali} aria-label="Kembali ke daftar" className="instruktur-back-link mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-700">
          <ArrowLeft size={16} /> Kembali
        </Link>
      )}
      <header className="instruktur-page-header mb-6">
        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-4 py-6">
          <div className="d-flex min-w-0 align-items-center gap-4">
            <span className="symbol symbol-50px flex-shrink-0">
              <span className="symbol-label bg-light-primary text-primary"><Icon size={24} /></span>
            </span>
            <div className="min-w-0">
              <h1 className="fs-2 fw-bold text-gray-900 mb-1">{judul}</h1>
              {deskripsi && <div className="fs-7 text-gray-500">{deskripsi}</div>}
            </div>
          </div>
          {children && <div className="instruktur-page-actions">{children}</div>}
        </div>
      </header>
    </>
  );
}
