import type { RoleUser } from "./password";

export type MenuData = {
  id: number;
  nama: string;
  href: string; // kosong = menu induk (grup) tanpa halaman
  ikon: string; // nama ikon, lihat lib/ikon.ts
  indukId: number | null; // null = menu utama
  role: RoleUser;
  urutan: number;
  aktif: boolean;
};

export type FormMenu = Omit<MenuData, "id">;

export async function ambilMenu(): Promise<MenuData[]> {
  const res = await fetch("/api/v1/menu");
  const data = await res.json();
  // API bisa return array langsung atau { data: [...] }
  return Array.isArray(data) ? data : data?.data ?? [];
}

export async function simpanMenu(data: FormMenu, id?: number): Promise<MenuData> {
  const res = await fetch(id ? `/api/v1/menu/${id}` : "/api/v1/menu", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusMenu(id: number): Promise<void> {
  await fetch(`/api/v1/menu/${id}`, { method: "DELETE" });
}