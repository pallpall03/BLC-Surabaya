import type { RoleUser } from "../_shared/role";

export type MenuData = {
  id: number;
  nama: string;
  href: string; // kosong = menu induk (grup) tanpa halaman
  ikon: string; // nama ikon, lihat ikon.ts
  indukId: number | null; // null = menu utama
  role: RoleUser;
  urutan: number;
  aktif: boolean;
};

export type FormMenu = Omit<MenuData, "id">;

// dikirim setiap menu berubah, supaya sidebar memuat ulang
export const EVENT_MENU = "menu-berubah";

function kabari() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_MENU));
}

const A = "/administrator";
const O = "/operator";

let dataContoh: MenuData[] = [
  // administrator
  { id: 1, nama: "Beranda", href: A, ikon: "Home", indukId: null, role: "administrator", urutan: 1, aktif: true },
  { id: 2, nama: "Akses & Pengguna", href: "", ikon: "Users", indukId: null, role: "administrator", urutan: 2, aktif: true },
  { id: 3, nama: "Manajemen User", href: `${A}/user_manager`, ikon: "UserCog", indukId: 2, role: "administrator", urutan: 1, aktif: true },
  { id: 4, nama: "Role & Hak Akses", href: `${A}/role_hak_akses`, ikon: "ShieldCheck", indukId: 2, role: "administrator", urutan: 2, aktif: true },
  { id: 5, nama: "Manajemen Menu", href: `${A}/menu`, ikon: "List", indukId: 2, role: "administrator", urutan: 3, aktif: true },
  { id: 6, nama: "Data Website", href: "", ikon: "Database", indukId: null, role: "administrator", urutan: 3, aktif: true },
  { id: 7, nama: "Buku Tamu", href: `${A}/buku_tamu`, ikon: "BookOpen", indukId: 6, role: "administrator", urutan: 1, aktif: true },
  { id: 8, nama: "FAQ", href: `${A}/faq`, ikon: "HelpCircle", indukId: 6, role: "administrator", urutan: 2, aktif: true },
  { id: 9, nama: "Tim BLC", href: `${A}/tim_blc`, ikon: "UsersRound", indukId: 6, role: "administrator", urutan: 3, aktif: true },
  // operator
  { id: 10, nama: "Beranda", href: O, ikon: "Home", indukId: null, role: "operator", urutan: 1, aktif: true },
  { id: 11, nama: "Konten Statis", href: "", ikon: "Monitor", indukId: null, role: "operator", urutan: 2, aktif: true },
  { id: 12, nama: "Slider Beranda", href: `${O}/slider`, ikon: "Images", indukId: 11, role: "operator", urutan: 1, aktif: true },
  { id: 13, nama: "Informasi", href: `${O}/informasi`, ikon: "Info", indukId: 11, role: "operator", urutan: 2, aktif: true },
  { id: 14, nama: "Artikel", href: `${O}/artikel`, ikon: "Newspaper", indukId: 11, role: "operator", urutan: 3, aktif: true },
  { id: 15, nama: "Lokasi", href: `${O}/lokasi`, ikon: "MapPin", indukId: 11, role: "operator", urutan: 4, aktif: true },
  { id: 16, nama: "Kontak", href: `${O}/kontak`, ikon: "Mail", indukId: 11, role: "operator", urutan: 5, aktif: true },
];

// SEMENTARA: data contoh di memori browser. NANTI DIGANTI fetch GET ke backend.
export async function ambilMenu(): Promise<MenuData[]> {
  return [...dataContoh];
}

// SEMENTARA: mengubah data contoh di memori. NANTI DIGANTI fetch POST (tambah) / PUT (ubah).
export async function simpanMenu(data: FormMenu, id?: number): Promise<MenuData> {
  const baru: MenuData = { id: id ?? Date.now(), ...data };
  dataContoh = id
    ? dataContoh.map((m) => (m.id === id ? baru : m))
    : [...dataContoh, baru];
  kabari();
  return baru;
}

// SEMENTARA: mengubah data contoh di memori. NANTI DIGANTI fetch DELETE ke backend.
export async function hapusMenu(id: number): Promise<void> {
  dataContoh = dataContoh.filter((m) => m.id !== id);
  kabari();
}