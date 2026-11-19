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
  { kode: "peserta", label: "Peserta" },
];

export type AkunUser = {
  id: number;
  nama: string;
  email: string;
  role: RoleUser;
};

const dataContoh: AkunUser[] = [
  { id: 1, nama: "Admin Utama", email: "admin@blc.test", role: "administrator" },
  { id: 2, nama: "Operator Konten", email: "operator@blc.test", role: "operator" },
  { id: 3, nama: "Instruktur Satu", email: "instruktur1@blc.test", role: "instruktur" },
  { id: 4, nama: "Instruktur Dua", email: "instruktur2@blc.test", role: "instruktur" },
  { id: 5, nama: "Koordinator Wilayah", email: "koordinator@blc.test", role: "koordinator" },
  { id: 6, nama: "Peserta Contoh", email: "peserta@blc.test", role: "peserta" },
];

// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend (filter per role).
export async function ambilUserPerRole(role: RoleUser): Promise<AkunUser[]> {
  return dataContoh.filter((u) => u.role === role);
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch PUT/POST ke backend.
// Password dikirim lewat HTTPS dan di-hash oleh backend, jangan disimpan di frontend.
export async function resetPassword(idUser: number, passwordBaru: string): Promise<void> {
  void idUser;
  void passwordBaru;
}