export type Piagam = {
  id: number;
  modulId: number;
  judul: string;
  slug: string;
  template: string;
  aktif: boolean;
};

export type FormPiagam = Omit<Piagam, "id">;

export async function ambilPiagam(): Promise<Piagam[]> {
  const res = await fetch("/api/v1/piagam");
  return res.json();
}

export async function simpanPiagam(data: FormPiagam, id?: number): Promise<Piagam> {
  const res = await fetch(id ? `/api/v1/piagam/${id}` : "/api/v1/piagam", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusPiagam(id: number): Promise<void> {
  await fetch(`/api/v1/piagam/${id}`, { method: "DELETE" });
}