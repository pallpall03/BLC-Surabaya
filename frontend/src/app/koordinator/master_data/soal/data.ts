export const MATERI_SOAL = [
  { nama: "FUN PROGRAMMING", pertemuan: [1, 2, 3] },
  { nama: "DESAIN GRAFIS", pertemuan: [1, 2, 3, 4] },
  { nama: "APLIKASI PERKANTORAN", pertemuan: [1, 2, 3, 4, 5] },
  { nama: "PEMROGRAMAN DASAR", pertemuan: [1, 2, 3] },
] as const;

export const PILIHAN_JAWABAN = ["A", "B", "C", "D", "E"] as const;

export type KunciJawaban = (typeof PILIHAN_JAWABAN)[number];

export type JawabanSoal = {
  teks: string;
  gambar: string | null;
};

export type SoalPelatihan = {
  id: string;
  materi: string;
  pertemuan: number;
  teks: string;
  gambarSoal: string | null;
  jawaban: JawabanSoal[];
  kunciJawaban: KunciJawaban;
  bobotNilai: number;
  dibuatPada: string;
  diperbaruiPada: string;
};

export type SoalFormValue = {
  materi: string;
  pertemuan: string;
  teks: string;
  gambarSoal: string | null;
  jawaban: JawabanSoal[];
  kunciJawaban: string;
  bobotNilai: string;
};

export const SOAL_STORAGE_KEY = "blc-koordinator-soal-pelatihan";

function jawaban(...teks: string[]): JawabanSoal[] {
  return teks.map((item) => ({ teks: item, gambar: null }));
}

export const DATA_AWAL_SOAL: SoalPelatihan[] = [
  {
    id: "soal-1",
    materi: "FUN PROGRAMMING",
    pertemuan: 3,
    teks: "Apa yang akan terjadi jika kita coding ini digunakan?",
    gambarSoal: null,
    jawaban: jawaban(
      "Karakter akan melambai",
      "Karakter akan pergi",
      "Karakter akan menampilkan",
      "Karakter akan berhenti",
      "Karakter akan terbang",
    ),
    kunciJawaban: "D",
    bobotNilai: 1,
    dibuatPada: "2024-05-28T10:57:11",
    diperbaruiPada: "2024-05-28T13:54:31",
  },
  {
    id: "soal-2",
    materi: "FUN PROGRAMMING",
    pertemuan: 3,
    teks: "Apa nama gambar blok perintah dibawah ini?",
    gambarSoal: null,
    jawaban: jawaban("Blok gerak", "Blok tampilan", "Blok suara", "Blok kendali", "Blok penjumlahan"),
    kunciJawaban: "B",
    bobotNilai: 1,
    dibuatPada: "2024-05-28T11:00:09",
    diperbaruiPada: "2024-05-28T11:00:09",
  },
  {
    id: "soal-3",
    materi: "FUN PROGRAMMING",
    pertemuan: 2,
    teks: "Blok perintah dibawah ini digunakan",
    gambarSoal: null,
    jawaban: jawaban("Mengubah posisi", "Mengubah warna", "Memutar karakter", "Menunggu", "Mengulang perintah"),
    kunciJawaban: "A",
    bobotNilai: 1,
    dibuatPada: "2024-05-30T07:57:00",
    diperbaruiPada: "2024-05-30T07:57:00",
  },
  {
    id: "soal-4",
    materi: "FUN PROGRAMMING",
    pertemuan: 1,
    teks: "Gambar blok perintah dibawah ini termasuk pada menu blok",
    gambarSoal: null,
    jawaban: jawaban("Gerak", "Tampilan", "Suara", "Kendali", "Penjumlahan"),
    kunciJawaban: "C",
    bobotNilai: 1,
    dibuatPada: "2024-05-30T07:59:19",
    diperbaruiPada: "2024-05-30T07:59:19",
  },
  {
    id: "soal-5",
    materi: "FUN PROGRAMMING",
    pertemuan: 1,
    teks: "Gambar blok perintah dibawah ini termasuk pada menu blok",
    gambarSoal: null,
    jawaban: jawaban("Gerak", "Tampilan", "Suara", "Kendali", "Penjumlahan"),
    kunciJawaban: "D",
    bobotNilai: 1,
    dibuatPada: "2024-05-30T08:02:16",
    diperbaruiPada: "2024-05-30T08:02:16",
  },
  {
    id: "soal-6",
    materi: "FUN PROGRAMMING",
    pertemuan: 2,
    teks: "Gambar blok perintah dibawah ini termasuk pada menu blok",
    gambarSoal: null,
    jawaban: jawaban("Gerak", "Tampilan", "Suara", "Kendali", "Penjumlahan"),
    kunciJawaban: "B",
    bobotNilai: 1,
    dibuatPada: "2024-05-30T08:06:05",
    diperbaruiPada: "2024-05-30T08:06:05",
  },
  {
    id: "soal-7",
    materi: "FUN PROGRAMMING",
    pertemuan: 2,
    teks: "Fungsi dari coding dibawah ini adalah",
    gambarSoal: null,
    jawaban: jawaban("Karakter bergerak", "Karakter berbicara", "Karakter berpikir", "Karakter berhenti", "Karakter menghilang"),
    kunciJawaban: "E",
    bobotNilai: 1,
    dibuatPada: "2024-05-30T08:07:58",
    diperbaruiPada: "2024-05-30T08:07:58",
  },
  {
    id: "soal-8",
    materi: "FUN PROGRAMMING",
    pertemuan: 3,
    teks: "Apa nama blok perintah dibawah ini?",
    gambarSoal: null,
    jawaban: jawaban("Blok gerak", "Blok tampilan", "Blok suara", "Blok kendali", "Blok penjumlahan"),
    kunciJawaban: "A",
    bobotNilai: 1,
    dibuatPada: "2024-05-30T08:08:51",
    diperbaruiPada: "2024-05-30T08:08:51",
  },
  {
    id: "soal-9",
    materi: "FUN PROGRAMMING",
    pertemuan: 1,
    teks: "Kegunaan dari script dibawah ini adalah",
    gambarSoal: null,
    jawaban: jawaban("Menampilkan teks", "Memutar musik", "Menggerakkan karakter", "Mengubah latar", "Menghentikan program"),
    kunciJawaban: "C",
    bobotNilai: 1,
    dibuatPada: "2024-05-30T08:10:12",
    diperbaruiPada: "2024-05-30T08:10:12",
  },
];

export function buatFormKosong(): SoalFormValue {
  return {
    materi: "",
    pertemuan: "",
    teks: "",
    gambarSoal: null,
    jawaban: PILIHAN_JAWABAN.map(() => ({ teks: "", gambar: null })),
    kunciJawaban: "",
    bobotNilai: "1",
  };
}

export function formatTanggal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date).replace(".", ":");
}

function validSoal(item: unknown): item is SoalPelatihan {
  if (typeof item !== "object" || item === null) return false;
  const value = item as Record<string, unknown>;
  return typeof value.id === "string"
    && typeof value.materi === "string"
    && Number.isInteger(value.pertemuan)
    && typeof value.teks === "string"
    && (value.gambarSoal === null || typeof value.gambarSoal === "string")
    && Array.isArray(value.jawaban)
    && value.jawaban.length === PILIHAN_JAWABAN.length
    && value.jawaban.every((entry) =>
      typeof entry === "object"
      && entry !== null
      && typeof entry.teks === "string"
      && (entry.gambar === null || typeof entry.gambar === "string"))
    && PILIHAN_JAWABAN.includes(value.kunciJawaban as KunciJawaban)
    && Number.isInteger(value.bobotNilai)
    && typeof value.dibuatPada === "string"
    && typeof value.diperbaruiPada === "string";
}

export function bacaSoal(): SoalPelatihan[] {
  if (typeof window === "undefined") return DATA_AWAL_SOAL;

  try {
    const tersimpan = sessionStorage.getItem(SOAL_STORAGE_KEY);
    if (!tersimpan) {
      sessionStorage.setItem(SOAL_STORAGE_KEY, JSON.stringify(DATA_AWAL_SOAL));
      return DATA_AWAL_SOAL;
    }
    const parsed: unknown = JSON.parse(tersimpan);
    if (Array.isArray(parsed)) {
      return parsed.filter(validSoal).map((item) => (
        item.gambarSoal === "/images/soal/contoh-blok.svg"
          ? { ...item, gambarSoal: null }
          : item
      ));
    }
    return DATA_AWAL_SOAL;
  } catch {
    return DATA_AWAL_SOAL;
  }
}

export function simpanSoal(items: SoalPelatihan[]): boolean {
  try {
    sessionStorage.setItem(SOAL_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
