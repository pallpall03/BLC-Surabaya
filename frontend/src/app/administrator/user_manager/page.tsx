"use client";

import { useEffect, useMemo, useState } from "react";
import { KeyRound, Pencil, Plus, Search, Trash2, X, Users } from "lucide-react";
import { ambilUser, simpanUser, hapusUser, type User } from "./data";
import { daftarRole, type RoleUser } from "../_shared/role";
import ResetPasswordModal from "./ResetPasswordModal";

const warnaRole: Record<RoleUser, string> = {
  administrator: "bg-violet-100 text-violet-700",
  operator: "bg-amber-100 text-amber-700",
  instruktur: "bg-sky-100 text-sky-700",
  koordinator: "bg-teal-100 text-teal-700",
  peserta: "bg-slate-200 text-slate-600",
};

const labelRole = (kode: RoleUser) =>
  daftarRole.find((r) => r.kode === kode)?.label ?? kode;

const BARIS = 10;

export default function HalamanUserManager() {
  const [daftar, setDaftar] = useState<User[]>([]);
  const [memuat, setMemuat] = useState<boolean>(true);
  const [tab, setTab] = useState<"semua" | RoleUser>("semua");
  const [cari, setCari] = useState("");
  const [halaman, setHalaman] = useState<number>(1);
  const [reset, setReset] = useState<User | null>(null); // akun yang sedang direset passwordnya

  // modal tambah/ubah: null = tertutup, {} = tambah, {id} = ubah
  const [modal, setModal] = useState<{ id?: number } | null>(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<RoleUser>("operator");
    const [aktif, setAktif] = useState<boolean>(true);
    const [password, setPassword] = useState("");
    const [galat, setGalat] = useState("");

  useEffect(() => {
    ambilUser()
      .then(setDaftar)
      .finally(() => setMemuat(false));
  }, []);

  const hasil = useMemo(
    () =>
      daftar.filter(
        (u) =>
          (tab === "semua" || u.role === tab) &&
          `${u.nickname} ${u.username}`.toLowerCase().includes(cari.toLowerCase())
      ),
    [daftar, tab, cari]
  );
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS));
  const halamanAman = Math.min(halaman, totalHalaman);
  const awal = (halamanAman - 1) * BARIS;
  const tampil = hasil.slice(awal, awal + BARIS);

  function bukaTambah() {
      setUsername("");
      setEmail("");
      setRole(tab === "semua" ? "operator" : tab);
      setAktif(true);
      setPassword("");
      setGalat("");
      setModal({});
    }

    function bukaUbah(u: User) {
      setUsername(u.username);
      setEmail(u.email);
      setRole(u.role);
      setAktif(u.aktif);
      setPassword("");
      setGalat("");
      setModal({ id: u.id });
    }

  async function handleSimpan() {
      const id = modal?.id;

      if (!username.trim() || !email.trim()) {
        return setGalat("Username dan email wajib diisi.");
      }
      if (!email.includes("@")) {
        return setGalat("Format email tidak valid.");
      }
      if (daftar.some((u) => u.username === username.trim() && u.id !== id)) {
        return setGalat("Username sudah dipakai.");
      }
      if (daftar.some((u) => u.email === email.trim() && u.id !== id)) {
        return setGalat("Email sudah dipakai.");
      }
      if (!id && password.length < 8) {
        return setGalat("Password minimal 8 karakter.");
      }

      const hasilSimpan = await simpanUser(
        { username: username.trim(), email: email.trim(), role, aktif, password: id ? undefined : password },
        id
      );
    setDaftar((lama) =>
      id ? lama.map((u) => (u.id === id ? hasilSimpan : u)) : [...lama, hasilSimpan]
    );
    setModal(null);
  }

  async function handleHapus(u: User) {
    // jaga supaya administrator terakhir tidak terhapus
    const jumlahAdmin = daftar.filter((x) => x.role === "administrator").length;
    if (u.role === "administrator" && jumlahAdmin <= 1) {
      window.alert("Administrator terakhir tidak boleh dihapus.");
      return;
    }
    if (!window.confirm(`Hapus akun "${u.nickname}"?`)) return;
    await hapusUser(u.id);
    setDaftar((lama) => lama.filter((x) => x.id !== u.id));
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  const semuaTab: { kode: "semua" | RoleUser; label: string; jumlah: number }[] = [
    { kode: "semua", label: "Semua", jumlah: daftar.length },
    ...daftarRole.map((r) => ({
      kode: r.kode,
      label: r.label,
      jumlah: daftar.filter((u) => u.role === r.kode).length,
    })),
  ];

  return (
    <div>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Data User</h3>
            <p className="text-sm text-slate-400">Kelola akun dan role pengguna</p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="relative flex-1 sm:w-64 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={cari}
                onChange={(e) => {
                  setCari(e.target.value);
                  setHalaman(1);
                }}
                placeholder="Cari username atau email..."
                className={`${inputClass} bg-slate-50 pl-9`}
              />
            </div>
            <button
              onClick={bukaTambah}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
            >
              <Plus size={16} /> Tambah Data
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-6 py-3">
          {semuaTab.map((t) => (
            <button
              key={t.kode}
              onClick={() => {
                setTab(t.kode);
                setHalaman(1);
              }}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm transition ${
                tab === t.kode
                  ? "bg-violet-600 font-medium text-white shadow-sm shadow-violet-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  tab === t.kode ? "bg-white/25" : "bg-white text-slate-500"
                }`}
              >
                {t.jumlah}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
                          <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-6 py-3 font-semibold">No</th>
                            <th className="px-4 py-3 font-semibold">Username</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Role</th>
                            <th className="px-6 py-3 text-right font-semibold">Aksi</th>
                          </tr>
                        </thead>
            <tbody className="divide-y divide-slate-100">
                          {memuat ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-slate-400">
                                Memuat data...
                              </td>
                            </tr>
                          ) : tampil.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12">
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                  <Users size={36} />
                                  <p>{cari ? "Akun tidak ditemukan." : "Belum ada akun di role ini."}</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            tampil.map((u, i) => (
                              <tr key={u.id} className="transition hover:bg-slate-50">
                                <td className="px-6 py-3.5 text-slate-400">{awal + i + 1}</td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-3">
                                                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                                                            {(u.username ?? "?").charAt(0).toUpperCase()}
                                                          </span>
                                                          <span className="font-medium text-slate-800">{u.username ?? "-"}</span>
                                                        </div>
                                </td>
                                <td className="px-4 py-3.5 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          u.aktif
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.aktif ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {u.aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${warnaRole[u.role]}`}
                      >
                        {labelRole(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReset(u)}
                          title="Reset password"
                          className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600 transition hover:bg-violet-100"
                        >
                          <KeyRound size={14} /> Reset
                        </button>
                        <button
                          onClick={() => bukaUbah(u)}
                          className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-100"
                        >
                          <Pencil size={14} /> Ubah
                        </button>
                        <button
                          onClick={() => handleHapus(u)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
          <span>
            Menampilkan {hasil.length === 0 ? 0 : awal + 1}–
            {Math.min(awal + BARIS, hasil.length)} dari {hasil.length} akun
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setHalaman(halamanAman - 1)}
              disabled={halamanAman === 1}
              className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setHalaman(n)}
                className={`h-8 w-8 rounded-lg text-sm transition ${
                  n === halamanAman
                    ? "bg-violet-600 font-semibold text-white"
                    : "hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setHalaman(halamanAman + 1)}
              disabled={halamanAman === totalHalaman}
              className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </section>

      {/* MODAL TAMBAH / UBAH */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h4 className="font-semibold text-slate-800">
                {modal.id ? "Ubah Akun" : "Tambah Akun"}
              </h4>
              <button
                onClick={() => setModal(null)}
                aria-label="Tutup"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
<<<<<<< Updated upstream
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                              Username
                            </label>
                            <input
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              autoComplete="off"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                              Email
                            </label>
                            <input
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              type="email"
                              autoComplete="email"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
=======
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nickname</label>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
>>>>>>> Stashed changes
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleUser)}
                  className={inputClass}
                >
                  {daftarRole.map((r) => (
                    <option key={r.kode} value={r.kode}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* password hanya saat tambah; untuk akun lama pakai tombol Reset di tabel */}
              {!modal.id && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter"
                    className={inputClass}
                  />
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Akun aktif</p>
                  <p className="text-xs text-slate-400">
                    Akun nonaktif tidak bisa masuk ke panel.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={aktif}
                  onClick={() => setAktif((a) => !a)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    aktif ? "bg-violet-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      aktif ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {galat && <p className="text-sm text-red-600">{galat}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setModal(null)}
                className="rounded-xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESET PASSWORD */}
      {reset && <ResetPasswordModal user={reset} onTutup={() => setReset(null)} />}
    </div>
  );
}