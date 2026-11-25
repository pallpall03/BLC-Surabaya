"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import SectionWrap from "./SectionWrap";
import {
  ambilLokasi,
  buatLinkGoogleMaps,
  type Lokasi as LokasiType,
} from "../administrator/lokasi/data";

export default function Lokasi() {
  const [daftar, setDaftar] = useState<LokasiType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ambilLokasi()
      .then((data) => {
        const list = Array.isArray(data) ? data.filter((item) => item.aktif) : [];
        setDaftar(list);
      })
      .catch((err) => {
        console.error("Gagal memuat lokasi di halaman utama:", err);
        setDaftar([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const daftarLokasi = Array.isArray(daftar) ? daftar : [];

  return (
    <SectionWrap
      id="lokasi"
      judul="Lokasi BLC"
      deskripsi="Pilih BLC terdekat dari tempat tinggalmu."
    >
      {loading ? (
        <p className="text-center text-sm text-slate-400">Memuat data lokasi...</p>
      ) : daftarLokasi.length === 0 ? (
        <p className="text-center text-sm text-slate-400">Belum ada lokasi.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {daftarLokasi.map((l) => {
            const linkMaps =
              buatLinkGoogleMaps(l.latitude, l.longitude) ||
              `https://www.google.com/maps/search/${encodeURIComponent(
                (l.nama_blc || "") + " Surabaya"
              )}`;

            return (
              <a
                key={l.id}
                href={linkMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-300 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <MapPin size={20} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {l.nama_blc}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {l.alamat ? l.alamat : "Buka di Google Maps"}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </SectionWrap>
  );
}