
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  KeyRound,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  ambilUser,
  resetPasswordUser,
  type User,
} from "../user_manager/data";

import type { RoleUser } from "../_shared/role";

const daftarRole: { value: RoleUser; label: string }[] = [
  { value: "administrator", label: "Administrator" },
  { value: "operator", label: "Operator" },
  { value: "instruktur", label: "Instruktur" },
  { value: "koordinator", label: "Koordinator" },
  { value: "peserta", label: "Peserta" },
];

const penggunaContoh: User[] = [
  {
    id: -1,
    nickname: "Admin Contoh",
    username: "admin.contoh",
    email: "admin@example.test",
    aktif: true,
    role: "administrator",
  },
  {
    id: -2,
    nickname: "Operator Contoh",
    username: "operator.contoh",
    email: "operator@example.test",
    aktif: true,
    role: "operator",
  },
  {
    id: -3,
    nickname: "Instruktur Contoh",
    username: "instruktur.contoh",
    email: "instruktur@example.test",
    aktif: true,
    role: "instruktur",
  },
  {
    id: -4,
    nickname: "Koordinator Contoh",
    username: "koordinator.contoh",
    email: "koordinator@example.test",
    aktif: true,
    role: "koordinator",
  },
  {
    id: -5,
    nickname: "Peserta Contoh",
    username: "peserta.contoh",
    email: "peserta@example.test",
    aktif: true,
    role: "peserta",
  },
];

export default function UbahPasswordPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modeContoh, setModeContoh] = useState(false);
  const [pencarian, setPencarian] = useState("");
  const [filterRole, setFilterRole] = useState("semua");

  const [userDipilih, setUserDipilih] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [lihatPassword, setLihatPassword] = useState(false);
  const [lihatKonfirmasi, setLihatKonfirmasi] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesanError, setPesanError] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");

  async function muatUsers() {
    try {
      setLoading(true);
      setPesanError("");
      const hasil = await ambilUser();
      setUsers(hasil);
      setModeContoh(false);
    } catch {
      setUsers(penggunaContoh);
      setModeContoh(true);
      setPesanError(
        "API pengguna belum tersedia. Mode Demo aktif: aksi hanya menguji form dan validasi, tidak mengubah akun asli atau menyimpan password."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let masihAktif = true;

    ambilUser()
      .then((hasil) => {
        if (!masihAktif) return;
        setUsers(hasil);
        setModeContoh(false);
      })
      .catch(() => {
        if (!masihAktif) return;
        setUsers(penggunaContoh);
        setModeContoh(true);
        setPesanError(
          "API pengguna belum tersedia. Mode Demo aktif: aksi hanya menguji form dan validasi, tidak mengubah akun asli atau menyimpan password."
        );
      })
      .finally(() => {
        if (masihAktif) setLoading(false);
      });

    return () => {
      masihAktif = false;
    };
  }, []);

  const usersFilter = useMemo(() => {
    return users.filter((user) => {
      const cocokRole =
        filterRole === "semua" || user.role === filterRole;

      const kata = pencarian.toLowerCase();

      const cocokCari =
        user.nickname.toLowerCase().includes(kata) ||
        user.username.toLowerCase().includes(kata) ||
        user.email.toLowerCase().includes(kata);

      return cocokRole && cocokCari;
    });
  }, [users, pencarian, filterRole]);

  function bukaModal(user: User) {
    setUserDipilih(user);
    setPassword("");
    setKonfirmasi("");
    setPesanError("");
    setPesanSukses("");
  }

  function tutupModal() {
    if (menyimpan) return;

    setUserDipilih(null);
    setPassword("");
    setKonfirmasi("");
    setPesanError("");
  }

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userDipilih) return;

    if (password.length < 8) {
      setPesanError("Password minimal harus 8 karakter.");
      return;
    }

    if (password !== konfirmasi) {
      setPesanError("Konfirmasi password tidak sama.");
      return;
    }

    if (modeContoh) {
      setPesanError("");
      setPesanSukses(
        "Simulasi berhasil. Password tidak disimpan dan akun asli tidak berubah."
      );
      setPassword("");
      setKonfirmasi("");
      window.setTimeout(() => {
        setUserDipilih(null);
        setPesanSukses("");
      }, 2500);
      return;
    }

    try {
      setMenyimpan(true);
      setPesanError("");

      await resetPasswordUser(userDipilih.id, password, false);

      setPesanSukses(
        `Password akun ${userDipilih.nickname} berhasil diperbarui.`
      );

      setPassword("");
      setKonfirmasi("");
      setModeContoh(false);

      setTimeout(() => {
        setUserDipilih(null);
        setPesanSukses("");
      }, 1500);
    } catch (error) {
      setPesanError(
        error instanceof Error
          ? error.message
          : "Gagal mengubah password."
      );
    } finally {
      setMenyimpan(false);
    }
  }

  function namaRole(role: RoleUser) {
    return daftarRole.find((item) => item.value === role)?.label ?? role;
  }

  return (
    <div className="space-y-6">
      {/* INFORMASI */}
      <div className="admin-password-notice flex gap-3 rounded-xl border p-4">
        <ShieldCheck className="mt-0.5 shrink-0" size={22} />
        <div>
          <p className="font-semibold">
            Pengelolaan Password oleh Administrator
          </p>
          <p className="mt-1 text-sm">
            Administrator memiliki kewenangan untuk mengubah password akun
            Administrator, Operator, Instruktur, Koordinator, dan Peserta.
          </p>
        </div>
      </div>

      {pesanError && !userDipilih && (
        <div
          role="alert"
          className={`rounded-lg border px-4 py-3 text-sm ${
            modeContoh
              ? "admin-password-fallback"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {pesanError}
        </div>
      )}

      {/* RINGKASAN */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card">
          <div className="card-body flex items-center justify-between p-5">
            <div>
            <p className="text-sm text-gray-500">Total Pengguna</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
              {loading ? "-" : users.length}
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-light-primary text-primary">
              <Users size={22} />
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Total Role</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {daftarRole.length}
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-light-success text-success">
              <ShieldCheck size={22} />
            </span>
          </div>
        </div>
      </div>

      {/* DAFTAR PENGGUNA */}
      <section className="card overflow-hidden">
        <div className="card-header flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">
              Daftar Akun Pengguna
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Pilih akun untuk mengubah password.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void muatUsers()}
            disabled={loading}
            className="btn btn-light-primary inline-flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Memuat..." : "Muat Ulang"}
          </button>
        </div>

        {/* PENCARIAN DAN FILTER */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              aria-label="Cari pengguna"
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              placeholder="Cari nama, username, atau email..."
              className="admin-input-ikon w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            aria-label="Filter berdasarkan role"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="min-w-44 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="semua">Semua Role</option>
            {daftarRole.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">
          <table className="table w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama Pengguna</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : usersFilter.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Data pengguna tidak ditemukan.
                  </td>
                </tr>
              ) : (
                usersFilter.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{index + 1}</td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        {user.nickname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.username}
                      </p>
                      {modeContoh && (
                        <span className="mt-1 inline-flex rounded-full bg-light-warning px-2 py-0.5 text-xs font-medium text-warning">
                          Data contoh
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {namaRole(user.role)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                          user.aktif
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => bukaModal(user)}
                        disabled={!user.aktif}
                        title={
                          modeContoh
                            ? "Mode Demo: form dapat diuji, tetapi password akun asli tidak berubah."
                            : undefined
                        }
                        className="btn btn-sm btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <KeyRound size={14} />
                        {modeContoh ? "Uji Aksi (Demo)" : "Ubah Password"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
          Menampilkan {usersFilter.length} dari {users.length} pengguna.
        </div>
      </section>

      {/* MODAL UBAH PASSWORD */}
      {userDipilih && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="ubah-password-title"
            className="card w-full max-w-md overflow-hidden"
          >
            <div className="card-header flex items-center justify-between">
              <div>
                <h2 id="ubah-password-title" className="font-bold text-gray-800">
                  Ubah Password
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Akun: {userDipilih.nickname}
                </p>
              </div>

              <button
                type="button"
                onClick={tutupModal}
                disabled={menyimpan}
                aria-label="Tutup form ubah password"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleReset}>
              <div className="card-body space-y-4 p-5">
                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                  <p className="font-semibold text-gray-800">
                    {userDipilih.nickname}
                  </p>
                  <p className="text-gray-500">{userDipilih.email}</p>
                  <p className="mt-1 text-xs text-blue-600">
                    {namaRole(userDipilih.role)}
                  </p>
                </div>

                <div>
                  <label htmlFor="password-baru" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      id="password-baru"
                      type={lihatPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-11 text-sm outline-none focus:border-blue-500"
                      minLength={8}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setLihatPassword(!lihatPassword)}
                      aria-label={lihatPassword ? "Sembunyikan password" : "Tampilkan password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {lihatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="konfirmasi-password" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      id="konfirmasi-password"
                      type={lihatKonfirmasi ? "text" : "password"}
                      value={konfirmasi}
                      onChange={(e) => setKonfirmasi(e.target.value)}
                      placeholder="Ulangi password baru"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-11 text-sm outline-none focus:border-blue-500"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setLihatKonfirmasi(!lihatKonfirmasi)
                      }
                      aria-label={lihatKonfirmasi ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {lihatKonfirmasi ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {pesanError && (
                  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {pesanError}
                  </p>
                )}

                {pesanSukses && (
                  <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {pesanSukses}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 p-4">
                <button
                  type="button"
                  onClick={tutupModal}
                  disabled={menyimpan}
                  className="btn btn-light"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={menyimpan}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {menyimpan
                    ? "Menyimpan..."
                    : modeContoh
                      ? "Submit"
                      : "Simpan Password"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
