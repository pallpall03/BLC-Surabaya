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

const KUNCI = "blc-buku-tamu";

const awal: BukuTamu[] = [
  { id: 1, nama: "Rina", instansi: "SMKN 1 Surabaya", email: "rina@mail.com", telepon: "081200000001", pesan: "Kelasnya bermanfaat, instrukturnya sabar.", tanggal: "2026-11-20", dibaca: false },
  { id: 2, nama: "Budi", instansi: "Warga Rungkut", email: "budi@mail.com", telepon: "081200000002", pesan: "Tempatnya nyaman dan internetnya cepat.", tanggal: "2026-11-18", dibaca: true },
  { id: 3, nama: "Sari", instansi: "Universitas Airlangga", email: "sari@mail.com", telepon: "081200000003", pesan: "Kapan ada pelatihan desain grafis lagi?", tanggal: "2026-11-15", dibaca: false },
];

// SEMENTARA: disimpan di localStorage. NANTI DIGANTI fetch ke backend.
function baca(): BukuTamu[] {
  if (typeof window === "undefined") return awal;
  try {
    const s = window.localStorage.getItem(KUNCI);
    return s ? (JSON.parse(s) as BukuTamu[]) : awal;
  } catch {
    return awal;
  }
}

function tulis(data: BukuTamu[]) {
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(data));
  } catch {
    // abaikan kalau penyimpanan penuh atau diblokir
  }
}

export async function ambilBukuTamu(): Promise<BukuTamu[]> {
  return baca();
}

// dipakai form Buku Tamu di home: NANTI DIGANTI fetch POST ke backend
export async function kirimBukuTamu(form: FormTamu): Promise<BukuTamu> {
  const baru: BukuTamu = {
    id: Date.now(),
    ...form,
    tanggal: new Date().toISOString().slice(0, 10),
    dibaca: false,
  };
  tulis([baru, ...baca()]);
  return baru;
}

export async function tandaiDibaca(id: number, dibaca: boolean = true): Promise<void> {
  tulis(baca().map((b) => (b.id === id ? { ...b, dibaca } : b)));
}

export async function hapusBukuTamu(id: number): Promise<void> {
  tulis(baca().filter((b) => b.id !== id));
}