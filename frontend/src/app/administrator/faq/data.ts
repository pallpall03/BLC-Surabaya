
export type Faq = {
  id: number;
  pertanyaan: string;
  jawaban: string;
  urutan: number;
  aktif: boolean;
};

export type FormFaq = Omit<Faq, "id">;

const KUNCI = "blc-faq";

const awal: Faq[] = [
  {
    id: 1,
    pertanyaan: "Apa itu BLC Surabaya?",
    jawaban:
      "Broadband Learning Center adalah pusat pembelajaran digital untuk warga Surabaya.",
    urutan: 1,
    aktif: true,
  },
  {
    id: 2,
    pertanyaan: "Bagaimana cara mendaftar pelatihan?",
    jawaban:
      "Datang ke BLC terdekat atau daftar lewat menu Daftar di website.",
    urutan: 2,
    aktif: true,
  },
  {
    id: 3,
    pertanyaan: "Apakah pelatihan berbayar?",
    jawaban: "Pelatihan di BLC gratis untuk warga Surabaya.",
    urutan: 3,
    aktif: true,
  },
];

// Membaca data dari localStorage
function baca(): Faq[] {
  if (typeof window === "undefined") return awal;

  try {
    const s = window.localStorage.getItem(KUNCI);
    return s ? (JSON.parse(s) as Faq[]) : awal;
  } catch {
    return awal;
  }
}

// Menyimpan data ke localStorage
function tulis(data: Faq[]) {
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(data));
  } catch {
    // Abaikan jika penyimpanan gagal
  }
}

// Mengambil seluruh FAQ
export async function ambilFaq(): Promise<Faq[]> {
  return baca();
}

// Menambah atau mengubah FAQ
export async function simpanFaq(
  data: FormFaq,
  id?: number
): Promise<Faq> {
  const baru: Faq = {
    id: id ?? Date.now(),
    ...data,
  };

  const lama = baca();

  tulis(
    id
      ? lama.map((f) => (f.id === id ? baru : f))
      : [...lama, baru]
  );

  return baru;
}

// Menghapus FAQ
export async function hapusFaq(id: number): Promise<void> {
  tulis(baca().filter((f) => f.id !== id));
}
