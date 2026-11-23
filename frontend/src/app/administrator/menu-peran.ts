import {
  Home,
  Database,
  Users,
  UsersRound,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  List,
  UserCog,
} from "lucide-react";
import type { KonfigPeran, MenuItem } from "@/components/panel/tipe";
import type { MenuData } from "./menu/data";
import { ambilIkon } from "./menu/ikon";
import type { RoleUser } from "./_shared/role";

// PENTING: harus sama dengan alamat halaman di browser-mu.
const ADMIN = "/administrator";

// Menu bawaan: tampil dulu saat data menu belum termuat, dan jadi cadangan
// kalau data menu kosong, supaya admin tidak terkunci dari panelnya sendiri.
export const konfigAdministrator: KonfigPeran = {
  base: ADMIN,
  namaAkun: "Akun Admin",
  namaRole: "Administrator",
  menu: [
    { label: "Beranda", ikon: Home, href: ADMIN },
    {
      label: "Akses & Pengguna",
      ikon: Users,
      anak: [
        { label: "Manajemen User", href: `${ADMIN}/user_manager`, ikon: UserCog },
        { label: "Role & Hak Akses", href: `${ADMIN}/role_hak_akses`, ikon: ShieldCheck },
        { label: "Manajemen Menu", href: `${ADMIN}/menu`, ikon: List },
      ],
    },
    {
      label: "Data Website",
      ikon: Database,
      anak: [
        { label: "Buku Tamu", href: `${ADMIN}/buku_tamu`, ikon: BookOpen },
        { label: "FAQ", href: `${ADMIN}/faq`, ikon: HelpCircle },
        { label: "Tim BLC", href: `${ADMIN}/tim_blc`, ikon: UsersRound },
      ],
    },
  ],
  pengaturan: [], // dropdown profil admin: hanya nama, role, dan Keluar
};

// Mengubah data dari Manajemen Menu menjadi menu sidebar:
// hanya yang aktif, urut sesuai kolom urutan, grup tanpa submenu aktif disembunyikan.
export function susunMenu(daftar: MenuData[], role: RoleUser): MenuItem[] {
  const aktif = daftar.filter((m) => m.role === role && m.aktif);
  const urut = (a: MenuData, b: MenuData) => a.urutan - b.urutan;
  const hasil: MenuItem[] = [];

  aktif
    .filter((m) => m.indukId === null)
    .sort(urut)
    .forEach((induk) => {
      const ikon = ambilIkon(induk.ikon);

      // menu tunggal (punya alamat)
      if (induk.href) {
        hasil.push({ label: induk.nama, ikon, href: induk.href });
        return;
      }

      // menu grup: ambil submenu aktif yang punya alamat
      const anak = aktif
        .filter((x) => x.indukId === induk.id && x.href)
        .sort(urut)
        .map((x) => ({ label: x.nama, href: x.href, ikon: ambilIkon(x.ikon) }));

      if (anak.length > 0) hasil.push({ label: induk.nama, ikon, anak });
    });

  return hasil;
}