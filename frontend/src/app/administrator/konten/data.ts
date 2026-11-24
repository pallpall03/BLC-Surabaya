export type StatItem = { angka: string; label: string };

export type Beranda = {
  lencana: string;
  judul: string; // bagian awal judul
  sorot: string; // bagian judul yang berwarna oranye
  deskripsi: string;
  tombolUtama: string;
  tombolKedua: string;
  statistik: StatItem[];
};

export type Informasi = {
  id: number;
  judul: string;
  ringkas: string;
  ikon: string; // nama ikon, lihat ikon.ts
  urutan: number;
  aktif: boolean;
};

export type FormInformasi = Omit<Informasi, "id">;

export type Kontak = {
  alamat: string;
  telepon: string;
  email: string;
  jam: string;
};

export const berandaAwal: Beranda = {
  lencana: "Broadband Learning Center",
  judul: "Belajar teknologi bersama",
  sorot: "BLC Surabaya",
  deskripsi:
    "Pusat pembelajaran digital untuk warga Surabaya. Temukan lokasi terdekat dan ikuti pelatihan yang tersedia.",
  tombolUtama: "Lihat Informasi",
  tombolKedua: "Cari Lokasi",
  statistik: [
    { angka: "12+", label: "Lokasi BLC" },
    { angka: "50+", label: "Kelas Pelatihan" },
    { angka: "1000+", label: "Peserta" },
  ],
};

export const kontakAwal: Kontak = {
  alamat: "Surabaya, Jawa Timur",
  telepon: "(031) 0000 0000", // ganti nomor asli
  email: "blc@surabaya.go.id", // ganti email asli
  jam: "Senin–Jumat, 08.00–16.00 WIB",
};

const informasiAwal: Informasi[] = [
  { id: 1, judul: "Tentang Kami", ringkas: "Mengenal Broadband Learning Center Surabaya dan misinya.", ikon: "Users", urutan: 1, aktif: true },
  { id: 2, judul: "Janji Layanan", ringkas: "Komitmen kami dalam melayani warga.", ikon: "HandHeart", urutan: 2, aktif: true },
  { id: 3, judul: "Standar Layanan", ringkas: "Ketentuan dan standar layanan yang berlaku.", ikon: "BadgeCheck", urutan: 3, aktif: true },
  { id: 4, judul: "Belajar", ringkas: "Kelas dan pelatihan yang tersedia di BLC.", ikon: "GraduationCap", urutan: 4, aktif: true },
  { id: 5, judul: "Daftar", ringkas: "Cara mendaftar sebagai peserta pelatihan.", ikon: "ClipboardList", urutan: 5, aktif: true },
];

const KUNCI_BERANDA = "blc-konten-beranda";
const KUNCI_INFORMASI = "blc-konten-informasi";
const KUNCI_KONTAK = "blc-konten-kontak";

// SEMENTARA: disimpan di localStorage. NANTI DIGANTI fetch ke backend.
function baca<T>(kunci: string, cadangan: T): T {
  if (typeof window === "undefined") return cadangan;
  try {
    const s = window.localStorage.getItem(kunci);
    return s ? (JSON.parse(s) as T) : cadangan;
  } catch {
    return cadangan;
  }
}

function tulis<T>(kunci: string, data: T) {
  try {
    window.localStorage.setItem(kunci, JSON.stringify(data));
  } catch {
    // abaikan kalau penyimpanan penuh atau diblokir
  }
}

// ---------- BERANDA ----------

export async function ambilBeranda(): Promise<Beranda> {
  return baca(KUNCI_BERANDA, berandaAwal);
}

export async function simpanBeranda(data: Beranda): Promise<void> {
  tulis(KUNCI_BERANDA, data);
}

// ---------- INFORMASI ----------

export async function ambilInformasi(): Promise<Informasi[]> {
  return baca(KUNCI_INFORMASI, informasiAwal);
}

// tambah (tanpa id) atau ubah (dengan id)
export async function simpanInformasi(form: FormInformasi, id?: number): Promise<Informasi> {
  const lama = baca(KUNCI_INFORMASI, informasiAwal);
  const baru: Informasi = { id: id ?? Date.now(), ...form };
  tulis(KUNCI_INFORMASI, id ? lama.map((i) => (i.id === id ? baru : i)) : [...lama, baru]);
  return baru;
}

export async function hapusInformasi(id: number): Promise<void> {
  tulis(KUNCI_INFORMASI, baca(KUNCI_INFORMASI, informasiAwal).filter((i) => i.id !== id));
}

// ---------- KONTAK ----------

export async function ambilKontak(): Promise<Kontak> {
  return baca(KUNCI_KONTAK, kontakAwal);
}

export async function simpanKontak(data: Kontak): Promise<void> {
  tulis(KUNCI_KONTAK, data);
}