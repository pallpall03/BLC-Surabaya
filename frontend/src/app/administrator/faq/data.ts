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
  { id: 1, pertanyaan: "Apa itu BLC Surabaya?", jawaban: "Broadband Learning Center adalah pusat pembelajaran digital untuk warga Surabaya.", urutan: 1, aktif: true },
  { id: 2, pertanyaan: "Bagaimana cara mendaftar pelatihan?", jawaban: "Datang ke BLC terdekat atau daftar lewat menu Daftar di website.", urutan: 2, aktif: true },
  { id: 3, pertanyaan: "Apakah pelatihan berbayar?", jawaban: "Pelatihan di BLC gratis untuk warga Surabaya.", urutan: 3, aktif: true },
];

// SEMENTARA: disimpan di localStorage. NANTI DIGANTI fetch ke backend.
function baca(): Faq[] {
  if (typeof window === "undefined") return awal;
  try {
    const s = window.localStorage.getItem(KUNCI);
    return s ? (JSON.parse(s) as Faq[]) : awal;
  } catch {
    return awal;
  }
}

function tulis(data: Faq[]) {
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(data));
  } catch {
    // abaikan kalau penyimpanan penuh atau diblokir
  }
}

export async function ambilFaq(): Promise<Faq[]> {
  return baca();
}

export async function simpanFaq(data: FormFaq, id?: number): Promise<Faq> {
  const baru: Faq = { id: id ?? Date.now(), ...data };
  const lama = baca();
  tulis(id ? lama.map((f) => (f.id === id ? baru : f)) : [...lama, baru]);
  return baru;
}

export async function hapusFaq(id: number): Promise<void> {
  tulis(baca().filter((f) => f.id !== id));
}