"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Lock, Pencil, Save, ShieldCheck, Users, X } from "lucide-react";
import {
  ambilHakAkses,
  ambilModul,
  daftarAksi,
  simpanHakAkses,
  type Aksi,
  type HakAkses,
  type IzinRole,
  type Modul,
} from "@/lib/hak-akses";
import { ambilRole, simpanDeskripsiRole, type InfoRole } from "@/lib/role";
import { ambilUser, type User } from "@/lib/user";
import type { RoleUser } from "@/lib/password";

// dua daftar hak dianggap sama kalau isinya sama (urutan tidak penting)
function samaSet(a: Aksi[] = [], b: Aksi[] = []) {
  return a.length === b.length && a.every((x) => b.includes(x));
}

export default function HalamanRoleHakAkses() {
  const [modul, setModul] = useState<Modul[]>([]);
  const [semua, setSemua] = useState<HakAkses | null>(null);
  const [roles, setRoles] = useState<InfoRole[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<RoleUser>("operator");
  const [draft, setDraft] = useState<IzinRole>({});
  const [memuat, setMemuat] = useState<boolean>(true);
  const [menyimpan, setMenyimpan] = useState<boolean>(false);
  const [pesan, setPesan] = useState("");

  // modal ubah deskripsi role
  const [ubahRole, setUbahRole] = useState<InfoRole | null>(null);
  const [teksDeskripsi, setTeksDeskripsi] = useState("");

  useEffect(() => {
    Promise.all([ambilModul(), ambilHakAkses(), ambilRole(), ambilUser()])
      .then(([m, h, r, u]) => {
        setModul(m);
        setSemua(h);
        setRoles(r);
        setUsers(u);
      })
      .finally(() => setMemuat(false));
  }, []);

  // draft = salinan hak role yang sedang dibuka, yang bisa diutak-atik sebelum disimpan
  useEffect(() => {
    if (semua) setDraft(structuredClone(semua[role] ?? {}));
  }, [semua, role]);

  const infoAktif = roles.find((r) => r.kode === role);
  const terkunci = role === "administrator";
  const asli = semua?.[role] ?? {};
  const berubah = !terkunci && modul.some((m) => !samaSet(asli[m.kode], draft[m.kode]));

  // kelompokkan menu per grup, urutan sesuai daftar
  const grup = useMemo(() => {
    const peta = new Map<string, Modul[]>();
    modul.forEach((m) => peta.set(m.grup, [...(peta.get(m.grup) ?? []), m]));
    return [...peta.entries()];
  }, [modul]);

  function punya(kode: string, aksi: Aksi) {
    return terkunci ? true : !!draft[kode]?.includes(aksi);
  }

  // Tambah/Ubah/Hapus otomatis menyalakan Lihat; mematikan Lihat membersihkan hak lain di baris itu.
  function toggle(kode: string, aksi: Aksi) {
    if (terkunci) return;
    setDraft((d) => {
      const s = new Set(d[kode] ?? []);
      if (s.has(aksi)) {
        s.delete(aksi);
        if (aksi === "lihat") s.clear();
      } else {
        s.add(aksi);
        if (aksi !== "lihat") s.add("lihat");
      }
      return { ...d, [kode]: [...s] };
    });
  }

  function barisPenuh(m: Modul) {
    return m.aksi.every((a) => punya(m.kode, a));
  }

  function toggleBaris(m: Modul) {
    if (terkunci) return;
    setDraft((d) => ({ ...d, [m.kode]: barisPenuh(m) ? [] : [...m.aksi] }));
  }

  function kolomPenuh(aksi: Aksi) {
    const terkait = modul.filter((m) => m.aksi.includes(aksi));
    return terkait.length > 0 && terkait.every((m) => punya(m.kode, aksi));
  }

  function toggleKolom(aksi: Aksi) {
    if (terkunci) return;
    const nyalakan = !kolomPenuh(aksi);
    setDraft((d) => {
      const baru: IzinRole = { ...d };
      modul
        .filter((m) => m.aksi.includes(aksi))
        .forEach((m) => {
          const s = new Set(baru[m.kode] ?? []);
          if (nyalakan) {
            s.add(aksi);
            if (aksi !== "lihat") s.add("lihat");
          } else {
            s.delete(aksi);
            if (aksi === "lihat") s.clear();
          }
          baru[m.kode] = [...s];
        });
      return baru;
    });
  }

  function jumlahLihat(r: RoleUser) {
    if (r === "administrator") return modul.length;
    const sumber = r === role ? draft : semua?.[r] ?? {};
    return modul.filter((m) => sumber[m.kode]?.includes("lihat")).length;
  }

  function pilihRole(r: RoleUser) {
    if (r === role) return;
    if (berubah && !window.confirm("Perubahan belum disimpan akan hilang. Lanjutkan?")) return;
    setRole(r);
  }

  async function handleSimpan() {
    setMenyimpan(true);
    await simpanHakAkses(role, draft);
    setSemua((s) => (s ? { ...s, [role]: structuredClone(draft) } : s));
    setMenyimpan(false);

    setPesan(`Hak akses ${infoAktif?.nama ?? role} berhasil disimpan.`);
    setTimeout(() => setPesan(""), 3000);
  }

  function bukaUbahRole(r: InfoRole) {
    setTeksDeskripsi(r.deskripsi);
    setUbahRole(r);
  }

  async function handleSimpanDeskripsi() {
    if (!ubahRole) return;
    await simpanDeskripsiRole(ubahRole.kode, teksDeskripsi.trim());
    setRoles((lama) =>
      lama.map((r) => (r.kode === ubahRole.kode ? { ...r, deskripsi: teksDeskripsi.trim() } : r))
    );
    setUbahRole(null);
  }

  return (
    <div className="space-y-5">
      {pesan && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={18} /> {pesan}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* ============ KIRI: DAFTAR ROLE ============ */}
        <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <Users size={18} className="text-violet-600" />
            <h3 className="font-semibold text-slate-800">Role</h3>
            <span className="ml-auto rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
              {roles.length}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
            {roles.map((r) => {
              const dipilih = r.kode === role;
              const jumlahAkun = users.filter((u) => u.role === r.kode).length;
              return (
                <div
                  key={r.kode}
                  onClick={() => pilihRole(r.kode)}
                  className={`min-w-[230px] cursor-pointer rounded-xl border p-4 transition lg:min-w-0 ${
                    dipilih
                      ? "border-violet-500 bg-violet-50 shadow-sm shadow-violet-100"
                      : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold ${dipilih ? "text-violet-700" : "text-slate-800"}`}>
                      {r.nama}
                    </p>
                    {r.kode === "administrator" && <Lock size={13} className="text-slate-400" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        bukaUbahRole(r);
                      }}
                      aria-label={`Ubah deskripsi ${r.nama}`}
                      className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-violet-600"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{r.deskripsi}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">
                    <span className="rounded-full bg-white px-2 py-0.5 text-slate-600 ring-1 ring-slate-200">
                      {jumlahAkun} akun
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-slate-600 ring-1 ring-slate-200">
                      {jumlahLihat(r.kode)}/{modul.length} menu
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ============ KANAN: HAK AKSES ROLE TERPILIH ============ */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
            <ShieldCheck size={20} className="text-violet-600" />
            <div>
              <h3 className="font-semibold text-slate-800">
                Hak Akses: {infoAktif?.nama ?? "-"}
              </h3>
              <p className="text-sm text-slate-400">
                Centang apa yang boleh dilakukan role ini di tiap menu
              </p>
            </div>
          </div>

          {terkunci && (
            <div className="flex items-start gap-2 border-b border-slate-100 bg-violet-50 px-6 py-3 text-sm text-violet-700">
              <Lock size={16} className="mt-0.5 shrink-0" />
              Administrator selalu punya akses penuh dan tidak bisa diubah, supaya admin tidak
              mengunci dirinya sendiri dari panel.
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3 font-semibold">Menu</th>
                  {daftarAksi.map((a) => (
                    <th key={a.kode} className="px-3 py-3 text-center font-semibold">
                      <label className="flex cursor-pointer flex-col items-center gap-1.5">
                        {a.label}
                        <input
                          type="checkbox"
                          checked={terkunci || kolomPenuh(a.kode)}
                          disabled={terkunci}
                          onChange={() => toggleKolom(a.kode)}
                          aria-label={`Pilih semua ${a.label}`}
                          className="h-4 w-4 cursor-pointer accent-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </label>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center font-semibold">Semua</th>
                </tr>
              </thead>

              {memuat ? (
                <tbody>
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Memuat data...
                    </td>
                  </tr>
                </tbody>
              ) : (
                grup.map(([namaGrup, daftar]) => (
                  <tbody key={namaGrup} className="divide-y divide-slate-100">
                    <tr className="bg-slate-50/70">
                      <td
                        colSpan={6}
                        className="px-6 py-2 text-xs font-semibold uppercase tracking-widest text-violet-600"
                      >
                        {namaGrup}
                      </td>
                    </tr>
                    {daftar.map((m) => (
                      <tr key={m.kode} className="transition hover:bg-slate-50">
                        <td className="px-6 py-3 font-medium text-slate-700">{m.nama}</td>
                        {daftarAksi.map((a) => (
                          <td key={a.kode} className="px-3 py-3 text-center">
                            {m.aksi.includes(a.kode) ? (
                              <input
                                type="checkbox"
                                checked={punya(m.kode, a.kode)}
                                disabled={terkunci}
                                onChange={() => toggle(m.kode, a.kode)}
                                aria-label={`${a.label} ${m.nama}`}
                                className="h-4 w-4 cursor-pointer accent-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
                              />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={terkunci || barisPenuh(m)}
                            disabled={terkunci}
                            onChange={() => toggleBaris(m)}
                            aria-label={`Semua hak ${m.nama}`}
                            className="h-4 w-4 cursor-pointer accent-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))
              )}
            </table>
          </div>
        </section>
      </div>

      {/* BAR SIMPAN (muncul kalau ada perubahan) */}
      {berubah && (
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-white/95 px-5 py-3 shadow-xl shadow-violet-200/50 backdrop-blur">
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
            Ada perubahan yang belum disimpan
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setDraft(structuredClone(asli))}
              className="rounded-xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              onClick={handleSimpan}
              disabled={menyimpan}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
            >
              <Save size={16} /> {menyimpan ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL UBAH DESKRIPSI ROLE */}
      {ubahRole && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h4 className="font-semibold text-slate-800">Ubah Deskripsi Role</h4>
              <button
                onClick={() => setUbahRole(null)}
                aria-label="Tutup"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className="mb-1 text-sm font-medium text-slate-700">Nama role</p>
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  {ubahRole.nama} <span className="text-xs">(tetap, dipakai sebagai kode sistem)</span>
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi</label>
                <textarea
                  value={teksDeskripsi}
                  onChange={(e) => setTeksDeskripsi(e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
                <p className="mt-1 text-right text-xs text-slate-400">{teksDeskripsi.length}/160</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setUbahRole(null)}
                className="rounded-xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleSimpanDeskripsi}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}