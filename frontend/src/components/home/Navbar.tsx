"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

type MenuItem = {
  label: string;
  id?: string; // scroll ke section di home
  href?: string; // pindah halaman
  anak?: { href: string; label: string }[];
};

const menu: MenuItem[] = [
  { label: "Beranda", id: "beranda" },
  {
    label: "Informasi",
    anak: [
      { href: "/tentang", label: "Tentang Kami" },
      { href: "/Maklumat-Pelayanan", label: "Maklumat Pelayanan" },
      { href: "/standar-layanan", label: "Standar Layanan" },
      { href: "/Materi", label: "Materi" },
      { href: "/Pendaftaran", label: "Pendaftaran" },
      { href: "/FAQ", label: "FAQ" },
    ],
  },
  { label: "Artikel", id: "artikel" },
  { label: "Lokasi", id: "lokasi" },
  { label: "Buku Tamu", id: "buku-tamu" },
  { label: "Kontak", id: "kontak" },
];

// "/#id" supaya tetap jalan kalau diklik dari halaman lain
const linkItem = (item: MenuItem) =>
  item.id ? `/#${item.id}` : item.href ?? "/";

export default function Navbar() {
  const pathname = usePathname();
  const pembungkus = useRef<HTMLDivElement>(null);
  const dariSentuh = useRef<boolean>(false); // terbuka karena diketuk di layar sentuh?

  const [turun, setTurun] = useState<boolean>(false); // sudah di-scroll? (dipakai desktop & HP)
  const [buka, setBuka] = useState<boolean>(false); // desktop: melebar lagi setelah scroll
  const [siap, setSiap] = useState<boolean>(true); // desktop: animasi selesai, dropdown boleh keluar dari pil
  const [seksi, setSeksi] = useState<string>("beranda"); // section yang sedang terlihat di home

  // desktop: menciut jadi satu logo kalau sudah di-scroll dan tidak sedang dibuka
  const ringkas = turun && !buka;

  // deteksi scroll
  useEffect(() => {
    function onScroll() {
      setTurun(window.scrollY > 24);
      // pil yang dibuka lewat ketukan menciut lagi saat halaman digulir
      if (dariSentuh.current) {
        dariSentuh.current = false;
        setBuka(false);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // sorot menu sesuai section yang sedang terlihat (hanya di home)
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = menu.flatMap((m) => (m.id ? [m.id] : []));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSeksi(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  // dropdown baru boleh keluar dari pil setelah animasi lebar selesai
  useEffect(() => {
    if (ringkas) {
      setSiap(false);
      return;
    }
    const t = setTimeout(() => setSiap(true), 320);
    return () => clearTimeout(t);
  }, [ringkas]);

  // ketuk di luar pil: menciut lagi
  useEffect(() => {
    if (!buka) return;
    function luar(e: PointerEvent) {
      if (pembungkus.current && !pembungkus.current.contains(e.target as Node)) {
        setBuka(false);
      }
    }
    document.addEventListener("pointerdown", luar);
    return () => document.removeEventListener("pointerdown", luar);
  }, [buka]);

  // pindah halaman: tutup
  useEffect(() => {
    setBuka(false);
  }, [pathname]);

  function aktif(href: string) {
    if (href.startsWith("/#")) return pathname === "/" && seksi === href.slice(2);
    return pathname.startsWith(href);
  }

  // ukuran pil desktop mengikuti posisi scroll
  const ukuranLink = turun ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-[13px]";
  const ukuranLogo = turun ? "h-10 w-10 text-sm" : "h-11 w-11 text-base";

  const pilAktif = "bg-orange-500 text-white shadow-md shadow-orange-200";
  const pilBiasa = "text-gray-700 hover:bg-white/70 hover:text-orange-500";

  return (
    <>
      {/* ===================== DESKTOP (lg ke atas): pil melayang ===================== */}
      {/* tinggi pembungkus tetap 80px supaya layout halaman tidak bergeser */}
      <header
        className={`pointer-events-none sticky top-0 z-50 hidden h-20 justify-center px-4 transition-all duration-300 lg:flex ${
          turun ? "pt-2" : "pt-4"
        }`}
      >
        <div
          ref={pembungkus}
          className="relative"
          // hover hanya untuk mouse; di layar sentuh pakai ketukan
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setBuka(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setBuka(false);
          }}
        >
          <nav
            className={`pointer-events-auto flex items-center rounded-full border border-white/60 ring-1 ring-black/5 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ${
              turun
                ? "bg-white/75 p-1 shadow-lg shadow-slate-900/10"
                : "bg-white/55 p-2 shadow-xl shadow-slate-900/10"
            }`}
          >
            {/* LOGO = tombol home. Saat menciut, ketukan pertama hanya melebarkan pil */}
            <Link
              href="/"
              aria-label="Beranda BLC Surabaya"
              onClick={(e) => {
                if (ringkas) {
                  e.preventDefault();
                  dariSentuh.current = true;
                  setBuka(true);
                }
              }}
              className="flex items-center gap-2.5 pr-1"
            >
              <span
                className={`flex items-center justify-center rounded-full bg-orange-500 font-bold text-white shadow-md shadow-orange-200 transition-all duration-300 ${ukuranLogo}`}
              >
                blc
              </span>
              <span
                className={`hidden overflow-hidden whitespace-nowrap text-[11px] font-bold leading-tight text-orange-500 transition-all duration-300 xl:block ${
                  turun ? "max-w-0 opacity-0" : "max-w-32 opacity-100"
                }`}
              >
                Broadband
                <br />
                Learning Center
              </span>
            </Link>

            {/* area yang melebar / menciut: pemisah + menu */}
            <div
              className={`flex items-center transition-all duration-300 ease-out ${
                ringkas ? "max-w-0 opacity-0" : "max-w-[44rem] opacity-100"
              } ${siap ? "overflow-visible" : "overflow-hidden"}`}
            >
              <span className="mx-3 h-5 w-px bg-slate-300/70" />

              <ul className="flex items-center gap-0.5 font-semibold uppercase tracking-wide">
                {menu.map((item) =>
                  item.anak ? (
                    <li key={item.label} className="group relative">
                      <span
                        className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full transition-all duration-300 ${ukuranLink} ${
                          item.anak.some((a) => aktif(a.href)) ? pilAktif : pilBiasa
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          size={13}
                          className="transition group-hover:rotate-180"
                        />
                      </span>

                      {/* pt-3 menjaga hover tetap menyambung antara tombol dan dropdown */}
                      <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100">
                        <ul className="min-w-56 rounded-2xl border border-white/60 bg-white/90 p-1.5 text-sm font-normal normal-case tracking-normal shadow-xl shadow-slate-900/10 backdrop-blur-xl">
                          {item.anak.map((a) => (
                            <li key={a.href}>
                              <Link
                                href={a.href}
                                className={`block rounded-xl px-4 py-2 transition ${
                                  aktif(a.href)
                                    ? "bg-orange-50 font-semibold text-orange-500"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                                }`}
                              >
                                {a.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <Link
                        href={linkItem(item)}
                        className={`block whitespace-nowrap rounded-full transition-all duration-300 ${ukuranLink} ${
                          aktif(linkItem(item)) ? pilAktif : pilBiasa
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </nav>
        </div>
      </header>

      {/* ===================== HP & TABLET (di bawah lg): top bar kecil ===================== */}
      {/* menunya ada di BottomNav, jadi di sini hanya logo */}
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center lg:hidden"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}
      >
        <Link
          href="/"
          aria-label="Beranda BLC Surabaya"
          className={`pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/60 p-1.5 pr-4 shadow-lg shadow-slate-900/10 ring-1 ring-black/5 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ${
            turun ? "bg-white/80 pr-1.5" : "bg-white/55"
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-200">
            blc
          </span>
          <span
            className={`overflow-hidden whitespace-nowrap text-xs font-bold leading-tight text-orange-500 transition-all duration-300 ${
              turun ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
            }`}
          >
            Broadband
            <br />
            Learning Center
          </span>
        </Link>
      </header>
    </>
  );
}