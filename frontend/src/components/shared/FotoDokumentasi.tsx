"use client";

/* eslint-disable @next/next/no-img-element */
import { ImageOff } from "lucide-react";
import { useState } from "react";

export default function FotoDokumentasi({ src, alt, className, width, height }: {
  src: string;
  alt: string;
  className: string;
  width: number;
  height: number;
}) {
  const [gagal, setGagal] = useState(false);

  if (!src || gagal) {
    return (
      <div role="img" aria-label={`${alt} tidak dapat dimuat`} className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
        <ImageOff size={20} />
      </div>
    );
  }

  return <img src={src} alt={alt} width={width} height={height} className={className} onError={() => setGagal(true)} />;
}
