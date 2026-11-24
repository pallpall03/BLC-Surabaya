"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { ambilBukuTamu } from "../buku_tamu/data";
import { ambilTestimoni } from "../testimoni/data";

export default function PanelShell({
  konfig,
  children,
}: {
  konfig: KonfigPeran;
  children: ReactNode;
}) {
  const { base, namaAkun, namaRole, menu, pengaturan } = konfig;
  const inisial = namaAkun.replace(/^Akun\s+/i, "").trim().charAt(0).toUpperCase();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileBuka, setMobileBuka] = useState(false);
  const [ringkas, setRingkas] = useState(false);
  const [profilBuka, setProfilBuka] = useState(false);
  const [notifikasiBuka, setNotifikasiBuka] = useState(false);
  const [jumlahPesanBelumDibaca, setJumlahPesanBelumDibaca] = useState(0);
  const [jumlahTestimoniNonaktif, setJumlahTestimoniNonaktif] = useState(0);
  const [grupBuka, setGrupBuka] = useState<Record<string, boolean>>({});

  const [pencarian, setPencarian] = useState("");
  const [hasilBuka, setHasilBuka] = useState(false);

  const profilRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifikasiRef = useRef<HTMLDivElement>(null);

  const muatNotifikasi = useCallback(async () => {
    const bukuTamu = await ambilBukuTamu();
    const testimoni = ambilTestimoni();

    setJumlahPesanBelumDibaca(
      bukuTamu.filter((pesan) => !pesan.dibaca).length
    );
    setJumlahTestimoniNonaktif(
      testimoni.filter((item) => item.status === "nonaktif").length
    );
  }, []);

  function aktif(href: string) {
    return href === base
      ? pathname === base
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function grupTerbuka(m: { label: string; anak?: { href: string }[] }) {
    const otomatis = !!m.anak?.some((a) => pathname.startsWith(a.href));
    return grupBuka[m.label] ?? otomatis;
  }

  // Tutup dropdown ketika pengguna mengklik di luar area komponen.
  useEffect(() => {
    function klikLuar(e: MouseEvent) {
      if (
        profilRef.current &&
        !profilRef.current.contains(e.target as Node)
      ) {
        setProfilBuka(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setHasilBuka(false);
      }

      if (
        notifikasiRef.current &&
        !notifikasiRef.current.contains(e.target as Node)
      ) {
        setNotifikasiBuka(false);
      }
    }

    function tekanTombol(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProfilBuka(false);
        setHasilBuka(false);
        setNotifikasiBuka(false);
      }
    }

    document.addEventListener("mousedown", klikLuar);
    document.addEventListener("keydown", tekanTombol);

    return () => {
      document.removeEventListener("mousedown", klikLuar);
      document.removeEventListener("keydown", tekanTombol);
    };
  }, []);

  useEffect(() => {
    function perbaruiNotifikasi() {
      void muatNotifikasi();
    }

    window.addEventListener("testimoni-berubah", perbaruiNotifikasi);
    window.addEventListener("buku-tamu-berubah", perbaruiNotifikasi);
    window.addEventListener("storage", perbaruiNotifikasi);

    return () => {
      window.removeEventListener("testimoni-berubah", perbaruiNotifikasi);
      window.removeEventListener("buku-tamu-berubah", perbaruiNotifikasi);
      window.removeEventListener("storage", perbaruiNotifikasi);
    };
  }, [muatNotifikasi]);

  const semuaHalaman = [
    ...menu.flatMap((m) =>
      m.href
        ? [{ label: m.label, href: m.href }]
        : m.anak ?? []
    ),
    ...pengaturan,
  ];

  const hasilPencarian = pencarian.trim()
    ? semuaHalaman
        .filter((h) =>
          h.label.toLowerCase().includes(pencarian.trim().toLowerCase())
        )
        .slice(0, 8)
    : [];

  const halaman = semuaHalaman
    .filter((h) => aktif(h.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  const namaHalaman = halaman?.label ?? "Beranda";

  const induk = menu.find((m) =>
    m.anak?.some((a) => a.href === halaman?.href)
  );

  const sembunyi = ringkas ? "lg:hidden" : "";
  const tengah = ringkas ? "lg:justify-center lg:px-0" : "";

  return (
    <div className="admin-metronic admin-glass app-root app-page flex min-h-screen flex-row">

      {mobileBuka && (
        <div
          onClick={() => setMobileBuka(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`app-sidebar admin-sidebar ${
          ringkas ? "admin-sidebar-compact" : ""
        } fixed inset-y-0 left-0 z-50 flex h-screen flex-col transition-all duration-300 lg:sticky lg:top-0 ${
          mobileBuka
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        <div className="app-sidebar-logo flex h-[70px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            href={base}
            className={`flex items-center gap-3 ${tengah}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-white">
              BLC
            </span>

            <span
              className={`text-base font-bold tracking-wide text-white ${sembunyi}`}
            >
              BLC Surabaya
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileBuka(false)}
            aria-label="Tutup menu"
            className="p-1.5 text-gray-400 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="app-sidebar-menu menu menu-column menu-rounded menu-sub-indention flex-1 overflow-y-auto px-4 py-5">

          <div className="menu-item mb-3">
            <span
              className={`menu-content px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${sembunyi}`}
            >
              MENU UTAMA
            </span>
          </div>

          {menu.map((m) => {
            const Ikon = m.ikon;

            if (m.href) {
              const sedangAktif = aktif(m.href);

              return (
                <div
                  className={`menu-item ${sedangAktif ? "here" : ""}`}
                  key={m.label}
                >
                  <Link
                    href={m.href}
                    title={ringkas ? m.label : undefined}
                    onClick={() => setMobileBuka(false)}
                    aria-current={sedangAktif ? "page" : undefined}
                    className={`menu-link flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${tengah} ${
                      sedangAktif ? "active" : ""
                    }`}
                  >
                    <span className="menu-icon flex w-5 shrink-0 justify-center text-gray-400">
                      <Ikon size={19} />
                    </span>

                    <span className={`menu-title ${sembunyi}`}>
                      {m.label}
                    </span>
                  </Link>
                </div>
              );
            }

            const buka = grupTerbuka(m) && !ringkas;
            const adaAktif = m.anak?.some((a) => aktif(a.href));

            return (
              <div
                className={`menu-item menu-accordion ${
                  adaAktif ? "here" : ""
                } ${buka ? "show" : ""}`}
                key={m.label}
              >
                <button
                  type="button"
                  title={ringkas ? m.label : undefined}
                  aria-expanded={buka}
                  onClick={() => {
                    if (ringkas) {
                      setRingkas(false);
                      setGrupBuka((g) => ({
                        ...g,
                        [m.label]: true,
                      }));
                    } else {
                      setGrupBuka((g) => ({
                        ...g,
                        [m.label]: !grupTerbuka(m),
                      }));
                    }
                  }}
                  className={`menu-link flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${tengah} ${
                    adaAktif ? "active" : ""
                  }`}
                >
                  <span className="menu-icon flex w-5 shrink-0 justify-center text-gray-400">
                    <Ikon size={19} />
                  </span>

                  <span className={`menu-title flex-1 text-left ${sembunyi}`}>
                    {m.label}
                  </span>

                  <span className={`menu-arrow ${sembunyi}`} />
                </button>

                <div
                  className={`menu-sub menu-sub-accordion grid transition-all duration-300 ${sembunyi} ${
                    buka
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mt-1 space-y-1 pl-6">
                      {m.anak?.map((a) => {
                        const IkonAnak = a.ikon;
                        const sedangAktif = aktif(a.href);

                        return (
                          <div className="menu-item" key={a.label}>
                            <Link
                              href={a.href}
                              onClick={() => setMobileBuka(false)}
                              aria-current={sedangAktif ? "page" : undefined}
                              className={`menu-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                                sedangAktif ? "active" : ""
                              }`}
                            >
                              <span className="menu-icon flex w-5 shrink-0 justify-center">
                                <IkonAnak size={16} />
                              </span>

                              <span className="menu-title">
                                {a.label}
                              </span>
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

        <div className="border-t border-white/10 px-5 py-4">
          <p className={`text-xs text-gray-500 ${sembunyi}`}>
            BLC Surabaya Administrator
          </p>
        </div>
      </aside>

      <div className="app-wrapper flex min-w-0 flex-1 flex-col">
        <header className="app-header z-30 flex min-h-[70px] shrink-0 items-center bg-white px-4 shadow-sm sm:px-6">
          <div className="app-header-wrapper flex w-full items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-4">

              {/* Mobile: buka sidebar. Visibilitas diatur di wrapper agar
                  tidak ditimpa display bawaan class "btn". */}
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileBuka(true)}
                  aria-label="Buka menu"
                  className="btn btn-icon btn-light-primary"
                >
                  <IkonMenu size={22} />
                </button>
              </div>

              {/* Desktop: ciutkan / lebarkan sidebar. */}
              <div className="hidden lg:block">
                <button
                  type="button"
                  onClick={() => setRingkas((r) => !r)}
                  aria-label="Ciutkan atau lebarkan sidebar"
                  aria-pressed={ringkas}
                  className="btn btn-icon btn-light-primary"
                >
                  <PanelLeft size={20} />
                </button>
              </div>

              <div
                ref={searchRef}
                className="relative hidden w-64 md:block"
              >
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  aria-label="Cari halaman"
                  placeholder="Search..."
                  value={pencarian}
                  onChange={(e) => {
                    setPencarian(e.target.value);
                    setHasilBuka(true);
                  }}
                  onFocus={() => setHasilBuka(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setPencarian("");
                      setHasilBuka(false);
                    }

                    if (
                      e.key === "Enter" &&
                      hasilPencarian.length > 0
                    ) {
                      router.push(hasilPencarian[0].href);
                      setPencarian("");
                      setHasilBuka(false);
                      setMobileBuka(false);
                    }
                  }}
                  className="form-control admin-header-search w-full pl-10"
                />

                {hasilBuka && pencarian.trim() !== "" && (
                  <div className="admin-dropdown absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">

                    {hasilPencarian.length > 0 ? (
                      <div className="max-h-72 overflow-y-auto p-2">
                        {hasilPencarian.map((hasil) => (
                          <Link
                            key={hasil.href}
                            href={hasil.href}
                            onClick={() => {
                              setPencarian("");
                              setHasilBuka(false);
                              setMobileBuka(false);
                            }}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                          >
                            <Search
                              size={15}
                              className="text-gray-400"
                            />
                            <span>{hasil.label}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-500">
                        Halaman tidak ditemukan.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="relative" ref={notifikasiRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotifikasiBuka((buka) => !buka);
                    void muatNotifikasi();
                  }}
                  aria-label="Notifikasi"
                  aria-expanded={notifikasiBuka}
                  aria-haspopup="menu"
                  className="btn btn-icon btn-light-primary relative"
                >
                  <Bell size={20} />

                  {jumlahPesanBelumDibaca + jumlahTestimoniNonaktif > 0 && (
                    <span className="admin-notification-count absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
                      {jumlahPesanBelumDibaca + jumlahTestimoniNonaktif}
                    </span>
                  )}
                </button>

                {notifikasiBuka && (
                  <div
                    className="admin-dropdown absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
                    role="menu"
                  >
                    <p className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-800">
                      Notifikasi
                    </p>

                    {jumlahPesanBelumDibaca + jumlahTestimoniNonaktif === 0 ? (
                      <p className="px-4 py-4 text-sm text-gray-500">
                        Tidak ada notifikasi baru.
                      </p>
                    ) : (
                      <div className="p-2">
                        {jumlahPesanBelumDibaca > 0 && (
                          <Link
                            href={`${base}/buku_tamu`}
                            role="menuitem"
                            onClick={() => setNotifikasiBuka(false)}
                            className="flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-gray-100"
                          >
                            <span className="text-gray-700">
                              Pesan buku tamu belum dibaca
                            </span>
                            <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                              {jumlahPesanBelumDibaca}
                            </span>
                          </Link>
                        )}

                        {jumlahTestimoniNonaktif > 0 && (
                          <Link
                            href={`${base}/testimoni`}
                            role="menuitem"
                            onClick={() => setNotifikasiBuka(false)}
                            className="flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-gray-100"
                          >
                            <span className="text-gray-700">
                              Testimoni belum aktif
                            </span>
                            <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                              {jumlahTestimoniNonaktif}
                            </span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative" ref={profilRef}>
                <button
                  type="button"
                  onClick={() => setProfilBuka((b) => !b)}
                  aria-label="Menu profil"
                  aria-expanded={profilBuka}
                  aria-haspopup="menu"
                  className="symbol symbol-40px symbol-circle"
                >
                  <span className="symbol-label bg-primary text-sm font-semibold text-white">
                    {inisial}
                  </span>
                </button>

                {profilBuka && (
                  <div className="admin-profile-dropdown absolute right-0 mt-3 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white text-sm shadow-xl">

                    <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
                      <span className="symbol symbol-40px symbol-circle">
                        <span className="symbol-label bg-primary text-sm font-semibold text-white">
                          {inisial}
                        </span>
                      </span>

                      <div className="leading-tight">
                        <p className="font-semibold text-gray-800">
                          {namaAkun}
                        </p>
                        <p className="text-xs text-gray-400">
                          {namaRole}
                        </p>
                      </div>
                    </div>

                    {pengaturan.length > 0 && (
                      <>
                        <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
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
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition hover:bg-gray-100"
                              >
                                <Ikon size={16} />
                                {p.label}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <div className="border-t border-slate-100 p-2">
                      <Link
                        href="/login"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition hover:bg-red-50"
                      >
                        <LogOut size={16} /> Keluar
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="app-main flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="app-content flex flex-1 flex-col">
            <div className="app-container container-fluid w-full px-4 pb-10 sm:px-6">

              <div className="app-toolbar mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="page-title d-flex flex-column justify-content-center">
                  <h1 className="fs-2 fw-bold mb-1 text-gray-900">
                    {namaHalaman}
                  </h1>

                  <nav
                    aria-label="Breadcrumb"
                    className="breadcrumb breadcrumb-separatorless fw-semibold fs-7"
                  >
                    <span className="text-muted">
                      {induk?.label ?? namaRole}
                    </span>

                    <span
                      aria-hidden="true"
                      className="breadcrumb-separator text-gray-400"
                    >
                      /
                    </span>

                    <span className="text-gray-800">
                      {namaHalaman}
                    </span>
                  </nav>
                </div>
              </div>

              <div className="admin-page-content">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}