export type Konten = {
  id: number;
  judul: string;
  slug: string;
  tipe: "halaman" | "blok";
  indukId: number | null;
  isi: string;
  urutan: number;
  aktif: boolean;
};

export type FormKonten = Omit<Konten, "id">;

export async function ambilKonten(): Promise<Konten[]> {
  const res = await fetch("/api/v1/konten");
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data ?? [];
}

export async function simpanKonten(data: FormKonten, id?: number): Promise<Konten> {
  const res = await fetch(id ? `/api/v1/konten/${id}` : "/api/v1/konten", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusKonten(id: number): Promise<void> {
  await fetch(`/api/v1/konten/${id}`, { method: "DELETE" });
}