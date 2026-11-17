"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    judul: "Media Sosial BLC",
    deskripsi:
      "Jangan lupa kunjungi media sosial kita untuk info terbaru tentang BLC.",
    gambar: "/images/belum.ada.png",
  },
  { id: 2, judul: "Judul Slide 2", deskripsi: "Deskripsi slide 2.", gambar: "/images/slide-2.png" },
  { id: 3, judul: "Judul Slide 3", deskripsi: "Deskripsi slide 3.", gambar: "/images/slide-3.png" },
  { id: 4, judul: "Judul Slide 4", deskripsi: "Deskripsi slide 4.", gambar: "/images/slide-4.png" },
];

export default function HeroSlider() {
  const [aktif, setAktif] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAktif((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[aktif];

  return (
    <section
      className="relative min-h-[560px] bg-sky-200 bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${slide.gambar})` }}
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* ✨ ANIMASI 1: teks ganti slide */}
        <div className="max-w-xl bg-gray-700/70 text-white p-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.judul}</h1>
          <p className="text-lg">{slide.deskripsi}</p>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setAktif(i)}
            aria-label={`Slide ${i + 1}`}
            /* ✨ ANIMASI 2: titik/tombol */
            className={`w-3 h-3 rounded-full border-2 border-white ${
              i === aktif ? "bg-pink-500" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </section>
  );
}