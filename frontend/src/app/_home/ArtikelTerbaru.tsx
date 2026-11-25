"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import SectionWrap from "./SectionWrap";
import { ambilArtikelLanding, ambilKategori, type Artikel, type Kategori } from "../administrator/artikel/data";

const KUNCI_DATA_ARTIKEL = "blc-data-artikel";

export default function ArtikelTerbaru() {
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    let aktif = true;
    function muatArtikel() {
      void Promise.all([ambilArtikelLanding(), ambilKategori()])
        .then(([daftarArtikel, daftarKategori]) => {
          if (!aktif) return;
          setGalat("");
          setArtikel(Array.isArray(daftarArtikel) ? daftarArtikel.slice(0, 6) : []);
          setKategori(Array.isArray(daftarKategori) ? daftarKategori : []);
        })
        .catch((e: unknown) => {
          if (!aktif) return;
          setGalat(e instanceof Error ? e.message : "Artikel belum dapat dimuat.");
        });
    }
    function perbaruiArtikel(e: StorageEvent) {
      if (e.key === KUNCI_DATA_ARTIKEL || e.key === null) muatArtikel();
    }
    muatArtikel();
    window.addEventListener("storage", perbaruiArtikel);
    return () => {
      aktif = false;
      window.removeEventListener("storage", perbaruiArtikel);
    };
  }, []);

  return (
    <SectionWrap
      id="artikel"
      judul="Artikel Terbaru"
      deskripsi="Berita, informasi, dan kegiatan terbaru dari BLC Surabaya."
    >
      {galat ? (
        <p role="alert" className="text-center text-sm text-red-600">{galat}</p>
      ) : (!Array.isArray(artikel) || artikel.length === 0) ? (
        <p className="text-center text-sm text-slate-400">Belum ada artikel yang dipublikasikan.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {artikel.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
              {item.foto ? (
                <img src={item.foto} alt="" className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-orange-50 to-violet-50 text-orange-500">
                  <span className="text-4xl font-bold">BLC</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{item.kategoriIds.map((id) => kategori.find((k) => k.id === id)?.nama).filter(Boolean).join(", ") || "Artikel"}</span>
                  {item.unggulan && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 font-medium text-amber-700">
                      <Star size={12} className="fill-amber-400 text-amber-400" /> Unggulan
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-slate-800">{item.judul}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.ringkasan}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionWrap>
  );
}
