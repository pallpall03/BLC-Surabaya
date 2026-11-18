import {
  Home,
  Database,
  Monitor,
  UsersRound,
  HelpCircle,
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
  pengaturan: MenuAnak[]; // isi dropdown profil
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
          { label: "Ubah Password", href: `${ADMIN}/ubah-password`, ikon: KeyRound },
          { label: "Pelatihan", href: `${ADMIN}/pelatihan`, ikon: GraduationCap },
          { label: "Buku Tamu", href: `${ADMIN}/buku-tamu`, ikon: BookOpen },
          { label: "FAQ", href: `${ADMIN}/faq`, ikon: HelpCircle },
          { label: "Tim BLC", href: `${ADMIN}/tim-blc`, ikon: UsersRound },
        ],
      },
    ],
    pengaturan: [
      { label: "Hak Akses", href: `${ADMIN}/hak-akses`, ikon: ShieldCheck },
      { label: "Kategori Menu", href: `${ADMIN}/kategori-menu`, ikon: Tags },
      { label: "Level Pengguna", href: `${ADMIN}/level-pengguna`, ikon: Layers },
    ],
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