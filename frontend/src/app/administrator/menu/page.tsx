
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Lock,
  Pencil,
  Plus,
  Trash2,
  X,
  List,
  Search,
} from "lucide-react";

import {
  ambilMenu,
  simpanMenu,
  hapusMenu,
  type MenuData,
  type FormMenu,
} from "./data";

import { ambilIkon, daftarIkon } from "./ikon";
import { daftarRole, type RoleUser } from "../_shared/role";

// Menu penting yang tidak boleh dihapus atau dinonaktifkan
const DILINDUNGI = [
  "/administrator/menu",
  "/administrator/user_manager",
];

function dilindungi(menu: MenuData) {
  return (
    menu.role === "administrator" &&
    DILINDUNGI.includes(menu.href)
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

export default function HalamanMenu() {
  const [daftar, setDaftar] = useState<MenuData[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [tab, setTab] = useState<RoleUser>("administrator");
  const [cari, setCari] = useState("");
  const [galat, setGalat] = useState("");

  const [modal, setModal] = useState<{ id?: number } | null>(null);

  const [nama, setNama] = useState("");
  const [href, setHref] = useState("");
  const [ikon, setIkon] = useState("Home");
  const [indukId, setIndukId] = useState<number | "">("");
  const [role, setRole] = useState<RoleUser>("administrator");
  const [urutan, setUrutan] = useState(1);
  const [aktif, setAktif] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);

  // Mengambil data menu
  async function muatData() {
    try {
      setMemuat(true);
      const hasil = await ambilMenu();
      setDaftar(hasil);
    } catch {
      setGalat("Gagal mengambil data menu.");
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatData();
  }, []);

  // Menyusun menu induk dan submenu
  const baris = useMemo(() => {
    const milik = daftar.filter((m) => m.role === tab);
    const hasil: { m: MenuData; anak: boolean }[] = [];

    const induk = milik
      .filter((m) => m.indukId === null)
      .sort((a, b) => a.urutan - b.urutan);

    induk.forEach((item) => {
      hasil.push({ m: item, anak: false });

      const anak = milik
        .filter((m) => m.indukId === item.id)
        .sort((a, b) => a.urutan - b.urutan);

      anak.forEach((submenu) => {
        hasil.push({ m: submenu, anak: true });
      });
    });

    return hasil.filter(({ m }) => {
      const indukMenu = milik.find((x) => x.id === m.indukId);

      return (
        m.nama.toLowerCase().includes(cari.toLowerCase()) ||
        m.href.toLowerCase().includes(cari.toLowerCase()) ||
        (indukMenu?.nama.toLowerCase().includes(cari.toLowerCase()) ?? false)
      );
    });
  }, [daftar, tab, cari]);

  // Menghitung jumlah menu berdasarkan role
  function jumlahMenu(kode: RoleUser) {
    return daftar.filter((m) => m.role === kode).length;
  }

  // Pilihan menu induk untuk form
  const pilihanInduk = daftar.filter(
    (m) =>
      m.role === role &&
      m.indukId === null &&
      m.id !== modal?.id
  );

  // Membuka modal tambah
  function bukaTambah() {
    setNama("");
    setHref("");
    setIkon("Home");
    setIndukId("");
    setRole(tab);
    setUrutan(jumlahMenu(tab) + 1);
    setAktif(true);
    setGalat("");
    setModal({});
  }

  // Membuka modal ubah
  function bukaUbah(menu: MenuData) {
    setNama(menu.nama);
    setHref(menu.href);
    setIkon(menu.ikon);
    setIndukId(menu.indukId ?? "");
    setRole(menu.role);
    setUrutan(menu.urutan);
    setAktif(menu.aktif);
    setGalat("");
    setModal({ id: menu.id });
  }

  // Menyimpan menu
  async function handleSimpan() {
    if (!nama.trim()) {
      setGalat("Nama menu wajib diisi.");
      return;
    }

    const alamat = href.trim();

    if (alamat && !alamat.startsWith("/")) {
      setGalat("Alamat harus diawali tanda /.");
      return;
    }

    if (indukId !== "") {
      const induk = daftar.find((m) => m.id === indukId);

      if (!induk || induk.role !== role || induk.indukId !== null) {
        setGalat("Pilih menu induk yang valid.");
        return;
      }
    }

    if (modal?.id !== undefined && indukId === modal.id) {
      setGalat("Menu tidak bisa menjadi induk bagi dirinya sendiri.");
      return;
    }

    if (urutan < 1 || !Number.isInteger(urutan)) {
      setGalat("Urutan harus berupa angka bulat minimal 1.");
      return;
    }

    const dataBaru: FormMenu = {
      nama: nama.trim(),
      href: alamat,
      ikon,
      indukId: indukId === "" ? null : indukId,
      role,
      urutan,
      aktif,
    };

    try {
      setMenyimpan(true);
      setGalat("");

      const hasil = await simpanMenu(dataBaru, modal?.id);

      setDaftar((lama) =>
        modal?.id !== undefined
          ? lama.map((m) => (m.id === modal.id ? hasil : m))
          : [...lama, hasil]
      );

      setTab(role);
      setModal(null);
    } catch {
      setGalat("Gagal menyimpan menu. Silakan coba lagi.");
    } finally {
      setMenyimpan(false);
    }
  }

  // Menghapus menu
  async function handleHapus(menu: MenuData) {
    if (dilindungi(menu)) {
      window.alert("Menu ini dilindungi dan tidak bisa dihapus.");
      return;
    }

    if (daftar.some((m) => m.indukId === menu.id)) {
      window.alert("Menu ini masih memiliki submenu. Hapus submenunya terlebih dahulu.");
      return;
    }

    if (!window.confirm(`Apakah kamu yakin ingin menghapus menu "${menu.nama}"?`)) {
      return;
    }

    try {
      await hapusMenu(menu.id);
      setDaftar((lama) => lama.filter((m) => m.id !== menu.id));
    } catch {
      window.alert("Gagal menghapus menu.");
    }
  }

  // Mengaktifkan atau menonaktifkan menu
  async function handleToggle(menu: MenuData) {
    if (dilindungi(menu)) return;

    const dataBaru: FormMenu = {
      nama: menu.nama,
      href: menu.href,
      ikon: menu.ikon,
      indukId: menu.indukId,
      role: menu.role,
      urutan: menu.urutan,
      aktif: !menu.aktif,
    };

    try {
      const hasil = await simpanMenu(dataBaru, menu.id);

      setDaftar((lama) =>
        lama.map((m) => (m.id === menu.id ? hasil : m))
      );
    } catch {
      window.alert("Gagal mengubah status menu.");
    }
  }

  function tutupModal() {
    setModal(null);
    setGalat("");
  }

  return (
    <div className="space-y-5">
      <section className="card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Data Menu
            </h3>
            <p className="text-sm text-slate-400">
              Atur menu sidebar untuk tiap role
            </p>
          </div>

          <button
            onClick={bukaTambah}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
          >
            <Plus size={16} />
            Tambah Menu
          </button>
        </div>

        {/* TAB ROLE */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-6 py-3">
          {daftarRole.map((r) => {
            const jumlah = jumlahMenu(r.kode);

            return (
              <button
                key={r.kode}
                onClick={() => {
                  setTab(r.kode);
                  setCari("");
                }}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  tab === r.kode
                    ? "bg-violet-600 font-medium text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r.label}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    tab === r.kode
                      ? "bg-white/25 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {jumlah}
                </span>
              </button>
            );
          })}
        </div>

        {/* PENCARIAN */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div className="relative w-full max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari menu..."
              className={`${inputClass} pl-9`}
            />
          </div>

          <p className="text-xs text-slate-400">
            {daftar.filter((m) => m.role === tab && m.aktif).length} menu aktif
            {" "}dari {jumlahMenu(tab)} menu
          </p>
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">
          <table className="table table-row-dashed align-middle w-full min-w-[750px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4 font-semibold">Urutan</th>
                <th className="px-4 py-4 font-semibold">Menu</th>
                <th className="px-4 py-4 font-semibold">Alamat</th>
                <th className="px-4 py-4 font-semibold">Aktif</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {memuat ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Memuat data menu...
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
                      className={`transition hover:bg-slate-50 ${
                        m.aktif ? "" : "opacity-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-slate-400">
                        {m.urutan}
                      </td>

                      <td className="px-4 py-4">
                        <div className={`flex items-center gap-3 ${anak ? "pl-8" : ""}`}>
                          {anak && (
                            <span className="text-slate-300">└</span>
                          )}

                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                            <Ikon size={18} />
                          </span>

                          <span className={anak ? "text-slate-700" : "font-semibold text-slate-800"}>
                            {m.nama}
                          </span>

                          {terkunci && (
                            <Lock
                              size={13}
                              className="text-slate-400"
                              aria-label="Menu dilindungi"
                            />
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
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

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={m.aktif}
                          disabled={terkunci}
                          onClick={() => handleToggle(m)}
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

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => bukaUbah(m)}
                            className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-600 transition hover:bg-amber-100"
                          >
                            <Pencil size={14} />
                            Ubah
                          </button>

                          <button
                            onClick={() => handleHapus(m)}
                            disabled={terkunci}
                            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={14} />
                            Hapus
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

      {/* MODAL TAMBAH DAN UBAH */}
      {modal !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {modal.id ? "Ubah Menu" : "Tambah Menu"}
                </h3>
                <p className="text-xs text-slate-400">
                  Lengkapi informasi menu di bawah ini
                </p>
              </div>

              <button
                onClick={tutupModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">

              {/* NAMA DAN ROLE */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nama Menu
                  </label>
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Artikel"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as RoleUser);
                      setIndukId("");
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

              {/* ALAMAT */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Alamat Halaman
                </label>
                <input
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  placeholder="/administrator/artikel"
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  Kosongkan jika menu hanya berfungsi sebagai grup.
                </p>
              </div>

              {/* INDUK DAN URUTAN */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Menu Induk
                  </label>
                  <select
                    value={indukId}
                    onChange={(e) =>
                      setIndukId(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">Menu utama</option>
                    {pilihanInduk.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Urutan
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={urutan}
                    onChange={(e) =>
                      setUrutan(Number(e.target.value) || 1)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* IKON */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pilih Ikon
                </label>

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

              {/* STATUS */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Menu Aktif
                  </p>
                  <p className="text-xs text-slate-400">
                    Menu nonaktif tidak ditampilkan di sidebar.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={aktif}
                  onClick={() => setAktif((sebelumnya) => !sebelumnya)}
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

              {galat && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {galat}
                </div>
              )}
            </div>

            {/* TOMBOL MODAL */}
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={tutupModal}
                disabled={menyimpan}
                className="rounded-xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-200"
              >
                Batal
              </button>

              <button
                onClick={handleSimpan}
                disabled={menyimpan}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
              >
                {menyimpan ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
