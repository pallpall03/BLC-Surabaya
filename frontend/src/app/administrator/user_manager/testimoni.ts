export type Testimoni = {
  id: number;
  nama: string;
  jabatan: string;
  isi: string;
  foto: string;
  urutan: number;
  aktif: boolean;
};

export type FormTestimoni = Omit<Testimoni, "id" | "foto"> & {
  foto: File | null;
  fotoLama: string;
};

export async function ambilTestimoni(): Promise<Testimoni[]> {
  const res = await fetch("/api/v1/testimoni");
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data ?? [];
}

export async function simpanTestimoni(data: FormTestimoni, id?: number): Promise<Testimoni> {
  const formData = new FormData();
  formData.append("nama", data.nama);
  formData.append("jabatan", data.jabatan);
  formData.append("isi", data.isi);
  formData.append("urutan", String(data.urutan));
  formData.append("aktif", String(data.aktif));
  if (data.foto) {
    formData.append("foto", data.foto);
  }
  if (data.fotoLama) {
    formData.append("foto_lama", data.fotoLama);
  }

  const res = await fetch(id ? `/api/v1/testimoni/${id}` : "/api/v1/testimoni", {
    method: id ? "PUT" : "POST",
    body: formData,
  });
  return res.json();
}

export async function hapusTestimoni(id: number): Promise<void> {
  await fetch(`/api/v1/testimoni/${id}`, { method: "DELETE" });
}