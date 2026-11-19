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

export async function ambilTim(): Promise<Anggota[]> {
  const res = await fetch("/api/v1/tim-blc");
  return res.json();
}

export async function simpanAnggota(data: FormTim, id?: number): Promise<Anggota> {
  const formData = new FormData();
  formData.append("nama", data.nama);
  formData.append("jabatan", data.jabatan);
  formData.append("aktif", String(data.aktif));
  formData.append("urutan", String(data.urutan));
  if (data.foto) {
    formData.append("foto", data.foto);
  }
  if (data.fotoLama) {
    formData.append("foto_lama", data.fotoLama);
  }

  const res = await fetch(id ? `/api/v1/tim-blc/${id}` : "/api/v1/tim-blc", {
    method: id ? "PUT" : "POST",
    body: formData,
  });
  return res.json();
}

export async function hapusAnggota(id: number): Promise<void> {
  await fetch(`/api/v1/tim-blc/${id}`, { method: "DELETE" });
}

export async function simpanUrutanTim(idBerurutan: number[]): Promise<void> {
  await fetch("/api/v1/tim-blc/urutan", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idBerurutan }),
  });
}