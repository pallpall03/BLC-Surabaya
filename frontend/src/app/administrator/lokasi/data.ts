
export type StatusLokasi = "aktif" | "nonaktif";

export type Lokasi = {
  id: number;
  nama: string;
  alamat: string;
  kecamatan: string;
  telepon: string;
  maps: string;
  status: StatusLokasi;
};

export type FormLokasi = Omit<Lokasi, "id">;

const KUNCI = "blc-lokasi";

const dataAwal: Lokasi[] = [
  {
    id: 1,
    nama: "BLC Surabaya Pusat",
    alamat: "Masukkan alamat cabang BLC",
    kecamatan: "Genteng",
    telepon: "",
    maps: "",
    status: "aktif",
  },
  {
    id: 2,
    nama: "BLC Surabaya Timur",
    alamat: "Masukkan alamat cabang BLC",
    kecamatan: "Gubeng",
    telepon: "",
    maps: "",
    status: "aktif",
  },
  {
    id: 3,
    nama: "BLC Surabaya Selatan",
    alamat: "Masukkan alamat cabang BLC",
    kecamatan: "Wonokromo",
    telepon: "",
    maps: "",
    status: "aktif",
  },
];

function baca(): Lokasi[] {
  if (typeof window === "undefined") return dataAwal;

  try {
    const tersimpan = localStorage.getItem(KUNCI);
    return tersimpan ? JSON.parse(tersimpan) as Lokasi[] : dataAwal;
  } catch {
    return dataAwal;
  }
}

function tulis(data: Lokasi[]) {
  localStorage.setItem(KUNCI, JSON.stringify(data));
}

export async function ambilLokasi(): Promise<Lokasi[]> {
  return baca();
}

export async function simpanLokasi(
  data: FormLokasi,
  id?: number
): Promise<Lokasi> {
  const lama = baca();

  const lokasiBaru: Lokasi = {
    id: id ?? Date.now(),
    ...data,
  };

  const hasil = id
    ? lama.map((lokasi) =>
        lokasi.id === id ? lokasiBaru : lokasi
      )
    : [...lama, lokasiBaru];

  tulis(hasil);
  return lokasiBaru;
}

export async function hapusLokasi(id: number): Promise<void> {
  const hasil = baca().filter((lokasi) => lokasi.id !== id);
  tulis(hasil);
}
