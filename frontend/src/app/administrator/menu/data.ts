
import type { RoleUser } from "../_shared/role";

export type MenuData = {
  id: number;
  nama: string;
  href: string;
  ikon: string;
  indukId: number | null;
  role: RoleUser;
  urutan: number;
  aktif: boolean;
};

export type FormMenu = Omit<MenuData, "id">;

export const EVENT_MENU = "menu-berubah";

function kabari() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_MENU));
  }
}

const A = "/administrator";
const O = "/operator";

// Data menu
let dataContoh: MenuData[] = [
  // =========================
  // MENU ADMINISTRATOR
  // =========================

  {
    id: 1,
    nama: "Beranda",
    href: A,
    ikon: "Home",
    indukId: null,
    role: "administrator",
    urutan: 1,
    aktif: true,
  },

  // Akses & Pengguna
  {
    id: 2,
    nama: "Akses & Pengguna",
    href: "",
    ikon: "Users",
    indukId: null,
    role: "administrator",
    urutan: 2,
    aktif: true,
  },
  {
    id: 3,
    nama: "Manajemen User",
    href: `${A}/user_manager`,
    ikon: "UserCog",
    indukId: 2,
    role: "administrator",
    urutan: 1,
    aktif: true,
  },
  {
    id: 5,
    nama: "Manajemen Menu",
    href: `${A}/menu`,
    ikon: "List",
    indukId: 2,
    role: "administrator",
    urutan: 3,
    aktif: true,
  },

  // Data Website
  {
    id: 6,
    nama: "Data Website",
    href: "",
    ikon: "Database",
    indukId: null,
    role: "administrator",
    urutan: 3,
    aktif: true,
  },
  {
    id: 17,
    nama: "Artikel",
    href: `${A}/artikel`,
    ikon: "Newspaper",
    indukId: 6,
    role: "administrator",
    urutan: 1,
    aktif: true,
  },
  {
    id: 19,
    nama: "Foto Slider",
    href: `${A}/slider`,
    ikon: "Images",
    indukId: 6,
    role: "administrator",
    urutan: 2,
    aktif: true,
  },
  {
    id: 20,
    nama: "Lokasi BLC",
    href: `${A}/lokasi`,
    ikon: "MapPin",
    indukId: 6,
    role: "administrator",
    urutan: 3,
    aktif: true,
  },
  {
    id: 22,
    nama: "Testimoni",
    href: `${A}/testimoni`,
    ikon: "Users",
    indukId: 6,
    role: "administrator",
    urutan: 5,
    aktif: true,
  },
  {
    id: 9,
    nama: "Tim BLC",
    href: `${A}/tim_blc`,
    ikon: "UsersRound",
    indukId: 6,
    role: "administrator",
    urutan: 6,
    aktif: true,
  },
  {
    id: 7,
    nama: "Buku Tamu",
    href: `${A}/buku_tamu`,
    ikon: "BookOpen",
    indukId: 6,
    role: "administrator",
    urutan: 8,
    aktif: true,
  },

  // Informasi
  {
    id: 23,
    nama: "Informasi",
    href: "",
    ikon: "Info",
    indukId: null,
    role: "administrator",
    urutan: 4,
    aktif: true,
  },
  {
    id: 8,
    nama: "FAQ",
    href: `${A}/faq`,
    ikon: "HelpCircle",
    indukId: 23,
    role: "administrator",
    urutan: 1,
    aktif: true,
  },

  // =========================
  // MENU OPERATOR
  // =========================

  {
    id: 10,
    nama: "Beranda",
    href: O,
    ikon: "Home",
    indukId: null,
    role: "operator",
    urutan: 1,
    aktif: true,
  },
  {
    id: 11,
    nama: "Konten Statis",
    href: "",
    ikon: "Monitor",
    indukId: null,
    role: "operator",
    urutan: 2,
    aktif: true,
  },
  {
    id: 12,
    nama: "Slider Beranda",
    href: `${O}/slider`,
    ikon: "Images",
    indukId: 11,
    role: "operator",
    urutan: 1,
    aktif: true,
  },
  {
    id: 13,
    nama: "Informasi",
    href: `${O}/informasi`,
    ikon: "Info",
    indukId: 11,
    role: "operator",
    urutan: 2,
    aktif: true,
  },
  {
    id: 14,
    nama: "Artikel",
    href: `${O}/artikel`,
    ikon: "Newspaper",
    indukId: 11,
    role: "operator",
    urutan: 3,
    aktif: true,
  },
  {
    id: 15,
    nama: "Lokasi",
    href: `${O}/lokasi`,
    ikon: "MapPin",
    indukId: 11,
    role: "operator",
    urutan: 4,
    aktif: true,
  },
  {
    id: 16,
    nama: "Kontak",
    href: `${O}/kontak`,
    ikon: "Mail",
    indukId: 11,
    role: "operator",
    urutan: 5,
    aktif: true,
  },
];

// Mengambil semua menu
export async function ambilMenu(): Promise<MenuData[]> {
  return [...dataContoh];
}

// Menambah atau mengubah menu
export async function simpanMenu(
  data: FormMenu,
  id?: number
): Promise<MenuData> {
  const baru: MenuData = {
    id: id ?? Date.now(),
    ...data,
  };

  dataContoh = id
    ? dataContoh.map((menu) => (menu.id === id ? baru : menu))
    : [...dataContoh, baru];

  kabari();

  return baru;
}

// Menghapus menu
export async function hapusMenu(id: number): Promise<void> {
  dataContoh = dataContoh.filter((menu) => menu.id !== id);

  kabari();
}
