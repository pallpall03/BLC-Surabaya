"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, UserCircle } from "lucide-react";
import { useShell } from "./shell-context";

// Urutan penting: yang lebih spesifik di atas. * = satu bagian alamat apa saja.
const JUDUL: [string, string][] = [
  ["/instruktur/daftar_peserta/tambah_peserta", "Tambah peserta"],
  ["/instruktur/daftar_peserta/*/ubah", "Ubah peserta"],
  ["/instruktur/daftar_peserta", "Daftar peserta"],
  ["/instruktur/daftar_kelas/kelasbaru", "Buat kelas baru"],
  ["/instruktur/daftar_kelas/*/ubah", "Ubah kelas"],
  ["/instruktur/daftar_kelas/*/peserta", "Isi peserta kelas"],
  ["/instruktur/daftar_kelas", "Daftar kelas"],
  ["/instruktur/pelatihan/daftar_hadir", "Daftar hadir"],
  ["/instruktur/pelatihan/laporan", "Laporan pelatihan"],
  ["/instruktur/pengunjung/foto_kegiatan", "Foto kegiatan"],
  ["/instruktur/pengunjung/pengunjung", "Pengunjung"],
  ["/instruktur/tambah_pengunjung", "Tambah pengunjung"],
  ["/instruktur/sosialisasi", "Sosialisasi"],
  ["/instruktur/master_ujian/ujianbaru", "Buat ujian baru"],
  ["/instruktur/master_ujian/*/ubah", "Ubah ujian"],
  ["/instruktur/master_ujian/*/peserta", "Isi peserta ujian"],
  ["/instruktur/master_ujian", "Master ujian"],
  ["/instruktur/aktivitas/aktivitasbaru", "Tambah aktivitas"],
  ["/instruktur/aktivitas/*/ubah", "Ubah aktivitas"],
  ["/instruktur/aktivitas", "Aktivitas"],
  ["/instruktur/laporan_instruktur", "Laporan instruktur"],
  ["/instruktur/tes", "Tes Metronic"],
];

const cocok = (pola: string, alamat: string) =>
  new RegExp("^" + pola.replace(/\*/g, "[^/]+")).test(alamat);

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { setMobileOpen } = useShell();
  const [akun, setAkun] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const judul = JUDUL.find(([p]) => cocok(p, pathname))?.[1] ?? "Instruktur";

  useEffect(() => {
    const tutup = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAkun(false);
    };
    document.addEventListener("mousedown", tutup);
    return () => document.removeEventListener("mousedown", tutup);
  }, []);

  const keluar = () => {
    // TODO: panggil API logout Laravel + hapus token/session
    router.push("/");
  };

  return (
    <div id="kt_app_header" className="app-header">
      <div
        className="app-container container-fluid d-flex align-items-stretch justify-content-between"
        id="kt_app_header_container"
      >
        <div className="d-flex align-items-center d-lg-none ms-n3 me-1 me-md-2">
          <button
            type="button"
            aria-label="Buka menu"
            className="btn btn-icon btn-active-color-primary w-35px h-35px"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="d-flex flex-column justify-content-center flex-grow-1">
          <h1 className="text-dark fw-bold fs-3 my-0">{judul}</h1>
          <span className="text-muted fs-7 d-none d-sm-block">Instruktur BLC</span>
        </div>

        <div ref={ref} className="d-flex align-items-center position-relative">
          <button
            type="button"
            aria-expanded={akun}
            className="btn btn-active-light-primary d-flex align-items-center gap-2 px-2"
            onClick={() => setAkun((v) => !v)}
          >
            <span className="symbol symbol-35px">
              <span className="symbol-label bg-light-primary text-primary fw-bold">I</span>
            </span>
            <span className="d-none d-sm-inline fw-semibold text-gray-700">Instruktur</span>
          </button>

          {akun && (
            <div
              className="dropdown-menu show shadow"
              style={{ position: "absolute", right: 0, left: "auto", top: "100%" }}
            >
              <button type="button" className="dropdown-item d-flex align-items-center gap-2">
                <UserCircle size={16} /> Profil
              </button>
              <button
                type="button"
                className="dropdown-item d-flex align-items-center gap-2 text-danger"
                onClick={keluar}
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}