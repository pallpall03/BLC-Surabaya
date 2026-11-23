import { Clock, Mail, MapPin, Phone } from "lucide-react";
import SectionWrap from "./SectionWrap";
import { kontak } from "./data";

export default function Kontak() {
  const daftar = [
    { ikon: MapPin, label: "Alamat", isi: kontak.alamat },
    { ikon: Phone, label: "Telepon", isi: kontak.telepon },
    { ikon: Mail, label: "Email", isi: kontak.email },
    { ikon: Clock, label: "Jam layanan", isi: kontak.jam },
  ];

  return (
    <SectionWrap id="kontak" judul="Kontak" deskripsi="Hubungi kami kalau ada yang ingin ditanyakan.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {daftar.map((k) => {
          const Ikon = k.ikon;
          return (
            <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Ikon size={22} />
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{k.label}</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{k.isi}</p>
            </div>
          );
        })}
      </div>
    </SectionWrap>
  );
}