import type { RoleUser } from "./password";

export type User = {
  id: number;
  nickname: string;
  username: string;
  aktif: boolean;
  role: RoleUser;
};

export type FormUser = {
  nickname: string;
  username: string;
  role: RoleUser;
  aktif: boolean;
  password?: string; // hanya diisi saat tambah akun baru
};

export async function ambilUser(): Promise<User[]> {
  const res = await fetch("/api/v1/users");
  return res.json();
}

export async function simpanUser(data: FormUser, id?: number): Promise<User> {
  const res = await fetch(id ? `/api/v1/users/${id}` : "/api/v1/users", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusUser(id: number): Promise<void> {
  await fetch(`/api/v1/users/${id}`, { method: "DELETE" });
}