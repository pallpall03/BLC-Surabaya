export type StatusArtikel = "aktif" | "nonaktif";

export type Kategori = { id: number; nama: string };

export type Artikel = {
  id: number;
  judul: string;
  kategoriId: number; // kategori utama untuk kompatibilitas data lama
  kategoriIds: number[]; // artikel dapat memiliki beberapa kategori
  ringkasan: string;
  isi: string; // HTML dari rich text editor
  foto: string | null; // data URL foto artikel
  penulis: string;
  status: StatusArtikel;
  unggulan: boolean;
  urutan: number;
  dipublikasi: string | null;
  diubah: string;
};

export type FormArtikel = Omit<Artikel, "id" | "diubah" | "penulis" | "dipublikasi">;

export const BATAS_RINGKASAN = 160;
export const MIN_RINGKASAN = 10;

const KUNCI_DATA = "blc-data-artikel";
const KUNCI_ARTIKEL_LAMA = "blc-artikel-3";
const KUNCI_KATEGORI_LAMA = "blc-kategori-artikel";

const kategoriAwal: Kategori[] = [
  { id: 1, nama: "Berita" },
  { id: 2, nama: "Pelatihan" },
  { id: 3, nama: "Pengumuman" },
  { id: 4, nama: "Tips" },
];

const artikelAwal: Artikel[] = [
  {
    id: 1,
    judul: "Pelatihan Dasar Komputer Dibuka untuk Warga Surabaya",
    kategoriId: 2,
    kategoriIds: [2],
    ringkasan: "BLC Surabaya membuka kelas dasar komputer gratis untuk semua warga.",
    isi: "<p>BLC Surabaya membuka kelas dasar komputer gratis untuk semua warga. Materi meliputi pengenalan perangkat, pengolah kata, dan internet sehat.</p>",
    foto: null,
    penulis: "Super Admin",
    status: "aktif",
    unggulan: true,
    urutan: 1,
    dipublikasi: "2026-11-20T09:15",
    diubah: "2026-11-20T09:15",
  },
  {
    id: 2,
    judul: "Jadwal Layanan BLC Selama Libur Akhir Tahun",
    kategoriId: 3,
    kategoriIds: [3],
    ringkasan: "Perubahan jam layanan BLC menjelang akhir tahun.",
    isi: "<p>Selama libur akhir tahun, jam layanan BLC berubah. Informasi lengkap akan diumumkan di website dan di tiap lokasi.</p>",
    foto: null,
    penulis: "Super Admin",
    status: "nonaktif",
    unggulan: false,
    urutan: 2,
    dipublikasi: null,
    diubah: "2026-11-18T14:30",
  },
];

export function sekarang(): string {
  const d = new Date();
  const dua = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}T${dua(d.getHours())}:${dua(d.getMinutes())}`;
}

export function formatTanggal(s: string): string {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

type DataArtikel = { artikel: Partial<Artikel>[]; kategori: Kategori[] };

function bacaLama<T>(kunci: string, cadangan: T[]): T[] {
  if (typeof window === "undefined") return cadangan;
  try {
    const s = window.localStorage.getItem(kunci);
    return s ? (JSON.parse(s) as T[]) : cadangan;
  } catch {
    return cadangan;
  }
}

function tulis(data: DataArtikel) {
  try {
    window.localStorage.setItem(KUNCI_DATA, JSON.stringify(data));
    window.localStorage.removeItem(KUNCI_ARTIKEL_LAMA);
    window.localStorage.removeItem(KUNCI_KATEGORI_LAMA);
  } catch {
    throw new Error("Data tidak dapat disimpan. Ukuran foto mungkin terlalu besar; coba gunakan foto yang lebih kecil.");
  }
}

function bacaData(): DataArtikel {
  if (typeof window === "undefined") return { artikel: artikelAwal, kategori: kategoriAwal };
  try {
    const tersimpan = window.localStorage.getItem(KUNCI_DATA);
    if (tersimpan) return JSON.parse(tersimpan) as DataArtikel;
  } catch {
    // Pulihkan dari penyimpanan versi lama.
  }
  const data = {
    artikel: bacaLama<Partial<Artikel>>(KUNCI_ARTIKEL_LAMA, artikelAwal),
    kategori: bacaLama(KUNCI_KATEGORI_LAMA, kategoriAwal),
  };
  tulis(data);
  return data;
}

function bacaArtikel(): Artikel[] {
  return bacaData().artikel.map((a, i) => {
    const kategoriIds = a.kategoriIds?.length ? a.kategoriIds : a.kategoriId ? [a.kategoriId] : [];
    return {
      id: a.id ?? Date.now() + i,
      judul: a.judul ?? "",
      kategoriId: a.kategoriId ?? kategoriIds[0] ?? 0,
      kategoriIds,
      ringkasan: a.ringkasan ?? "",
      isi: a.isi ?? "",
      foto: a.foto ?? null,
      penulis: a.penulis ?? "Super Admin",
      status: a.status ?? "nonaktif",
      unggulan: a.unggulan ?? false,
      urutan: a.urutan ?? i + 1,
      dipublikasi: a.dipublikasi !== undefined ? a.dipublikasi : a.status === "aktif" ? a.diubah ?? null : null,
      diubah: a.diubah ?? sekarang(),
    };
  });
}

export async function ambilArtikel(): Promise<Artikel[]> { return bacaArtikel(); }

export async function ambilArtikelLanding(): Promise<Artikel[]> {
  return bacaArtikel().filter((a) => a.status === "aktif").sort((a, b) => Number(b.unggulan) - Number(a.unggulan) || a.urutan - b.urutan);
}

export async function simpanArtikel(form: FormArtikel, id?: number): Promise<Artikel> {
  const data = bacaData();
  const lama = bacaArtikel();
  const sebelumnya = id ? lama.find((a) => a.id === id) : undefined;
  const kategoriIds = form.kategoriIds ?? (form.kategoriId ? [form.kategoriId] : []);
  const dipublikasi = sebelumnya?.dipublikasi ?? (form.status === "aktif" ? sekarang() : null);
  const baru: Artikel = {
    id: id ?? Date.now(),
    penulis: sebelumnya?.penulis ?? "Super Admin",
    diubah: sekarang(),
    ...form,
    kategoriIds,
    kategoriId: kategoriIds[0] ?? 0,
    dipublikasi,
  };
  tulis({ ...data, artikel: id ? lama.map((a) => (a.id === id ? baru : a)) : [baru, ...lama] });
  return baru;
}

export async function hapusArtikel(id: number): Promise<void> {
  const data = bacaData();
  tulis({ ...data, artikel: bacaArtikel().filter((a) => a.id !== id) });
}

export async function ambilKategori(): Promise<Kategori[]> { return bacaData().kategori; }

export async function simpanKategori(nama: string, id?: number): Promise<Kategori> {
  const data = bacaData();
  const baru = { id: id ?? Date.now(), nama };
  tulis({ ...data, kategori: id ? data.kategori.map((k) => (k.id === id ? baru : k)) : [...data.kategori, baru] });
  return baru;
}

export async function hapusKategori(id: number): Promise<void> {
  const data = bacaData();
  const dipakai = bacaArtikel().some((a) => a.kategoriIds.includes(id));
  if (dipakai) throw new Error("Kategori masih dipakai artikel.");
  tulis({ ...data, kategori: data.kategori.filter((k) => k.id !== id) });
}
