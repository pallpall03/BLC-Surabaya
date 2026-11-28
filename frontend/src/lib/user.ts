export type RoleUser = "administrator" | "operator" | "instruktur";

export type User = {
  id: number;
  nickname: string;
  username: string;
  email: string;
  aktif: boolean;
  role: RoleUser;
};

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
    throw new Error(error?.message || "Gagal reset password");
  }
}