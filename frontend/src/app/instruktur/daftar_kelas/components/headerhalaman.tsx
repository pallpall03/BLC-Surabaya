import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

export default function HeaderHalaman({ icon: Icon, judul, deskripsi, kembali, children }: {
  icon: LucideIcon; judul: string; deskripsi?: React.ReactNode; kembali?: string; children?: React.ReactNode;
}) {
  return (
    <div className="card mb-6">
      <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-4 py-6">
        <div className="d-flex align-items-center gap-4">
          {kembali && (
            <Link href={kembali} aria-label="Kembali" title="Kembali"
              className="btn btn-icon btn-sm btn-light btn-active-light-primary">
              <ArrowLeft size={18} />
            </Link>
          )}
          <span className="symbol symbol-50px">
            <span className="symbol-label bg-light-primary text-primary"><Icon size={24} /></span>
          </span>
          <div>
            <h1 className="fs-2 fw-bold text-gray-900 mb-1">{judul}</h1>
            {deskripsi && <div className="fs-7 text-gray-500">{deskripsi}</div>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
