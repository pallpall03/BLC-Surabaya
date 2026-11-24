"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Menu as IkonMenu,
  PanelLeft,
  Search,
  Bell,
  X,
} from "lucide-react";
import type { KonfigPeran } from "./tipe";
import { logout } from "@/lib/api";

export default function PanelShell({
  konfig,
  children,
}: {
  konfig: KonfigPeran;
  children: ReactNode;
}) {
  const { base, namaAkun, namaRole, menu, pengaturan } = konfig;
  const inisial = namaAkun.replace("Akun ", "").charAt(0);
  const pathname = usePathname();

  const [mobileBuka, setMobileBuka] = useState<boolean>(false); // drawer di HP
  const [ringkas, setRingkas] = useState<boolean>(false); // sidebar jadi rel ikon
  const [profilBuka, setProfilBuka] = useState<boolean>(false);
  const profilRef = useRef<HTMLDivElement>(null);

  function aktif(href: string) {
    return href === base ? pathname === base : pathname.startsWith(href);
  }

  // grup yang dibuka atau ditutup manual oleh pengguna
  const [grupBuka, setGrupBuka] = useState<Record<string, boolean>>({});

  // grup juga terbuka otomatis kalau ada anak yang sedang aktif
  function grupTerbuka(m: { label: string; anak?: { href: string }[] }) {
    const otomatis = !!m.anak?.some((a) => pathname.startsWith(a.href));
    return grupBuka[m.label] ?? otomatis;
  }

  // tutup dropdown profil kalau klik di luar
  useEffect(() => {
    function klikLuar(e: MouseEvent) {
      if (profilRef.current && !profilRef.current.contains(e.target as Node)) {
        setProfilBuka(false);
      }
    }
    document.addEventListener("mousedown", klikLuar);
    return () => document.removeEventListener("mousedown", klikLuar);
  }, []);

  // halaman yang sedang dibuka (ambil href terpanjang yang cocok)
  const semuaHalaman = [
    ...menu.flatMap((m) => (m.href ? [{ label: m.label, href: m.href }] : m.anak ?? [])),
    ...pengaturan,
  ];
  const halaman = semuaHalaman
    .filter((h) => aktif(h.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  const namaHalaman = halaman?.label ?? "Beranda";
  const induk = menu.find((m) => m.anak?.some((a) => a.href === halaman?.href));

  // class bantu untuk mode rel ikon (hanya berlaku di layar besar)
  const sembunyi = ringkas ? "lg:hidden" : "";
  const tengah = ringkas ? "lg:justify-center lg:px-0" : "";

  return (
    <div
      className="admin-metronic app-root app-page flex min-h-screen flex-row bg-[#f5f8fa] text-slate-700"
      data-kt-app-layout="light-sidebar"
    >
      {/* LATAR GELAP (hanya di HP saat drawer terbuka) */}
      {mobileBuka && (
        <div
          onClick={() => setMobileBuka(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR MELAYANG */}
      <aside
        className={`app-sidebar admin-sidebar ${ringkas ? "admin-sidebar-compact" : ""} fixed inset-y-0 left-0 z-50 flex h-screen w-[265px] flex-col bg-white transition-all duration-300 lg:sticky lg:top-0 ${
          mobileBuka ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* logo */}
        <div className={`app-sidebar-logo flex h-[70px] shrink-0 items-center justify-between px-6 ${tengah}`}>
          <div className="flex items-center gap-3">
            <span className="admin-brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-500 text-sm font-extrabold tracking-wide text-white">
              BLC
            </span>
            <p className={`font-semibold tracking-tight text-slate-800 ${sembunyi}`}>
              BLC Surabaya
            </p>
          </div>
          <button
            onClick={() => setMobileBuka(false)}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* menu */}
        <nav className="app-sidebar-menu menu menu-column menu-rounded menu-sub-indention menu-title-gray-700 menu-icon-gray-500 menu-arrow-gray-500 menu-hover-bg-light-primary flex-1 overflow-y-auto px-4 py-4">
          {menu.map((m) => {
            const Ikon = m.ikon;

            // menu tunggal
            if (m.href) {
              return (
                <div className={`menu-item ${aktif(m.href) ? "here" : ""}`} key={m.label}>
                  <Link
                    href={m.href}
                    title={ringkas ? m.label : undefined}
                    onClick={() => setMobileBuka(false)}
                    aria-current={aktif(m.href) ? "page" : undefined}
                    className={`menu-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${tengah} ${
                      aktif(m.href) ? "active" : ""
                    }`}
                  >
                    <span className="menu-icon flex w-5 shrink-0 justify-center">
                      <Ikon size={19} />
                    </span>
                    <span className={`menu-title ${sembunyi}`}>{m.label}</span>
                  </Link>
                </div>
              );
            }

            // menu bergrup
            const buka = grupTerbuka(m) && !ringkas;
            const adaAktif = m.anak?.some((a) => aktif(a.href));
            return (
              <div className={`menu-item menu-accordion ${adaAktif ? "here" : ""} ${buka ? "show" : ""}`} key={m.label}>
                <button
                  title={ringkas ? m.label : undefined}
                  aria-expanded={buka}
                  onClick={() => {
                    if (ringkas) {
                      // klik grup saat ringkas: lebarkan sidebar dan buka grupnya
                      setRingkas(false);
                      setGrupBuka((g) => ({ ...g, [m.label]: true }));
                    } else {
                      setGrupBuka((g) => ({ ...g, [m.label]: !grupTerbuka(m) }));
                    }
                  }}
                  className={`menu-link flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${tengah} ${
                    adaAktif ? "active" : ""
                  }`}
                >
                  <span className="menu-icon flex w-5 shrink-0 justify-center">
                    <Ikon size={19} />
                  </span>
                  <span className={`menu-title flex-1 text-left ${sembunyi}`}>{m.label}</span>
                  <span className={`menu-arrow ${sembunyi}`} />
                </button>

                {/* submenu dengan animasi buka-tutup */}
                <div
                  className={`menu-sub menu-sub-accordion grid transition-all duration-300 ${sembunyi} ${
                    buka ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mt-1 space-y-0.5 pl-7">
                      {m.anak?.map((a) => {
                        const IkonAnak = a.ikon;
                        return (
                          <div className="menu-item" key={a.href}>
                            <Link
                              href={a.href}
                              onClick={() => setMobileBuka(false)}
                              aria-current={aktif(a.href) ? "page" : undefined}
                              className={`menu-link flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                                aktif(a.href) ? "active" : ""
                              }`}
                            >
                              <span className="menu-icon flex w-5 shrink-0 justify-center">
                                <IkonAnak size={16} />
                              </span>
                              <span className="menu-title">{a.label}</span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* AREA KANAN */}
      <div className="app-wrapper flex min-w-0 flex-1 flex-col">
        {/* TOPBAR */}
        <header className="app-header z-30 flex h-[70px] shrink-0 items-stretch justify-between bg-white px-4 sm:px-6">
          <div className="app-header-wrapper flex min-w-0 flex-1 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <button
                onClick={() => setMobileBuka(true)}
                aria-label="Buka menu"
                className="btn btn-icon btn-light-primary lg:hidden"
              >
                <IkonMenu size={22} />
              </button>
              <button
                onClick={() => setRingkas((r) => !r)}
                aria-label="Ciutkan atau lebarkan sidebar"
                className="btn btn-icon btn-light-primary hidden lg:flex"
              >
                <PanelLeft size={20} />
              </button>
              <div className="relative hidden w-64 md:block">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  aria-label="Cari"
                  placeholder="Search..."
                  className="form-control admin-header-search w-full pl-10"
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {/* notifikasi */}
              <button
                aria-label="Notifikasi"
                className="btn btn-icon btn-light-primary relative"
              >
                <Bell size={20} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
              </button>

              {/* PROFIL + DROPDOWN */}
              <div className="relative" ref={profilRef}>
                <button
                  onClick={() => setProfilBuka((b) => !b)}
                  aria-label="Menu profil"
                  className="symbol symbol-40px symbol-circle"
                >
                  <span className="symbol-label bg-orange-500 text-sm font-semibold text-white">
                    {inisial}
                  </span>
                </button>

                {profilBuka && (
                  <div className="admin-profile-dropdown absolute right-0 mt-3 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white text-sm shadow-xl">
                    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                      <span className="symbol symbol-40px symbol-circle">
                        <span className="symbol-label bg-orange-500 text-sm font-semibold text-white">
                          {inisial}
                        </span>
                      </span>
                      <div className="leading-tight">
                        <p className="font-semibold text-slate-800">{namaAkun}</p>
                        <p className="text-xs text-slate-400">{namaRole}</p>
                      </div>
                    </div>

                    {/* daftar pengaturan: disembunyikan kalau kosong */}
                    {pengaturan.length > 0 && (
                      <>
                        <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                          Pengaturan
                        </p>
                        <div className="px-2 pb-2">
                          {pengaturan.map((p) => {
                            const Ikon = p.ikon;
                            return (
                              <Link
                                key={p.href}
                                href={p.href}
                                onClick={() => setProfilBuka(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
                              >
                                <Ikon size={16} /> {p.label}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <div className="border-t border-slate-100 p-2">
                      <button
                        type="button"
                        onClick={() => void logout()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-red-500 transition hover:bg-red-50"
                      >
                        <LogOut size={16} /> Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ISI HALAMAN */}
        <main className="app-main flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="app-content flex flex-1 flex-col">
            <div className="app-container container-fluid w-full px-4 pb-10 sm:px-6">
              <div className="app-toolbar mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="page-title d-flex flex-column justify-content-center">
                  <h1 className="fs-2 fw-bold mb-1 text-slate-800">
                    {namaHalaman}
                  </h1>
                  <nav aria-label="Breadcrumb" className="breadcrumb breadcrumb-separatorless fw-semibold fs-7">
                    <span className="text-muted">{induk?.label ?? namaRole}</span>
                    <span aria-hidden="true" className="breadcrumb-separator text-gray-400">
                      /
                    </span>
                    <span className="text-gray-800">{namaHalaman}</span>
                  </nav>
                </div>
              </div>
              <div className="admin-page-content">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}