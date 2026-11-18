"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import {
  ambilUserPerRole,
  daftarRole,
  resetPassword,
  type AkunUser,
  type RoleUser,
} from "@/lib/password";

export default function HalamanUbahPassword() {
  const [role, setRole] = useState<RoleUser>("administrator");
  const [users, setUsers] = useState<AkunUser[]>([]);
  const [idUser, setIdUser] = useState<number | "">("");
  const [baru, setBaru] = useState("");
  const [ulang, setUlang] = useState("");
  const [lihat, setLihat] = useState<boolean>(false);
  const [galat, setGalat] = useState("");
  const [sukses, setSukses] = useState("");
  const [proses, setProses] = useState<boolean>(false);

  // ambil daftar pengguna setiap kali role diganti
  useEffect(() => {
    ambilUserPerRole(role).then(setUsers);
    setIdUser("");
  }, [role]);

  // kekuatan password: 4 syarat sederhana
  const skor = [
    baru.length >= 8,
    /[A-Z]/.test(baru),
    /[0-9]/.test(baru),
    /[^A-Za-z0-9]/.test(baru),
  ].filter(Boolean).length;
  const labelKuat = ["Sangat lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"][skor];
  const warnaBar = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"][skor];

  async function handleSimpan() {
    setSukses("");
    const user = users.find((u) => u.id === idUser);

    if (!user) return setGalat("Pilih pengguna dulu.");
    if (baru.length < 8) return setGalat("Password minimal 8 karakter.");
    if (baru !== ulang) return setGalat("Konfirmasi password tidak sama.");

    setGalat("");
    setProses(true);
    await resetPassword(user.id, baru);
    setProses(false);

    setSukses(`Password ${user.nama} berhasil diubah.`);
    setBaru("");
    setUlang("");
    setIdUser("");
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  return (
    <div className="max-w-2xl space-y-5">
      {sukses && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={18} /> {sukses}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
          <KeyRound size={18} className="text-violet-600" />
          <h3 className="font-semibold text-slate-800">Ubah Password Pengguna</h3>
        </div>

        <div className="space-y-5 p-6">
          {/* PILIH ROLE */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Role</p>
            <div className="flex flex-wrap gap-2">
              {daftarRole.map((r) => (
                <button
                  key={r.kode}
                  onClick={() => setRole(r.kode)}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${
                    role === r.kode
                      ? "bg-violet-600 font-medium text-white shadow-sm shadow-violet-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* PILIH PENGGUNA */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Pengguna</label>
            <select
              value={idUser}
              onChange={(e) => setIdUser(e.target.value ? Number(e.target.value) : "")}
              className={inputClass}
            >
              <option value="">
                {users.length === 0 ? "Belum ada pengguna di role ini" : "Pilih pengguna..."}
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* PASSWORD BARU */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password baru</label>
            <div className="relative">
              <input
                type={lihat ? "text" : "password"}
                value={baru}
                onChange={(e) => setBaru(e.target.value)}
                autoComplete="new-password"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setLihat((l) => !l)}
                aria-label="Tampilkan atau sembunyikan password"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {lihat ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {baru && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className={`h-1.5 flex-1 rounded-full ${n <= skor ? warnaBar : "bg-slate-200"}`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Kekuatan: {labelKuat}. Gunakan huruf besar, angka, dan simbol.
                </p>
              </div>
            )}
          </div>

          {/* ULANGI PASSWORD */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Ulangi password baru
            </label>
            <input
              type={lihat ? "text" : "password"}
              value={ulang}
              onChange={(e) => setUlang(e.target.value)}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>

          {galat && <p className="text-sm text-red-600">{galat}</p>}
        </div>

        <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={handleSimpan}
            disabled={proses}
            className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
          >
            {proses ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>
      </section>
    </div>
  );
}