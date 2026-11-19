import {
  Home,
  Database,
  Monitor,
  UsersRound,
  HelpCircle,
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
  Settings,
  GraduationCap,
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
          { label: "Manajemen User", href: `${ADMIN}/user-manager`, ikon: UserCog },
          { label: "Manajemen Menu", href: `${ADMIN}/menu`, ikon: List },
          { label: "Menu Akses", href: `${ADMIN}/menu-akses`, ikon: ShieldCheck },
          { label: "Konten Statis", href: `${ADMIN}/konten`, ikon: Layers },
          { label: "Ubah Password", href: `${ADMIN}/ubah-password`, ikon: KeyRound },
          { label: "Buku Tamu", href: `${ADMIN}/buku-tamu`, ikon: BookOpen },
          { label: "FAQ", href: `${ADMIN}/faq`, ikon: HelpCircle },
          { label: "Tim BLC", href: `${ADMIN}/tim-blc`, ikon: UsersRound },
          { label: "Kategori Artikel", href: `${ADMIN}/kategori-artikel`, ikon: Tags },
          { label: "Artikel", href: `${ADMIN}/artikel`, ikon: Newspaper },
          { label: "Foto Slider", href: `${ADMIN}/foto-slider`, ikon: Images },
          { label: "Lokasi BLC", href: `${ADMIN}/lokasi-blc`, ikon: MapPin },
          { label: "Testimoni", href: `${ADMIN}/testimoni`, ikon: UsersRound },
          { label: "Modul", href: `${ADMIN}/modul`, ikon: List },
          { label: "Ujian", href: `${ADMIN}/ujian`, ikon: GraduationCap },
          { label: "Piagam", href: `${ADMIN}/piagam`, ikon: Settings },
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
        label: "Konten Statis",
        ikon: Monitor,
        anak: [
          { label: "Slider Beranda", href: `${OPERATOR}/slider`, ikon: Images },
          { label: "Informasi", href: `${OPERATOR}/informasi`, ikon: Info },
          { label: "Artikel", href: `${OPERATOR}/artikel`, ikon: Newspaper },
          { label: "Lokasi", href: `${OPERATOR}/lokasi`, ikon: MapPin },
          { label: "Kontak", href: `${OPERATOR}/kontak`, ikon: Mail },
        ],
      },
    ],
    pengaturan: [
      { label: "Ubah Password", href: `${OPERATOR}/ubah-password`, ikon: KeyRound },
    ],
  },
};