import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Kerangka halaman autentikasi gaya Metronic 8 (layout "aside"): form di kiri, panel gambar di kanan.
 * Dipakai bersama oleh /login (semua role) dan /register (peserta) supaya tampilannya seragam.
 */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/metronic/assets/css/style.bundle.css" precedence="default" />
      <div className="d-flex flex-column flex-lg-row flex-column-fluid min-vh-100 bg-body">
        <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
          <div className="d-flex flex-center flex-column flex-lg-row-fluid">
            <div className="w-lg-500px p-10">{children}</div>
          </div>
          <div className="d-flex flex-center flex-wrap px-5">
            <div className="d-flex fw-semibold text-primary fs-base">
              <Link href="/" className="px-5">Beranda</Link>
              <Link href="/tentang" className="px-5">Tentang</Link>
              <Link href="/kontak" className="px-5">Kontak</Link>
            </div>
          </div>
        </div>

        <div
          className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2"
          style={{ backgroundImage: "url(/metronic/assets/media/auth/bg10.jpeg)" }}
        >
          <div className="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
            <Link href="/" className="mb-0 mb-lg-12 text-decoration-none">
              <span className="fs-2hx fw-bolder text-white">BLC Surabaya</span>
            </Link>
            <h1 className="d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7">
              Broadband Learning Center
            </h1>
            <div className="d-none d-lg-block text-white fs-base text-center">
              Satu pintu masuk untuk peserta, instruktur, koordinator, operator, dan admin.
              <br />
              Masuk menggunakan NIK Anda.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
