export type KategoriArtikel = {
  id: number;
  nama: string;
  slug: string;
  urutan: number;
  aktif: boolean;
};

export type FormKategoriArtikel = Omit<KategoriArtikel, "id">;

export async function ambilKategoriArtikel(): Promise<KategoriArtikel[]> {
  const res = await fetch("/api/v1/kategori-artikel");
  return res.json();
}

export async function simpanKategoriArtikel(data: FormKategoriArtikel, id?: number): Promise<KategoriArtikel> {
  const res = await fetch(id ? `/api/v1/kategori-artikel/${id}` : "/api/v1/kategori-artikel", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusKategoriArtikel(id: number): Promise<void> {
  await fetch(`/api/v1/kategori-artikel/${id}`, { method: "DELETE" });
}