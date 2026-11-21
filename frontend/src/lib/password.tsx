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
  const raw = Array.isArray(data) ? data : data?.data ?? [];
  
  // Transform backend format ke frontend format
  return raw.map((u: {
    id: number;
    namaLengkap: string;
    email: string;
    levelSlug: string;
  }) => ({
    id: u.id,
    nama: u.namaLengkap,
    email: u.email,
    role: mapLevelToRole(u.levelSlug),
  }));
}

// Map backend role slug (dari tabel roles) ke frontend role
function mapLevelToRole(slug: string): RoleUser {
  const map: Record<string, RoleUser> = {
    superadmin: "administrator",
    operator: "operator",
    instruktur: "instruktur",
    koordinator: "koordinator",
    peserta: "peserta",
  };
  return map[slug] ?? "peserta";
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch PUT/POST ke backend.
// Password dikirim lewat HTTPS dan di-hash oleh backend, jangan disimpan di frontend.
export async function resetPassword(idUser: number, passwordBaru: string): Promise<void> {
  await fetch(`/api/v1/users/${idUser}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      password: passwordBaru,
      password_confirmation: passwordBaru 
    }),
  });
}