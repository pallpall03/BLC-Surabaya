export type BukuTamu = {
  id: number;
  nama: string;
  instansi: string; // asal pengunjung (instansi/sekolah/kota)
  email: string;
  telepon: string;
  pesan: string;
  tanggal: string;
  dibaca: boolean;
};

export type FormTamu = Pick<BukuTamu, "nama" | "instansi" | "email" | "telepon" | "pesan">;

const dataContoh: BukuTamu[] = [
  {
    id: 1,
    nama: "Rina Wulandari",
    instansi: "SMKN 5 Surabaya",
    email: "rina@contoh.com",
    telepon: "081234567890",
    pesan: "Terima kasih atas pelatihannya, sangat bermanfaat untuk siswa kami. Semoga ada kelas lanjutan.",
    tanggal: "2026-11-17 09:30:00",
    dibaca: false,
  },
  {
    id: 2,
    nama: "Budi Santoso",
    instansi: "Warga Wonorejo",
    email: "",
    telepon: "",
    pesan: "Apakah BLC Wonorejo buka pada hari Sabtu?",
    tanggal: "2026-11-16 14:05:00",
    dibaca: false,
  },
  {
    id: 3,
    nama: "Dewi Lestari",
    instansi: "Universitas Negeri Surabaya",
    email: "dewi@contoh.com",
    telepon: "",
    pesan: "Kami ingin berkunjung untuk studi banding. Bagaimana prosedurnya?",
    tanggal: "2026-11-12 10:20:00",
    dibaca: true,
  },
];

// ===== DIPAKAI HALAMAN PUBLIK (tanpa login) =====
// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch POST ke backend (tanpa token).
export async function kirimBukuTamu(data: FormTamu): Promise<void> {
  void data;
}

// ===== DIPAKAI HALAMAN ADMIN (nanti butuh login) =====
// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend.
export async function ambilBukuTamu(): Promise<BukuTamu[]> {
  return dataContoh;
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch PUT/PATCH ke backend.
export async function tandaiDibaca(id: number, dibaca: boolean): Promise<void> {
  void id;
  void dibaca;
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch DELETE ke backend.
export async function hapusBukuTamu(id: number): Promise<void> {
  void id;
}