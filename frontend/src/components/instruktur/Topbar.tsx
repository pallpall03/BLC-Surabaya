"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, UserCircle } from "lucide-react";

// Judul topbar per rute (yang lebih spesifik ditaruh di atas)
const JUDUL: [string, string][] = [
  ["/instruktur/daftar_peserta/tambah_peserta", "Tambah peserta"],
  ["/instruktur/daftar_peserta", "Daftar peserta"],
  ["/instruktur/daftar_kelas/kelasbaru", "Buat kelas baru"],
  ["/instruktur/daftar_kelas", "Daftar kelas"],
  ["/instruktur/pelatihan/daftar_hadir", "Daftar hadir"],
  ["/instruktur/pelatihan/laporan", "Laporan pelatihan"],
  ["/instruktur/pengunjung/foto_kegiatan", "Foto kegiatan"],
  ["/instruktur/pengunjung/pengunjung", "Pengunjung"],
  ["/instruktur/tambah_pengunjung", "Tambah pengunjung"],
  ["/dashboard", "Dashboard"],
  ["/instruktur/sosialisasi", "Sosialisasi"],
];

export default function Topbar({ bukaMenu }: { bukaMenu: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [akun, setAkun] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const judul = JUDUL.find(([p]) => pathname.startsWith(p))?.[1] ?? "Instruktur";

  useEffect(() => {
    const tutup = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setAkun(false); };
    document.addEventListener("mousedown", tutup);
    return () => document.removeEventListener("mousedown", tutup);
  }, []);

  const keluar = () => {
    // TODO: panggil API logout Laravel + hapus token/session
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-orange-100 bg-white/90 px-4 backdrop-blur sm:px-6 print:hidden">
      <button type="button" onClick={bukaMenu} aria-label="Buka menu" className="rounded-lg p-2 text-slate-500 hover:bg-orange-50 hover:text-orange-600 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="mr-auto">
        <h2 className="text-base font-semibold text-slate-900">{judul}</h2>
        <p className="hidden text-xs text-slate-500 sm:block">Instruktur BLC</p>
      </div>

      <button type="button" aria-label="Notifikasi" className="relative rounded-xl p-2 text-slate-500 transition hover:bg-orange-50 hover:text-orange-600">
        <Bell size={20} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
      </button>

      <div ref={ref} className="relative">
        <button type="button" onClick={() => setAkun((v) => !v)} aria-expanded={akun}
          className="flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition hover:bg-orange-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">I</span>
          <span className="hidden text-sm font-medium text-slate-700 sm:block">Instruktur</span>
          <ChevronDown size={16} className={`text-slate-400 transition ${akun ? "rotate-180" : ""}`} />
        </button>
        {akun && (
          <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-orange-100 bg-white py-1 shadow-xl shadow-orange-200/50">
            <button type="button" className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-orange-50">
              <UserCircle size={16} className="text-orange-500" /> Profil
            </button>
            <button type="button" onClick={keluar} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
              <LogOut size={16} /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}