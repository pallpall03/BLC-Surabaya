import type { RoleUser } from "./password";

export type MenuData = {
  id: number;
  nama: string;
  href: string; // kosong = menu induk (grup) tanpa halaman
  ikon: string; // nama ikon, lihat lib/ikon.ts
  indukId: number | null; // null = menu utama
  role: RoleUser;
  urutan: number;
  aktif: boolean;
};

export type FormMenu = Omit<MenuData, "id">;

const A = "/dashboard/administrator";
const O = "/dashboard/operator";

const dataContoh: MenuData[] = [
  // administrator
  { id: 1, nama: "Beranda", href: A, ikon: "Home", indukId: null, role: "administrator", urutan: 1, aktif: true },
  { id: 2, nama: "Data", href: "", ikon: "Database", indukId: null, role: "administrator", urutan: 2, aktif: true },
  { id: 3, nama: "Manajemen User", href: `${A}/user-manager`, ikon: "UserCog", indukId: 2, role: "administrator", urutan: 1, aktif: true },
  { id: 4, nama: "Manajemen Menu", href: `${A}/menu`, ikon: "List", indukId: 2, role: "administrator", urutan: 2, aktif: true },
  { id: 5, nama: "Ubah Password", href: `${A}/ubah-password`, ikon: "KeyRound", indukId: 2, role: "administrator", urutan: 3, aktif: true },
  { id: 7, nama: "Buku Tamu", href: `${A}/buku-tamu`, ikon: "BookOpen", indukId: 2, role: "administrator", urutan: 5, aktif: true },
  { id: 8, nama: "FAQ", href: `${A}/faq`, ikon: "HelpCircle", indukId: 2, role: "administrator", urutan: 6, aktif: true },
  { id: 9, nama: "Tim BLC", href: `${A}/tim-blc`, ikon: "UsersRound", indukId: 2, role: "administrator", urutan: 7, aktif: true },
  // operator
  { id: 10, nama: "Beranda", href: O, ikon: "Home", indukId: null, role: "operator", urutan: 1, aktif: true },
  { id: 11, nama: "Konten Statis", href: "", ikon: "Monitor", indukId: null, role: "operator", urutan: 2, aktif: true },
  { id: 12, nama: "Slider Beranda", href: `${O}/slider`, ikon: "Images", indukId: 11, role: "operator", urutan: 1, aktif: true },
  { id: 13, nama: "Informasi", href: `${O}/informasi`, ikon: "Info", indukId: 11, role: "operator", urutan: 2, aktif: true },
  { id: 14, nama: "Artikel", href: `${O}/artikel`, ikon: "Newspaper", indukId: 11, role: "operator", urutan: 3, aktif: true },
  { id: 15, nama: "Lokasi", href: `${O}/lokasi`, ikon: "MapPin", indukId: 11, role: "operator", urutan: 4, aktif: true },
  { id: 16, nama: "Kontak", href: `${O}/kontak`, ikon: "Mail", indukId: 11, role: "operator", urutan: 5, aktif: true },
  { id: 17, nama: "Setting", href: "", ikon: "Settings", indukId: null, role: "administrator", urutan: 3, aktif: true },
  { id: 18, nama: "Hak Akses", href: `${A}/hak-akses`, ikon: "ShieldCheck", indukId: 17, role: "administrator", urutan: 1, aktif: true },
  { id: 19, nama: "Kategori Menu", href: `${A}/kategori-menu`, ikon: "Tags", indukId: 17, role: "administrator", urutan: 2, aktif: true },
  { id: 20, nama: "Level Pengguna", href: `${A}/level-pengguna`, ikon: "Layers", indukId: 17, role: "administrator", urutan: 3, aktif: true },
];

// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend.
export async function ambilMenu(): Promise<MenuData[]> {
  return dataContoh;
}

// SEMENTARA: bikin data palsu di browser. NANTI DIGANTI fetch POST (tambah) / PUT (ubah).
export async function simpanMenu(data: FormMenu, id?: number): Promise<MenuData> {
  return { id: id ?? Date.now(), ...data };
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch DELETE ke backend.
export async function hapusMenu(id: number): Promise<void> {
  void id;
}