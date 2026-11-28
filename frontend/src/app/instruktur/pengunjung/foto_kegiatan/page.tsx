"use client";

import { Camera } from "lucide-react";
import FotoKegiatan from "@/components/fotokegiatan";

export default function FotoKegiatanPage() {
  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25"><Camera size={28} /></span>
          <div><h1 className="text-2xl font-semibold">Foto &amp; laporan kegiatan pengunjung</h1><p className="text-sm text-orange-50">Tulis laporan sekaligus unggah, ubah, dan kelola foto untuk seluruh BLC.</p></div>
        </div>
        <FotoKegiatan />
      </div>
    </main>
  );
}
