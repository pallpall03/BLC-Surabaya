"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ambilBeranda, berandaAwal, type Beranda as DataBeranda } from "../administrator/konten/data";

export default function Beranda() {
  const [d, setD] = useState<DataBeranda>(berandaAwal);

  useEffect(() => {
    ambilBeranda().then(setD);
  }, []);

  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 pb-20 pt-36 sm:px-6"
    >
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-200/40" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-orange-200/30" />

      <div className="relative mx-auto max-w-4xl text-center">
        {d.lencana && (
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600">
            {d.lencana}
          </span>
        )}
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
          {d.judul} <span className="text-orange-500">{d.sorot}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-500">{d.deskripsi}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {d.tombolUtama && (
            <a
              href="#informasi"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
            >
              {d.tombolUtama} <ArrowRight size={16} />
            </a>
          )}
          {d.tombolKedua && (
            <a
              href="#lokasi"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {d.tombolKedua}
            </a>
          )}
        </div>

        {d.statistik.length > 0 && (
          <div
            className="mt-14 grid gap-4"
            style={{ gridTemplateColumns: `repeat(${d.statistik.length}, minmax(0, 1fr))` }}
          >
            {d.statistik.map((s, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                <p className="text-2xl font-extrabold text-orange-500 sm:text-3xl">{s.angka}</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}