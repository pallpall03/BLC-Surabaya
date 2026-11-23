import { ArrowRight } from "lucide-react";
import { statistik } from "./data";

export default function Beranda() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 pb-20 pt-36 sm:px-6"
    >
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-200/40" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-orange-200/30" />

      <div className="relative mx-auto max-w-4xl text-center">
        <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600">
          Broadband Learning Center
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
          Belajar teknologi bersama <span className="text-orange-500">BLC Surabaya</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-500">
          Pusat pembelajaran digital untuk warga Surabaya. Temukan lokasi terdekat dan ikuti
          pelatihan yang tersedia.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#informasi"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
          >
            Lihat Informasi <ArrowRight size={16} />
          </a>
          <a
            href="#lokasi"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cari Lokasi
          </a>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-4">
          {statistik.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
              <p className="text-2xl font-extrabold text-orange-500 sm:text-3xl">{s.angka}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}