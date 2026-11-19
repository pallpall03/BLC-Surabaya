export type Faq = {
  id: number;
  pertanyaan: string;
  jawaban: string;
  aktif: boolean; // false = disembunyikan dari website publik
  urutan: number;
};

export type FormFaq = Omit<Faq, "id">;

const dataContoh: Faq[] = [
  {
    id: 1,
    pertanyaan: "Apa itu BLC Surabaya?",
    jawaban: "BLC (Broadband Learning Center) adalah tempat belajar teknologi informasi bagi masyarakat. Ganti dengan jawaban sebenarnya.",
    aktif: true,
    urutan: 1,
  },
  {
    id: 2,
    pertanyaan: "Bagaimana cara mendaftar pelatihan?",
    jawaban: "Jawaban contoh. Ganti dengan langkah pendaftaran yang sebenarnya.",
    aktif: true,
    urutan: 2,
  },
  {
    id: 3,
    pertanyaan: "Apakah pelatihan dipungut biaya?",
    jawaban: "Jawaban contoh. Ganti dengan informasi biaya yang sebenarnya.",
    aktif: true,
    urutan: 3,
  },
  {
    id: 4,
    pertanyaan: "Di mana saja lokasi BLC?",
    jawaban: "Jawaban contoh. Ganti dengan daftar lokasi yang sebenarnya.",
    aktif: false,
    urutan: 4,
  },
];

// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend.
export async function ambilFaq(): Promise<Faq[]> {
  return dataContoh;
}

// SEMENTARA: bikin data palsu di browser. NANTI DIGANTI fetch POST (tambah) / PUT (ubah).
export async function simpanFaq(data: FormFaq, id?: number): Promise<Faq> {
  return { id: id ?? Date.now(), ...data };
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch DELETE ke backend.
export async function hapusFaq(id: number): Promise<void> {
  void id;
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch PUT ke backend,
// berisi daftar id sesuai urutan baru.
export async function simpanUrutanFaq(idBerurutan: number[]): Promise<void> {
  void idBerurutan;
}