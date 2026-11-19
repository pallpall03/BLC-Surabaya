"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  label: string;
  href?: string;
  anak?: { href: string; label: string }[];
};

const menu: MenuItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Informasi",
    anak: [
      { href: "/tentang", label: "Tentang BLC" },
      { href: "/pelatihan", label: "Pelatihan" },
    ],
  },
  { label: "Artikel", href: "/artikel" },
  { label: "Lokasi", href: "/lokasi" },
  { label: "Buku Tamu", href: "/buku-tamu" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/40 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
            blc
          </span>
          <span className="text-sm font-bold leading-tight text-orange-500">
            Broadband
            <br />
            Learning
            <br />
            Center
          </span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-semibold uppercase text-gray-600 md:flex">
          {menu.map((item) =>
            item.anak ? (
              <li key={item.label} className="group relative">
                <span className="cursor-pointer hover:text-orange-500">
                  {item.label} ▾
                </span>
                <ul className="absolute left-0 top-full hidden min-w-48 rounded-lg bg-white py-2 font-normal normal-case shadow-lg group-hover:block">
                  {item.anak.map((a) => (
                    <li key={a.href}>
                      <Link
                        href={a.href}
                        className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-500"
                      >
                        {a.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  href={item.href ?? "/"}
                  className={
                    pathname === item.href
                      ? "text-orange-500"
                      : "hover:text-orange-500"
                  }
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
}