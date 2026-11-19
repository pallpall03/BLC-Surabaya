import Link from "next/link";
import { Images, Info, Newspaper, MapPin, Mail, ArrowRight } from "lucide-react";

const pintasan = [
  { label: "Slider Beranda", info: "Atur gambar slide di beranda", href: "/operator/slider", ikon: Images },
  { label: "Informasi", info: "Kelola sub-konten website", href: "/operator/informasi", ikon: Info },
  { label: "Artikel", info: "Tulis dan ubah artikel", href: "/operator/artikel", ikon: Newspaper },
  { label: "Lokasi", info: "Perbarui lokasi BLC", href: "/operator/lokasi", ikon: MapPin },
  { label: "Kontak", info: "Ubah data kontak", href: "/operator/kontak", ikon: Mail },
];

export default function BerandaOperator() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 p-6 text-white shadow-lg shadow-violet-200 sm:p-8">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Selamat datang</h2>
          <p className="mt-2 text-sm text-violet-100 sm:text-base">
            Atur semua konten yang tampil di website publik BLC Surabaya.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pintasan.map((p) => {
          const Ikon = p.ikon;
          return (
            <Link
              key={p.href}
              href={p.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Ikon size={22} />
              </span>
              <p className="mt-4 font-semibold text-slate-800">{p.label}</p>
              <p className="mt-1 text-sm text-slate-400">{p.info}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600">
                Buka <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}