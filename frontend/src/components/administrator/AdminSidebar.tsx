"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Info,
  Newspaper,
  MapPin,
  BookOpen,
  Mail,
  Users,
  GraduationCap,
} from "lucide-react";

const grup = [
  {
    judul: "Utama",
    menu: [
      { href: "/administrator", label: "Ringkasan", ikon: LayoutDashboard },
    ],
  },
  {
    judul: "Konten Website",
    menu: [
      { href: "/administrator/slider", label: "Slider Beranda", ikon: Images },
      { href: "/administrator/informasi", label: "Informasi", ikon: Info },
      { href: "/administrator/artikel", label: "Artikel", ikon: Newspaper },
      { href: "/administrator/lokasi", label: "Lokasi", ikon: MapPin },
      { href: "/administrator/buku-tamu", label: "Buku Tamu", ikon: BookOpen },
      { href: "/administrator/kontak", label: "Kontak", ikon: Mail },
    ],
  },
  {
    judul: "Sistem",
    menu: [
      { href: "/administrator/pengguna", label: "Pengguna", ikon: Users },
      { href: "/administrator/pelatihan", label: "Pelatihan", ikon: GraduationCap },
    ],
  },
];

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-300 p-4 overflow-y-auto transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/administrator"
          className="flex items-center gap-3 mb-8 px-2"
        >
          <span className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center">
            blc
          </span>
          <span className="text-white font-semibold">Admin Panel</span>
        </Link>

        {grup.map((g) => (
          <div key={g.judul} className="mb-6">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 px-3">
              {g.judul}
            </p>
            <ul className="space-y-1">
              {g.menu.map((item) => {
                const aktif =
                  item.href === "/administrator"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                const Ikon = item.ikon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                        aktif
                          ? "bg-brand-500 text-white"
                          : "hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Ikon size={18} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>
    </>
  );
}