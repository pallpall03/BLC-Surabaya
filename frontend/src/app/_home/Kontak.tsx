"use client";

import { useEffect, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import SectionWrap from "./SectionWrap";
import { ambilKontak, kontakAwal, type Kontak as DataKontak } from "../administrator/konten/data";

export default function Kontak() {
  const [k, setK] = useState<DataKontak>(kontakAwal);

  useEffect(() => {
    ambilKontak().then(setK);
  }, []);

  const daftar = [
    { ikon: MapPin, label: "Alamat", isi: k.alamat },
    { ikon: Phone, label: "Telepon", isi: k.telepon },
    { ikon: Mail, label: "Email", isi: k.email },
    { ikon: Clock, label: "Jam layanan", isi: k.jam },
  ].filter((item) => item.isi.trim());

  return (
    <SectionWrap id="kontak" judul="Kontak" deskripsi="Hubungi kami kalau ada yang ingin ditanyakan.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {daftar.map((item) => {
          const Ikon = item.ikon;
          return (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Ikon size={22} />
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{item.label}</p>
              <p className="mt-1 break-words text-sm font-medium text-slate-700">{item.isi}</p>
            </div>
          );
        })}
      </div>
    </SectionWrap>
  );
}