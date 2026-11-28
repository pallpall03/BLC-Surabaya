"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { logout } from "@/lib/api";
import { useShell } from "./shell-context";

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
  ["/instruktur/pengunjung/pengunjung", "Daftar pengunjung"],
  ["/instruktur/tambah_pengunjung", "Tambah pengunjung"],
  ["/instruktur/sosialisasi", "Sosialisasi"],
  ["/instruktur/master_ujian/ujianbaru", "Buat ujian baru"],
  ["/instruktur/master_ujian/*/ubah", "Ubah ujian"],
  ["/instruktur/master_ujian/*/peserta", "Isi peserta ujian"],
  ["/instruktur/master_ujian", "Master ujian"],
  ["/instruktur/laporan_instruktur", "Aktivitas & laporan pengunjung"],
  ["/instruktur/tes", "Tes Metronic"],
];

const cocok = (pola: string, alamat: string) =>
  new RegExp("^" + pola.replace(/\*/g, "[^/]+")).test(alamat);

export default function Header() {
  const pathname = usePathname();
  const { setMobileOpen } = useShell();
  const [akun, setAkun] = useState(false);
  const [nama, setNama] = useState("Instruktur");
  const [keluarLoading, setKeluarLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const judul = JUDUL.find(([p]) => cocok(p, pathname))?.[1] ?? "Instruktur";
  const inisial = nama.trim().charAt(0).toUpperCase() || "I";

  useEffect(() => {
    void Promise.resolve().then(() => {
      try {
        const user = JSON.parse(localStorage.getItem("auth_user") ?? "null");
        if (typeof user?.name === "string" && user.name.trim()) setNama(user.name.trim());
      } catch {
        setNama("Instruktur");
      }
    });
  }, []);

  useEffect(() => {
    const tutup = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setAkun(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && akun) {
        setAkun(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("mousedown", tutup);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", tutup);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [akun]);

  const bukaMenu = () => {
    setAkun((value) => !value);
    requestAnimationFrame(() => menu.current?.querySelector<HTMLButtonElement>("button")?.focus());
  };

  const keluar = async () => {
    setKeluarLoading(true);
    await logout();
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
            aria-expanded={false}
            className="btn btn-icon btn-active-color-primary w-40px h-40px"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="d-flex flex-column justify-content-center flex-grow-1 min-w-0">
          <h2 className="text-dark fw-bold fs-3 my-0 text-truncate">{judul}</h2>
          <span className="text-muted fs-7 mt-1 d-none d-sm-block">Panel Instruktur · BLC Surabaya</span>
        </div>

        <div ref={ref} className="d-flex align-items-center position-relative ms-3">
          <button
            ref={trigger}
            type="button"
            aria-expanded={akun}
            aria-haspopup="menu"
            aria-controls="menu-akun-instruktur"
            className="btn btn-active-light-primary d-flex align-items-center gap-2 px-2"
            onClick={bukaMenu}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setAkun(true);
                requestAnimationFrame(() => menu.current?.querySelector<HTMLButtonElement>("button")?.focus());
              }
            }}
          >
            <span className="symbol symbol-38px">
              <span className="symbol-label bg-light-primary text-primary fw-bold">{inisial}</span>
            </span>
            <span className="d-none d-md-inline fw-semibold text-gray-700 text-truncate instruktur-account-name">{nama}</span>
            <ChevronDown size={15} className={`text-gray-400 transition ${akun ? "rotate-180" : ""}`} />
          </button>

          {akun && (
            <div
              ref={menu}
              id="menu-akun-instruktur"
              role="menu"
              className="dropdown-menu show shadow instruktur-account-menu"
              style={{ position: "absolute", right: 0, left: "auto", top: "100%" }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const buttons = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
                  const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
                  const next = (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
                  buttons[next]?.focus();
                }
              }}
            >
              <div className="px-4 py-3 border-bottom border-gray-200">
                <p className="fw-bold text-gray-900 fs-7 mb-1 text-truncate">{nama}</p>
                <span className="text-muted fs-8">Akun instruktur</span>
              </div>
              <div className="d-flex align-items-center gap-2 px-4 py-2 text-muted fs-8">
                <UserRound size={15} /> Instruktur BLC Surabaya
              </div>
              <div className="dropdown-divider" />
              <button
                type="button"
                role="menuitem"
                disabled={keluarLoading}
                className="dropdown-item d-flex align-items-center gap-2 text-danger"
                onClick={() => void keluar()}
              >
                <LogOut size={16} /> {keluarLoading ? "Sedang keluar…" : "Keluar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
