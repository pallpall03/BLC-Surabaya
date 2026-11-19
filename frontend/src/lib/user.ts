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

// Transform backend user ke frontend format
function transformUser(backendUser: {
  id: number;
  namaLengkap: string;
  email: string;
  isAktif: boolean;
  levelSlug: string;
  username?: string;
}): User {
  return {
    id: backendUser.id,
    nickname: backendUser.namaLengkap ?? backendUser.username ?? backendUser.email,
    username: backendUser.username ?? backendUser.email,
    aktif: backendUser.isAktif,
    role: mapLevelToRole(backendUser.levelSlug),
  };
}

export async function ambilUser(): Promise<User[]> {
  const res = await fetch("/api/v1/users");
  const data = await res.json();
  const raw = Array.isArray(data) ? data : data?.data ?? [];
  return raw.map(transformUser);
}

export async function simpanUser(data: FormUser, id?: number): Promise<User> {
  const payload = {
    nama_lengkap: data.nickname,
    email: data.username,
    password: data.password,
    password_confirmation: data.password,
    is_aktif: data.aktif,
    role: data.role, // kirim role frontend, backend map ke role_id
  };

  const res = await fetch(id ? `/api/v1/users/${id}` : "/api/v1/users", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const saved = await res.json();
  return transformUser(saved.data ?? saved);
}

export async function hapusUser(id: number): Promise<void> {
  await fetch(`/api/v1/users/${id}`, { method: "DELETE" });
}
