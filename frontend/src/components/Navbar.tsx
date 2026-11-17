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
    <header className="bg-white/90 backdrop-blur sticky top-0 z-50 shadow-sm">
      <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-xl flex items-center justify-center">
            blc
          </span>
          <span className="text-orange-500 font-bold leading-tight text-sm">
            Broadband<br />Learning<br />Center
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase text-gray-600">
          {menu.map((item) =>
            item.anak ? (
              <li key={item.label} className="relative group">
                <span className="cursor-pointer hover:text-orange-500">
                  {item.label} ▾
                </span>
                {/* ✨ ANIMASI 3: dropdown */}
                <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-lg py-2 min-w-48 normal-case font-normal">
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