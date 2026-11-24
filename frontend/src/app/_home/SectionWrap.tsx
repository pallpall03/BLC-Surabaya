import type { ReactNode } from "react";

export default function SectionWrap({
  id,
  judul,
  deskripsi,
  children,
}: {
  id: string;
  judul: string;
  deskripsi?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">{judul}</h2>
          {deskripsi && <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{deskripsi}</p>}
          <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-orange-500" />
        </div>
        {children}
      </div>
    </section>
  );
}