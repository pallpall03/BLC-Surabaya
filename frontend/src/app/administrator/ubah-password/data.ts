
import type { User } from "../user_manager/data";

// Mengambil daftar pengguna dari backend
export async function ambilPenggunaUbahPassword(): Promise<User[]> {
  const res = await fetch("/api/v1/users");

  if (!res.ok) {
    throw new Error("Gagal mengambil daftar pengguna.");
  }

  const data = await res.json();
  const raw = Array.isArray(data) ? data : data?.data ?? [];

  return raw.map((user: any) => ({
    id: user.id,
    nickname: user.namaLengkap ?? user.nama_lengkap ?? user.username ?? "",
    username: user.username ?? "",
    email: user.email ?? "",
    aktif: user.isAktif ?? user.is_aktif ?? false,
    role: mapLevelToRole(
      user.levelSlug ?? user.level_slug ?? user.role ?? ""
    ),
  }));
}

// Menyesuaikan role dari backend ke frontend
function mapLevelToRole(slug: string): User["role"] {
  const map: Record<string, User["role"]> = {
    superadmin: "administrator",
    administrator: "administrator",
    operator: "operator",
    instruktur: "instruktur",
    koordinator: "koordinator",
    peserta: "peserta",
  };

  return map[slug.toLowerCase()] ?? "peserta";
}

// Mengubah password pengguna
export async function resetPasswordUser(
  id: number,
  password: string,
  wajibGanti: boolean
): Promise<void> {
  const res = await fetch(`/api/v1/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      password,
      password_confirmation: password,
      wajib_ganti_password: wajibGanti,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(
      error?.message ?? `Gagal mengubah password (${res.status}).`
    );
  }
}
