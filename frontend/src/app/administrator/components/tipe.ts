import type { LucideIcon } from "lucide-react";

export type MenuAnak = { label: string; href: string; ikon: LucideIcon };

export type MenuItem = {
  label: string;
  ikon: LucideIcon;
  href?: string; // menu tunggal
  anak?: MenuAnak[]; // menu bergrup
};

export type KonfigPeran = {
  base: string; // alamat awal role, contoh "/administrator"
  namaAkun: string;
  namaRole: string;
  menu: MenuItem[];
  pengaturan: MenuAnak[]; // isi dropdown profil (boleh kosong)
};