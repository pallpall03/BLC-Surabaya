"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Database,
  Monitor,
  Users,
  GraduationCap,
  BookOpen,
  Images,
  Info,
  Newspaper,
  MapPin,
  Mail,
  ShieldCheck,
  Tags,
  Layers,
  List,
  KeyRound,
  UserCog,
  LogOut,
  Menu as IkonMenu,
  PanelLeft,
  ChevronDown,
  Search,
  Bell,
  X,
  type LucideIcon,
} from "lucide-react";

const BASE = "/dashboard/administrator";

type MenuAnak = { label: string; href: string; ikon: LucideIcon };
type MenuItem = {
  label: string;
  ikon: LucideIcon;
  href?: string; // menu tunggal
  anak?: MenuAnak[]; // menu bergrup
};

// SESUAIKAN href dengan nama folder halaman yang sudah kamu buat
const menu: MenuItem[] = [
  { label: "Beranda", ikon: Home, href: BASE },
  {
    label: "Data",
    ikon: Database,
    anak: [
      { label: "Pengguna", href: `${BASE}/pengguna`, ikon: Users },
      { label: "Pelatihan", href: `${BASE}/pelatihan`, ikon: GraduationCap },
      { label: "Buku Tamu", href: `${BASE}/buku-tamu`, ikon: BookOpen },
    ],
  },
  {
    label: "Konten Statis",
    ikon: Monitor,
    anak: [
      { label: "Slider Beranda", href: `${BASE}/slider`, ikon: Images },
      { label: "Informasi", href: `${BASE}/informasi`, ikon: Info },
      { label: "Artikel", href: `${BASE}/artikel`, ikon: Newspaper },
      { label: "Lokasi", href: `${BASE}/lokasi`, ikon: MapPin },
      { label: "Kontak", href: `${BASE}/kontak`, ikon: Mail },
    ],
  },
];

// Menu Setting ada di dropdown profil
const pengaturan: MenuAnak[] = [
  { label: "Hak Akses", href: `${BASE}/hak-akses`, ikon: ShieldCheck },
  { label: "Kategori Menu", href: `${BASE}/kategori-menu`, ikon: Tags },
  { label: "Level Pengguna", href: `${BASE}/level-pengguna`, ikon: Layers },
  { label: "Menu", href: `${BASE}/menu`, ikon: List },
  { label: "Ubah Password", href: `${BASE}/ubah-password`, ikon: KeyRound },
  { label: "User Manager", href: `${BASE}/user-manager`, ikon: UserCog },
];

// semua halaman dalam satu daftar, dipakai untuk judul + breadcrumb
const semuaHalaman: { label: string; href: string }[] = [
  ...menu.flatMap((m) =>
    m.href ? [{ label: m.label, href: m.href }] : m.anak ?? []
  ),
  ...pengaturan,
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [mobileBuka, setMobileBuka] = useState<boolean>(false); // drawer di HP
  const [ringkas, setRingkas] = useState<boolean>(false); // sidebar jadi rel ikon (desktop)
  const [profilBuka, setProfilBuka] = useState<boolean>(false);
  const profilRef = useRef<HTMLDivElement>(null);

  function aktif(href: string) {
    return href === BASE ? pathname === BASE : pathname.startsWith(href);
  }

  // grup terbuka otomatis kalau ada anak yang sedang aktif
  const [grupBuka, setGrupBuka] = useState<Record<string, boolean>>(() => {
    const awal: Record<string, boolean> = {};
    menu.forEach((m) => {
      if (m.anak?.some((a) => pathname.startsWith(a.href))) awal[m.label] = true;
    });
    return awal;
  });

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
  const halaman = semuaHalaman
    .filter((h) => aktif(h.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  const namaHalaman = halaman?.label ?? "Beranda";
  const induk = menu.find((m) => m.anak?.some((a) => a.href === halaman?.href));

  // class bantu untuk mode rel ikon (hanya berlaku di layar besar)
  const sembunyi = ringkas ? "lg:hidden" : "";
  const tengah = ringkas ? "lg:justify-center lg:px-0" : "";

  return (
    <div className="flex h-screen bg-[#f4f5f7] text-slate-700">
      {/* LATAR GELAP (hanya di HP saat drawer terbuka) */}
      {mobileBuka && (
        <div
          onClick={() => setMobileBuka(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR MELAYANG */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white transition-all duration-300 lg:static lg:m-3 lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-sm ${
          ringkas ? "lg:w-[84px]" : "lg:w-72"
        } ${mobileBuka ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* logo */}
        <div
          className={`flex h-16 shrink-0 items-center justify-between px-5 ${tengah}`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-extrabold text-white shadow-lg shadow-orange-200">
              blc
            </span>
            <p className={`font-bold tracking-tight text-slate-800 ${sembunyi}`}>
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
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {menu.map((m) => {
            const Ikon = m.ikon;

            // menu tunggal
            if (m.href) {
              return (
                <Link
                  key={m.label}
                  href={m.href}
                  title={ringkas ? m.label : undefined}
                  onClick={() => setMobileBuka(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${tengah} ${
                    aktif(m.href)
                      ? "bg-orange-50 font-semibold text-orange-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Ikon size={19} className="shrink-0" />
                  <span className={sembunyi}>{m.label}</span>
                </Link>
              );
            }

            // menu bergrup
            const buka = !!grupBuka[m.label] && !ringkas;
            const adaAktif = m.anak?.some((a) => aktif(a.href));
            return (
              <div key={m.label}>
                <button
                  title={ringkas ? m.label : undefined}
                  onClick={() => {
                    if (ringkas) {
                      // klik grup saat ringkas: lebarkan sidebar dan buka grupnya
                      setRingkas(false);
                      setGrupBuka((g) => ({ ...g, [m.label]: true }));
                    } else {
                      setGrupBuka((g) => ({ ...g, [m.label]: !g[m.label] }));
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${tengah} ${
                    adaAktif
                      ? "font-semibold text-orange-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Ikon size={19} className="shrink-0" />
                  <span className={`flex-1 text-left ${sembunyi}`}>{m.label}</span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${sembunyi} ${
                      buka ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* submenu dengan animasi buka-tutup */}
                <div
                  className={`grid transition-all duration-300 ${sembunyi} ${
                    buka ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-[22px] mt-1 space-y-0.5 border-l border-slate-200 pl-3">
                      {m.anak?.map((a) => {
                        const IkonAnak = a.ikon;
                        return (
                          <Link
                            key={a.href}
                            href={a.href}
                            onClick={() => setMobileBuka(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                              aktif(a.href)
                                ? "bg-orange-50 font-semibold text-orange-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                          >
                            <IkonAnak size={16} /> {a.label}
                          </Link>
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
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOPBAR */}
        <header className="z-30 flex h-16 shrink-0 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* tombol drawer (HP) */}
            <button
              onClick={() => setMobileBuka(true)}
              aria-label="Buka menu"
              className="rounded-lg p-2 text-slate-500 hover:bg-white lg:hidden"
            >
              <IkonMenu size={22} />
            </button>
            {/* tombol ciutkan sidebar (desktop) */}
            <button
              onClick={() => setRingkas((r) => !r)}
              aria-label="Ciutkan atau lebarkan sidebar"
              className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-white lg:block"
            >
              <PanelLeft size={20} />
            </button>

            {/* breadcrumb */}
            <p className="truncate text-sm text-slate-400">
              {induk && (
                <>
                  {induk.label} <span className="mx-1">/</span>
                </>
              )}
              <span className="font-medium text-slate-700">{namaHalaman}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* pencarian (tampilan dulu) */}
            <div className="relative hidden md:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Cari..."
                className="w-56 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-14 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 text-[10px] text-slate-400">
                Ctrl K
              </kbd>
            </div>

            {/* notifikasi */}
            <button
              aria-label="Notifikasi"
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-white"
            >
              <Bell size={20} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-[#f4f5f7]" />
            </button>

            {/* PROFIL + DROPDOWN PENGATURAN */}
            <div className="relative" ref={profilRef}>
              <button
                onClick={() => setProfilBuka((b) => !b)}
                aria-label="Menu profil"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white ring-2 ring-white transition hover:shadow-lg hover:shadow-orange-200"
              >
                A
              </button>

              {profilBuka && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm shadow-xl shadow-slate-200/60">
                  {/* nama + role: satu-satunya tempat tulisan ini muncul */}
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                      A
                    </span>
                    <div className="leading-tight">
                      <p className="font-semibold text-slate-800">Akun Admin</p>
                      <p className="text-xs text-slate-400">Administrator</p>
                    </div>
                  </div>

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
                  <div className="border-t border-slate-100 p-2">
                    <Link
                      href="/login" // ganti sesuai alamat login kamu
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={16} /> Keluar
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ISI HALAMAN */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-2 sm:px-6">
            <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-800">
              {namaHalaman}
            </h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}