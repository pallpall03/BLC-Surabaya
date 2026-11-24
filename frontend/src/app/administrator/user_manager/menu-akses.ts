import { authHeaders } from "@/lib/api";

export type MenuAkses = {
  id: number;
  role: string;
  menuId: number;
  lihat: boolean;
  tambah: boolean;
  ubah: boolean;
  hapus: boolean;
};

export type FormMenuAkses = Omit<MenuAkses, "id">;

export async function ambilMenuAkses(role?: string): Promise<MenuAkses[]> {
  const url = role ? `/api/v1/menu-akses?role=${role}` : "/api/v1/menu-akses";
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data ?? [];
}

export async function simpanMenuAkses(data: FormMenuAkses, id?: number): Promise<MenuAkses> {
  const res = await fetch(id ? `/api/v1/menu-akses/${id}` : "/api/v1/menu-akses", {
    method: id ? "PUT" : "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusMenuAkses(id: number): Promise<void> {
  await fetch(`/api/v1/menu-akses/${id}`, { method: "DELETE", headers: authHeaders() });
}

export const daftarRole: string[] = [
  "administrator",
  "operator",
  "instruktur",
  "koordinator",
  "peserta",
];