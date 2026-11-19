export type Slide = {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string; // URL gambar
};

export async function ambilSlide(): Promise<Slide[]> {
  const res = await fetch("/api/v1/foto-slider");
  return res.json();
}

export async function tambahSlide(data: FormData): Promise<Slide> {
  const res = await fetch("/api/v1/foto-slider", {
    method: "POST",
    body: data,
  });
  return res.json();
}

export async function hapusSlide(id: number): Promise<void> {
  await fetch(`/api/v1/foto-slider/${id}`, { method: "DELETE" });
}