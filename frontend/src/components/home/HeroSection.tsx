"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { heroSlides } from "@/data/heroSlides";

export default function HeroSection() {
  // nomor slide yang sedang tampil (mulai dari 0)
  const [aktif, setAktif] = useState<number>(0);

  // geser otomatis ke kanan tiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setAktif((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="beranda"
      className="relative -mt-20 h-screen snap-start overflow-hidden bg-sky-300"
    >
      {/* TRACK: semua gambar berjajar ke samping, lalu digeser */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${aktif * 100}%)` }}
      >
        {heroSlides.map((s, i) => (
          <div key={s.id} className="relative h-full w-full shrink-0 grow-0 basis-full">
            <Image
              src={s.gambar}
              alt={s.judul}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* INDIKATOR TITIK (pojok kanan atas, di bawah navbar) */}
      <div className="absolute right-6 top-28 z-20 flex gap-2">
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setAktif(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-3 w-3 rounded-full transition ${
              i === aktif ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}