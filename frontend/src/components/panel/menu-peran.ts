import {
  Home,
  Database,
  UsersRound,
  List,
  KeyRound,
  Newspaper,
  Images,
  MapPin,
  HelpCircle,
  BookOpen,
  Tags,
  Layers,
  type LucideIcon,
} from "lucide-react";

export type MenuAnak = { label: string; href: string; ikon: LucideIcon };
export type MenuItem = {
  label: string;
  ikon: LucideIcon;
  href?: string; // menu tunggal
  anak?: MenuAnak[]; // menu bergrup
};

export type Peran = "administrator" | "operator";

// Konfigurasi menu per role
export type KonfigPeran = {
  base: string;
  namaAkun: string;
  namaRole: string;
  menu: MenuItem[];
  pengaturan: MenuAnak[]; // isi dropdown profil (boleh kosong)
};

const ADMIN = "/dashboard/administrator";
const OPERATOR = "/dashboard/operator";

export const konfigPeran: Record<Peran, KonfigPeran> = {
  administrator: {
    base: ADMIN,
    namaAkun: "Akun Admin",
    namaRole: "Administrator",
    menu: [
      { label: "Beranda", ikon: Home, href: ADMIN },
      {
        label: "Data",
        ikon: Database,
        anak: [
          { label: "Manajemen User", href: `${ADMIN}/user-manager`, ikon: UsersRound },
          { label: "Manajemen Menu", href: `${ADMIN}/menu`, ikon: List },
          { label: "Ubah Password", href: `${ADMIN}/ubah-password`, ikon: KeyRound },
        ],
      },
      {
        label: "Konten",
        ikon: Layers,
        anak: [
          { label: "Artikel", href: `${ADMIN}/artikel`, ikon: Newspaper },
          { label: "Foto Slider", href: `${ADMIN}/foto-slider`, ikon: Images },
          { label: "Lokasi BLC", href: `${ADMIN}/lokasi-blc`, ikon: MapPin },
          { label: "Kategori Artikel", href: `${ADMIN}/kategori-artikel`, ikon: Tags },
          { label: "Testimoni", href: `${ADMIN}/testimoni`, ikon: UsersRound },
          { label: "Tim BLC", href: `${ADMIN}/tim-blc`, ikon: UsersRound },
          { label: "FAQ", href: `${ADMIN}/faq`, ikon: HelpCircle },
          { label: "Buku Tamu", href: `${ADMIN}/buku-tamu`, ikon: BookOpen },
        ],
      },
    ],
    pengaturan: [],
  },

  operator: {
    base: OPERATOR,
    namaAkun: "Akun Operator",
    namaRole: "Operator",
    menu: [
      { label: "Beranda", ikon: Home, href: OPERATOR },
      {
        label: "Konten",
        ikon: Database,
        anak: [
          { label: "Slider Beranda", href: `${OPERATOR}/slider`, ikon: Images },
          { label: "Artikel", href: `${OPERATOR}/artikel`, ikon: Newspaper },
          { label: "Lokasi", href: `${OPERATOR}/lokasi`, ikon: MapPin },
          { label: "Testimoni", href: `${OPERATOR}/testimoni`, ikon: UsersRound },
          { label: "FAQ", href: `${OPERATOR}/faq`, ikon: HelpCircle },
        ],
      },
    ],
    pengaturan: [
      { label: "Ubah Password", href: `${OPERATOR}/ubah-password`, ikon: KeyRound },
    ],
  },
};