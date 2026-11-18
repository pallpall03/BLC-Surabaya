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

const dataContoh: User[] = [
  { id: 1, nickname: "User Test", username: "usertest", aktif: true, role: "operator" },
  { id: 2, nickname: "BLC Admin", username: "blcadmin", aktif: true, role: "operator" },
  { id: 3, nickname: "user biasa", username: "bojes", aktif: true, role: "operator" },
  { id: 4, nickname: "Super Admin", username: "blcsurabaya", aktif: true, role: "administrator" },
];

// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend.
export async function ambilUser(): Promise<User[]> {
  return dataContoh;
}

// SEMENTARA: bikin data palsu di browser. NANTI DIGANTI fetch POST (tambah) / PUT (ubah).
// Password dikirim lewat HTTPS dan di-hash oleh backend, jangan disimpan di frontend.
export async function simpanUser(data: FormUser, id?: number): Promise<User> {
  return {
    id: id ?? Date.now(),
    nickname: data.nickname,
    username: data.username,
    aktif: data.aktif,
    role: data.role,
  };
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch DELETE ke backend.
export async function hapusUser(id: number): Promise<void> {
  void id;
}