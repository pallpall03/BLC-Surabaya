export type RoleUser =
  | "administrator"
  | "operator"
  | "instruktur"
  | "koordinator"
  | "peserta";

// Daftar role yang dipakai di Manajemen User, Role & Hak Akses, dan Manajemen Menu.
export const daftarRole: { kode: RoleUser; label: string }[] = [
  { kode: "administrator", label: "Administrator" },
  { kode: "operator", label: "Operator" },
  { kode: "instruktur", label: "Instruktur" },
  { kode: "koordinator", label: "Koordinator" },
  { kode: "peserta", label: "Peserta" },
];