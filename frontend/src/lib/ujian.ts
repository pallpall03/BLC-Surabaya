export type Ujian = {
  id: number;
  modulId: number;
  judul: string;
  slug: string;
  deskripsi: string;
  waktuMenit: number;
  urutan: number;
  aktif: boolean;
};

export type FormUjian = Omit<Ujian, "id">;

export async function ambilUjian(): Promise<Ujian[]> {
  const res = await fetch("/api/v1/ujian");
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data ?? [];
}

export async function simpanUjian(data: FormUjian, id?: number): Promise<Ujian> {
  const res = await fetch(id ? `/api/v1/ujian/${id}` : "/api/v1/ujian", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusUjian(id: number): Promise<void> {
  await fetch(`/api/v1/ujian/${id}`, { method: "DELETE" });
}