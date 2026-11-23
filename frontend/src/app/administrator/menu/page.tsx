"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock, Pencil, Plus, Trash2, X, List } from "lucide-react";
import { ambilMenu, simpanMenu, hapusMenu, type MenuData } from "@/lib/menu";
import { daftarRole, type RoleUser } from "@/lib/password";
import { ambilIkon, daftarIkon } from "@/menu/ikon";

// menu yang tidak boleh dihapus/dinonaktifkan, supaya admin tidak mengunci dirinya sendiri
const DILINDUNGI = [
  "/administrator/menu",
  "/administrator/user-manager",
];
const dilindungi = (m: MenuData) =>
  m.role === "administrator" && DILINDUNGI.includes(m.href);

export default function HalamanMenu() {
  const [daftar, setDaftar] = useState<MenuData[]>([]);
  const [memuat, setMemuat] = useState<boolean>(true);
  const [tab, setTab] = useState<RoleUser>("administrator");

  // modal tambah/ubah: null = tertutup, {} = tambah, {id} = ubah
  const [modal, setModal] = useState<{ id?: number } | null>(null);
  const [nama, setNama] = useState("");
  const [href, setHref] = useState("");
  const [ikon, setIkon] = useState("Circle");
  const [indukId, setIndukId] = useState<number | "">("");
  const [role, setRole] = useState<RoleUser>("administrator");
  const [urutan, setUrutan] = useState<number>(1);
  const [aktif, setAktif] = useState<boolean>(true);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    ambilMenu()
      .then(setDaftar)
      .finally(() => setMemuat(false));
  }, []);

  // susun baris berhierarki untuk role yang dipilih: induk, lalu submenunya
  const baris = useMemo(() => {
    const milik = daftar.filter((m) => m.role === tab);
    const urut = (a: MenuData, b: MenuData) => a.urutan - b.urutan;
    const hasil: { m: MenuData; anak: boolean }[] = [];
    milik
      .filter((m) => m.indukId === null)
      .sort(urut)
      .forEach((induk) => {
        hasil.push({ m: induk, anak: false });
        milik
          .filter((x) => x.indukId === induk.id)
          .sort(urut)
          .forEach((x) => hasil.push({ m: x, anak: true }));
      });
    return hasil;
  }, [daftar, tab]);

  // pilihan induk di form: menu utama dari role yang dipilih (kecuali dirinya sendiri)
  const pilihanInduk = daftar.filter(
    (m) => m.role === role && m.indukId === null && m.id !== modal?.id
  );

  function bukaTambah() {
    setNama("");
    setHref("");
    setIkon("Circle");
    setIndukId("");
    setRole(tab);
    setUrutan(daftar.filter((m) => m.role === tab).length + 1);
    setAktif(true);
    setGalat("");
    setModal({});
  }

  function bukaUbah(m: MenuData) {
    setNama(m.nama);
    setHref(m.href);
    setIkon(m.ikon);
    setIndukId(m.indukId ?? "");
    setRole(m.role);
    setUrutan(m.urutan);
    setAktif(m.aktif);
    setGalat("");
    setModal({ id: m.id });
  }

  async function handleSimpan() {
    const id = modal?.id;
    const alamat = href.trim();

    if (!nama.trim()) return setGalat("Nama menu wajib diisi.");
    if (alamat && !alamat.startsWith("/")) {
      return setGalat("Alamat harus diawali tanda / (contoh: /dashboard/administrator/faq).");
    }

    const hasilSimpan = await simpanMenu(
      {
        nama: nama.trim(),
        href: alamat,
        ikon,
        indukId: indukId === "" ? null : indukId,
        role,
        urutan,
        aktif,
      },
      id
    );
    setDaftar((lama) =>
      id ? lama.map((m) => (m.id === id ? hasilSimpan : m)) : [...lama, hasilSimpan]
    );
    // pindah ke tab role yang baru dipilih supaya hasilnya langsung terlihat
    setTab(role);
    setModal(null);
  }

  async function handleHapus(m: MenuData) {
    if (daftar.some((x) => x.indukId === m.id)) {
      window.alert("Menu ini masih punya submenu. Hapus submenunya dulu.");
      return;
    }
    if (!window.confirm(`Hapus menu "${m.nama}"?`)) return;
    await hapusMenu(m.id);
    setDaftar((lama) => lama.filter((x) => x.id !== m.id));
  }

  async function handleToggle(m: MenuData) {
    const baru = { ...m, aktif: !m.aktif };
    await simpanMenu(baru, m.id);
    setDaftar((lama) => lama.map((x) => (x.id === m.id ? baru : x)));
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  return (
    <div>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* BAR ATAS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Data Menu</h3>
            <p className="text-sm text-slate-400">Atur menu sidebar untuk tiap role</p>
          </div>
          <button
            onClick={bukaTambah}
            className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
          >
            <Plus size={16} /> Tambah Menu
          </button>
        </div>

        {/* TAB PER ROLE */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-6 py-3">
          {daftarRole.map((r) => {
            const jumlah = daftar.filter((m) => m.role === r.kode).length;
            return (
              <button
                key={r.kode}
                onClick={() => setTab(r.kode)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm transition ${
                  tab === r.kode
                    ? "bg-violet-600 font-medium text-white shadow-sm shadow-violet-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r.label}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    tab === r.kode ? "bg-white/25" : "bg-white text-slate-500"
                  }`}
                >
                  {jumlah}
                </span>
              </button>
            );
          })}
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-semibold">Urutan</th>
                <th className="px-4 py-3 font-semibold">Menu</th>
                <th className="px-4 py-3 font-semibold">Alamat</th>
                <th className="px-4 py-3 font-semibold">Aktif</th>
                <th className="px-6 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memuat ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : baris.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <List size={36} />
                      <p>Belum ada menu untuk role ini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                baris.map(({ m, anak }) => {
                  const Ikon = ambilIkon(m.ikon);
                  const terkunci = dilindungi(m);
                  return (
                    <tr
                      key={m.id}
                      className={`transition hover:bg-slate-50 ${m.aktif ? "" : "opacity-50"}`}
                    >
                      <td className="px-6 py-3.5 text-slate-400">{m.urutan}</td>
                      <td className="px-4 py-3.5">
                        <div className={`flex items-center gap-3 ${anak ? "pl-8" : ""}`}>
                          {anak && <span className="text-slate-300">└</span>}
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                            <Ikon size={18} />
                          </span>
                          <span className={anak ? "text-slate-700" : "font-semibold text-slate-800"}>
                            {m.nama}
                          </span>
                          {terkunci && (
                            <Lock size={13} className="text-slate-400" aria-label="Dilindungi" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {m.href ? (
                          <code className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            {m.href}
                          </code>
                        ) : (
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                            Grup (tanpa halaman)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={m.aktif}
                          disabled={terkunci}
                          onClick={() => handleToggle(m)}
                          title={terkunci ? "Menu ini dilindungi" : undefined}
                          className={`relative h-6 w-11 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            m.aktif ? "bg-violet-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                              m.aktif ? "left-[22px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => bukaUbah(m)}
                            className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-100"
                          >
                            <Pencil size={14} /> Ubah
                          </button>
                          <button
                            onClick={() => handleHapus(m)}
                            disabled={terkunci}
                            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL TAMBAH / UBAH */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h4 className="font-semibold text-slate-800">
                {modal.id ? "Ubah Menu" : "Tambah Menu"}
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nama menu
                  </label>
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as RoleUser);
                      setIndukId(""); // induk milik role lama tidak berlaku lagi
                    }}
                    className={inputClass}
                  >
                    {daftarRole.map((r) => (
                      <option key={r.kode} value={r.kode}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Alamat halaman
                </label>
                <input
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  placeholder="/dashboard/administrator/faq"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Kosongkan kalau menu ini hanya induk (grup) untuk submenu.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Induk menu
                  </label>
                  <select
                    value={indukId}
                    onChange={(e) =>
                      setIndukId(e.target.value ? Number(e.target.value) : "")
                    }
                    className={inputClass}
                  >
                    <option value="">Menu utama (tanpa induk)</option>
                    {pilihanInduk.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Urutan</label>
                  <input
                    type="number"
                    min={1}
                    value={urutan}
                    onChange={(e) => setUrutan(Number(e.target.value) || 1)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* PEMILIH IKON */}
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Ikon</p>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(daftarIkon).map(([kode, IkonItem]) => (
                    <button
                      key={kode}
                      type="button"
                      title={kode}
                      onClick={() => setIkon(kode)}
                      className={`flex h-10 items-center justify-center rounded-lg border transition ${
                        ikon === kode
                          ? "border-violet-500 bg-violet-50 text-violet-600"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <IkonItem size={18} />
                    </button>
                  ))}
                </div>
              </div>

              {/* SAKLAR AKTIF */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Menu aktif</p>
                  <p className="text-xs text-slate-400">
                    Menu nonaktif tidak tampil di sidebar.
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
    </div>
  );
}