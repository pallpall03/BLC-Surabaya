import { ImageIcon } from "lucide-react";

// Kotak foto. Kalau url kosong (data hardcode), tampil kotak berwarna sebagai penanda.
const WARNA = [
  "from-orange-300 to-amber-200",
  "from-sky-300 to-sky-100",
  "from-violet-300 to-violet-100",
  "from-emerald-300 to-emerald-100",
];

export default function FotoKotak({ url, indeks = 0, className = "" }: { url: string; indeks?: number; className?: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="Foto kegiatan" className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br text-white/90 ${WARNA[indeks % WARNA.length]} ${className}`}>
      <ImageIcon size={22} />
    </div>
  );
}
