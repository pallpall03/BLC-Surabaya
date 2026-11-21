import type { ReactNode } from "react";

export default function SectionWrap({
  id,
  judul,
  subjudul,
  latar = "bg-white",
  aksi,
  children,
}: {
  id: string;
  judul: string;
  subjudul?: string;
  latar?: string;
  aksi?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`flex min-h-screen snap-start items-center px-6 py-20 ${latar}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              {judul}
            </h2>
            {subjudul && <p className="mt-1 text-sm text-slate-500">{subjudul}</p>}
          </div>
          {aksi}
        </div>
        {children}
      </div>
    </section>
  );
}