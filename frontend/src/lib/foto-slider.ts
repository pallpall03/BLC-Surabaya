export type FotoSlider = {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
  urutan: number;
  aktif: boolean;
};

export type FormFotoSlider = Omit<FotoSlider, "id" | "gambar"> & {
  gambar: File | null;
  gambarLama: string;
};

export async function ambilFotoSlider(): Promise<FotoSlider[]> {
  const res = await fetch("/api/v1/foto-slider");
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data ?? [];
}

export async function simpanFotoSlider(data: FormFotoSlider, id?: number): Promise<FotoSlider> {
  const formData = new FormData();
  formData.append("judul", data.judul);
  formData.append("deskripsi", data.deskripsi);
  formData.append("urutan", String(data.urutan));
  formData.append("aktif", String(data.aktif));
  if (data.gambar) {
    formData.append("gambar", data.gambar);
  }
  if (data.gambarLama) {
    formData.append("gambar_lama", data.gambarLama);
  }

  const res = await fetch(id ? `/api/v1/foto-slider/${id}` : "/api/v1/foto-slider", {
    method: id ? "PUT" : "POST",
    body: formData,
  });
  return res.json();
}

export async function hapusFotoSlider(id: number): Promise<void> {
  await fetch(`/api/v1/foto-slider/${id}`, { method: "DELETE" });
}