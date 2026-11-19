export type Modul = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  urutan: number;
  aktif: boolean;
};

export type FormModul = Omit<Modul, "id">;

export async function ambilModul(): Promise<Modul[]> {
  const res = await fetch("/api/v1/modul");
  return res.json();
}

export async function simpanModul(data: FormModul, id?: number): Promise<Modul> {
  const res = await fetch(id ? `/api/v1/modul/${id}` : "/api/v1/modul", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusModul(id: number): Promise<void> {
  await fetch(`/api/v1/modul/${id}`, { method: "DELETE" });
}