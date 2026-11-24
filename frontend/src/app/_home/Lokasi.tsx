"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import SectionWrap from "./SectionWrap";
import { ambilLokasiWebsite, type BlcBaru } from "../administrator/data";

export default function Lokasi() {
  const [daftar, setDaftar] = useState<BlcBaru[]>([]);

  useEffect(() => {
    ambilLokasiWebsite().then(setDaftar);
  }, []);

  return (
    <SectionWrap
      id="lokasi"
      judul="Lokasi BLC"
      deskripsi="Pilih BLC terdekat dari tempat tinggalmu."
    >
      {daftar.length === 0 ? (
        <p className="text-center text-sm text-slate-400">Belum ada lokasi.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {daftar.map((l) => (
            <a
              key={l.id}
              href={`https://www.google.com/maps/search/${encodeURIComponent(l.nama + " Surabaya")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-300 hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <MapPin size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">{l.nama}</p>
                <p className="text-xs text-slate-400">Buka di Google Maps</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </SectionWrap>
  );
}