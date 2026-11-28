import { apiGet, apiPost, type PengunjungOpsi } from "@/lib/api";

export type BukuTamu = {
  id: number;
  nama: string;
  instansi: string | null;
  pesan: string;
  rating: number | null;
  tanggal: string;
  blc: string | null;
  sesi: number | null;
  dibaca: boolean;
};

export type FormTamu = {
  nama: string;
  instansi: string;
  email: string;
  telepon: string;
  pesan: string;
  lokasi_blc_id?: number;
  sesi_id?: number;
  jenis_kelamin?: "L" | "P" | "";
  tanggal_lahir?: string;
  alamat?: string;
  kategori?: string;
};

type BukuTamuBackend = Omit<BukuTamu, "dibaca">;

function mapBukuTamu(data: BukuTamuBackend): BukuTamu {
  return { ...data, dibaca: false };
}

export async function ambilOpsiBukuTamu(): Promise<PengunjungOpsi> {
  const res = await apiGet<{ data: PengunjungOpsi }>("/buku-tamu/opsi");
  return res.data;
}

export async function ambilBukuTamu(): Promise<BukuTamu[]> {
  const res = await apiGet<{ data: BukuTamuBackend[] }>("/buku-tamu/aktif");
  return (Array.isArray(res.data) ? res.data : []).map(mapBukuTamu);
}

export async function kirimBukuTamu(form: FormTamu): Promise<BukuTamu> {
  let lokasiBlcId = form.lokasi_blc_id;
  let sesiId = form.sesi_id;
  if (!lokasiBlcId || !sesiId) {
    const opsi = await ambilOpsiBukuTamu();
    lokasiBlcId ??= opsi.blc[0]?.id;
    sesiId ??= opsi.sesi[0]?.id;
  }
  if (!lokasiBlcId || !sesiId) throw new Error("BLC dan sesi belum tersedia.");

  const res = await apiPost<{ data: BukuTamuBackend }>("/buku-tamu", {
    nama: form.nama,
    instansi: form.instansi || null,
    email: form.email || null,
    telepon: form.telepon || null,
    pesan: form.pesan,
    lokasi_blc_id: lokasiBlcId,
    sesi_id: sesiId,
    jenis_kelamin: form.jenis_kelamin || null,
    tanggal_lahir: form.tanggal_lahir || null,
    alamat: form.alamat || null,
    kategori: form.kategori || null,
  });
  const baru = mapBukuTamu(res.data);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("buku-tamu-berubah"));
  }
  return baru;
}
