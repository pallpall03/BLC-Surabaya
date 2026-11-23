"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, KeyRound, RefreshCw, X } from "lucide-react";
import { resetPasswordUser, type User } from "./data";
import { daftarRole } from "../_shared/role";

// password acak 12 karakter, minimal satu huruf besar, kecil, angka, dan simbol
function buatPassword(panjang = 12) {
  const besar = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const kecil = "abcdefghijkmnopqrstuvwxyz";
  const angka = "23456789";
  const simbol = "!@#$%&*?";
  const semua = besar + kecil + angka + simbol;
  const acakInt = (maks: number) => crypto.getRandomValues(new Uint32Array(1))[0] % maks;
  const ambil = (s: string) => s[acakInt(s.length)];

  const hasil = [ambil(besar), ambil(kecil), ambil(angka), ambil(simbol)];
  while (hasil.length < panjang) hasil.push(ambil(semua));

  for (let i = hasil.length - 1; i > 0; i--) {
    const j = acakInt(i + 1);
    [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
  }
  return hasil.join("");
}

export default function ResetPasswordModal({
  user,
  onTutup,
}: {
  user: User;
  onTutup: () => void;
}) {
  const [baru, setBaru] = useState("");
  const [ulang, setUlang] = useState("");
  const [lihat, setLihat] = useState<boolean>(false);
  const [wajibGanti, setWajibGanti] = useState<boolean>(true);
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState<boolean>(false);
  const [hasil, setHasil] = useState<string | null>(null); // diisi setelah berhasil
  const [tersalin, setTersalin] = useState<boolean>(false);

  const namaRole = daftarRole.find((r) => r.kode === user.role)?.label ?? user.role;

  const skor = [
    baru.length >= 8,
    /[A-Z]/.test(baru),
    /[0-9]/.test(baru),
    /[^A-Za-z0-9]/.test(baru),
  ].filter(Boolean).length;
  const labelKuat = ["Sangat lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"][skor];
  const warnaBar = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"][skor];

  function handleAcak() {
    const p = buatPassword();
    setBaru(p);
    setUlang(p);
    setLihat(true);
    setGalat("");
  }

  async function salin(teks: string) {
    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      setGalat("Gagal menyalin. Salin manual dari kotak password.");
    }
  }

  async function handleSimpan() {
    if (baru.length < 8) return setGalat("Password minimal 8 karakter.");
    if (baru !== ulang) return setGalat("Konfirmasi password tidak sama.");

    setGalat("");
    setProses(true);
    try {
      await resetPasswordUser(user.id, baru, wajibGanti);
      setHasil(baru); // tampilkan sekali agar bisa disalin
      setBaru("");
      setUlang("");
    } catch {
      setGalat("Gagal mereset password. Coba lagi.");
    } finally {
      setProses(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h4 className="flex items-center gap-2 font-semibold text-slate-800">
            <KeyRound size={18} className="text-violet-600" /> Reset Password
          </h4>
          <button
            onClick={onTutup}
            aria-label="Tutup"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-6 mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-600">
            {user.nickname.charAt(0).toUpperCase()}
          </span>
          <div className="leading-tight">
            <p className="font-semibold text-slate-800">{user.nickname}</p>
            <p className="text-xs text-slate-400">
              {user.username} · {namaRole}
            </p>
          </div>
        </div>

        {hasil === null ? (
          <>
            <div className="space-y-4 p-6">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Password baru</label>
                  <button
                    type="button"
                    onClick={handleAcak}
                    className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700"
                  >
                    <RefreshCw size={12} /> Buat otomatis
                  </button>
                </div>
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
                    <p className="mt-1 text-xs text-slate-400">Kekuatan: {labelKuat}</p>
                  </div>
                )}
              </div>

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

              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={wajibGanti}
                  onChange={(e) => setWajibGanti(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-violet-600"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-700">
                    Wajib ganti password saat login berikutnya
                  </span>
                  <span className="block text-xs text-slate-400">
                    Disarankan, supaya password sementara ini tidak dipakai terus.
                  </span>
                </span>
              </label>

              {galat && <p className="text-sm text-red-600">{galat}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={onTutup}
                className="rounded-xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                disabled={proses}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
              >
                {proses ? "Menyimpan..." : "Reset Password"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <Check size={18} /> Password berhasil direset.
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-slate-700">Password baru</p>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 pl-4">
                  <code className="flex-1 break-all font-mono text-sm text-slate-800">{hasil}</code>
                  <button
                    onClick={() => salin(hasil)}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-700"
                  >
                    {tersalin ? <Check size={14} /> : <Copy size={14} />}
                    {tersalin ? "Tersalin" : "Salin"}
                  </button>
                </div>
              </div>

              <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
                Salin atau catat sekarang. Setelah jendela ini ditutup, password tidak ditampilkan
                lagi. Sampaikan ke pemilik akun lewat jalur yang aman, bukan lewat grup chat.
              </p>
              {galat && <p className="text-sm text-red-600">{galat}</p>}
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={onTutup}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Selesai
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}