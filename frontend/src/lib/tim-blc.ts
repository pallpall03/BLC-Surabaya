export type Anggota = {
  id: number;
  nama: string;
  jabatan: string;
  foto: string; // URL foto, kosong = belum ada foto
  aktif: boolean; // false = disembunyikan dari website publik
  urutan: number;
};

export type FormTim = {
  nama: string;
  jabatan: string;
  aktif: boolean;
  urutan: number;
  foto: File | null; // diisi hanya kalau admin memilih foto baru
  fotoLama: string; // foto yang sudah ada (dipakai kalau tidak ganti foto)
};

const dataContoh: Anggota[] = [
  { id: 1, nama: "Nama Kepala BLC", jabatan: "Kepala BLC", foto: "", aktif: true, urutan: 1 },
  { id: 2, nama: "Nama Koordinator", jabatan: "Koordinator", foto: "", aktif: true, urutan: 2 },
  { id: 3, nama: "Nama Instruktur", jabatan: "Instruktur", foto: "", aktif: true, urutan: 3 },
  { id: 4, nama: "Nama Operator", jabatan: "Operator", foto: "", aktif: false, urutan: 4 },
];

// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend.
export async function ambilTim(): Promise<Anggota[]> {
  return dataContoh;
}

// SEMENTARA: bikin data palsu di browser.
// NANTI DIGANTI fetch POST (tambah) / PUT (ubah) ke backend memakai FormData.
// Kirim field "foto" hanya kalau data.foto berisi file; kalau null, biarkan foto lama.
export async function simpanAnggota(data: FormTim, id?: number): Promise<Anggota> {
  return {
    id: id ?? Date.now(),
    nama: data.nama,
    jabatan: data.jabatan,
    aktif: data.aktif,
    urutan: data.urutan,
    foto: data.foto ? URL.createObjectURL(data.foto) : data.fotoLama,
  };
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch DELETE ke backend.
export async function hapusAnggota(id: number): Promise<void> {
  void id;
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch PUT ke backend,
// berisi daftar id sesuai urutan baru.
export async function simpanUrutanTim(idBerurutan: number[]): Promise<void> {
  void idBerurutan;
}