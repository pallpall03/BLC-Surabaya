import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import SectionWrap from "./SectionWrap";
import { ambilArtikelTerbaru } from "@/lib/artikel-publik";

export default async function Artikel() {
  const daftar = (await ambilArtikelTerbaru()).slice(0, 6);

  return (
    <SectionWrap
      id="artikel"
      judul="Artikel Terbaru"
      subjudul="Kabar dan tips terbaru dari BLC Surabaya"
      latar="bg-sky-50"
      aksi={
        <Link
          href="/artikel"
          className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 transition hover:text-orange-600"
        >
          Lihat semua <ArrowRight size={16} />
        </Link>
      }
    >
      {daftar.length === 0 ? (
        <p className="py-12 text-center text-slate-400">Belum ada artikel.</p>
      ) : (
        // HP/tablet: geser ke samping dan menempel per kartu. Layar lebar: grid 3 kolom.
        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {daftar.map((a) => (
            <article
              key={a.id}
              className="group w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-[46%] lg:w-auto"
            >
              {/* gambar / placeholder */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-sky-200 to-orange-100">
                {a.gambar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.gambar}
                    alt={a.judul}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-500 backdrop-blur">
                  {a.kategori}
                </span>
              </div>

              <div className="p-5">
                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CalendarDays size={14} /> {a.tanggal}
                </p>
                <h3 className="mt-2 line-clamp-2 font-semibold text-slate-800">{a.judul}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{a.ringkas}</p>
                <Link
                  href="/artikel"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 transition group-hover:gap-2.5"
                >
                  Baca selengkapnya <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionWrap>
  );
}