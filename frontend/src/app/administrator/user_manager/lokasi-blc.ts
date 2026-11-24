export type LokasiBlc = {
  id: number;
  nama: string;
  alamat: string;
  latitude: number | null;
  longitude: number | null;
  telepon: string;
  email: string;
  jamBuka: string;
  jamTutup: string;
  aktif: boolean;
};

export type FormLokasiBlc = Omit<LokasiBlc, "id">;

export async function ambilLokasiBlc(): Promise<LokasiBlc[]> {
  const res = await fetch("/api/v1/lokasi-blc");
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data ?? [];
}

export async function simpanLokasiBlc(data: FormLokasiBlc, id?: number): Promise<LokasiBlc> {
  const res = await fetch(id ? `/api/v1/lokasi-blc/${id}` : "/api/v1/lokasi-blc", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusLokasiBlc(id: number): Promise<void> {
  await fetch(`/api/v1/lokasi-blc/${id}`, { method: "DELETE" });
}