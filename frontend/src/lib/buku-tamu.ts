export type BukuTamu = {
  id: number;
  nama: string;
  instansi: string; // asal pengunjung (instansi/sekolah/kota)
  email: string;
  telepon: string;
  pesan: string;
  tanggal: string;
  dibaca: boolean;
};

export type FormTamu = Pick<BukuTamu, "nama" | "instansi" | "email" | "telepon" | "pesan">;

// ===== DIPAKAI HALAMAN PUBLIK (tanpa login) =====
export async function kirimBukuTamu(data: FormTamu): Promise<void> {
  await fetch("/api/v1/buku-tamu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ===== DIPAKAI HALAMAN ADMIN (nanti butuh login) =====
export async function ambilBukuTamu(): Promise<BukuTamu[]> {
  const res = await fetch("/api/v1/buku-tamu");
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data ?? [];
}

export async function tandaiDibaca(id: number, dibaca: boolean): Promise<void> {
  await fetch(`/api/v1/buku-tamu/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dibaca }),
  });
}

export async function hapusBukuTamu(id: number): Promise<void> {
  await fetch(`/api/v1/buku-tamu/${id}`, { method: "DELETE" });
}