export type RoleUser =
  | "administrator"
  | "operator"
  | "instruktur"
  | "koordinator"
  | "peserta";

// Daftar role yang muncul di halaman. Hapus baris yang tidak dipakai.
export const daftarRole: { kode: RoleUser; label: string }[] = [
  { kode: "administrator", label: "Administrator" },
  { kode: "operator", label: "Operator" },
  { kode: "instruktur", label: "Instruktur" },
  { kode: "koordinator", label: "Koordinator" },
];

export type AkunUser = {
  id: number;
  nama: string;
  email: string;
  role: RoleUser;
};

// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend (filter per role).
export async function ambilUserPerRole(role: RoleUser): Promise<AkunUser[]> {
  const res = await fetch(`/api/v1/users?role=${role}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data ?? [];
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch PUT/POST ke backend.
// Password dikirim lewat HTTPS dan di-hash oleh backend, jangan disimpan di frontend.
export async function resetPassword(idUser: number, passwordBaru: string): Promise<void> {
  await fetch(`/api/v1/users/${idUser}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: passwordBaru }),
  });
}