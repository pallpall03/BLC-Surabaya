import {
  Users,
  HandHeart,
  BadgeCheck,
  GraduationCap,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

export type ItemInformasi = {
  id: string;
  judul: string;
  ringkas: string;
  ikon: LucideIcon;
};

export type MenuNavbar = {
  label: string;
  id: string; // id section di halaman home
  anak?: boolean; // true = punya dropdown
};

export const daftarInformasi: ItemInformasi[] = [
  { id: "tentang-kami", judul: "Tentang Kami", ringkas: "Mengenal Broadband Learning Center Surabaya dan misinya.", ikon: Users },
  { id: "janji-layanan", judul: "Janji Layanan", ringkas: "Komitmen kami dalam melayani warga.", ikon: HandHeart },
  { id: "standar-layanan", judul: "Standar Layanan", ringkas: "Ketentuan dan standar layanan yang berlaku.", ikon: BadgeCheck },
  { id: "belajar", judul: "Belajar", ringkas: "Kelas dan pelatihan yang tersedia di BLC.", ikon: GraduationCap },
  { id: "daftar", judul: "Daftar", ringkas: "Cara mendaftar sebagai peserta pelatihan.", ikon: ClipboardList },
];

export const menuNavbar: MenuNavbar[] = [
  { label: "Beranda", id: "beranda" },
  { label: "Informasi", id: "informasi", anak: true },
  { label: "FAQ", id: "faq" },
  { label: "Lokasi", id: "lokasi" },
  { label: "Buku Tamu", id: "buku-tamu" },
  { label: "Kontak", id: "kontak" },
];

export const idSection = ["beranda", "informasi", "faq", "lokasi", "buku-tamu", "kontak"];

export const statistik = [
  { angka: "12+", label: "Lokasi BLC" },
  { angka: "50+", label: "Kelas Pelatihan" },
  { angka: "1000+", label: "Peserta" },
];

export const kontak = {
  alamat: "Surabaya, Jawa Timur",
  telepon: "(031) 0000 0000", // ganti nomor asli
  email: "blc@surabaya.go.id", // ganti email asli
  jam: "Senin–Jumat, 08.00–16.00 WIB",
};