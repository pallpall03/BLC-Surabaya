"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Pencil,
  Plus,
  Search,
  Trash2,
  UsersRound,
  X,
  Upload,
  CheckCircle2,
  XCircle,
  MapPin,
  Mail,
  RefreshCw,
} from "lucide-react";
import {
  TimBlc,
  FormTimBlc,
  ambilTimBlc,
  simpanTimBlc,
  ubahStatusTimBlc,
  hapusTimBlc,
} from "./data";
import { ambilLokasi, Lokasi } from "../lokasi/data";

const MAKS_UKURAN = 2 * 1024 * 1024; // 2MB

// Kompres foto ke data URL sebelum dikirim
function kompresFoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ukuran = 800;
        const rasio = Math.min(1, ukuran / img.width, ukuran / img.height);
        canvas.width = img.width * rasio;
        canvas.height = img.height * rasio;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal mengolah gambar."));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => reject(new Error("Foto tidak dapat dibaca."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file foto."));
    reader.readAsDataURL(file);
  });
}

function formatTanggal(iso?: string | null): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const ii = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`;
  } catch {
    return iso;
  }
}

function getAvatarUrl(avatar?: string | null): string | null {
  if (!avatar) return null;
  if (avatar.startsWith("data:") || avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  return null;
}

export default function TimBlcAdminPage() {
  const [daftar, setDaftar] = useState<TimBlc[]>([]);
  const [daftarLokasi, setDaftarLokasi] = useState<Lokasi[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [cari, setCari] = useState("");
  const [filterStatus, setFilterStatus] = useState<"semua" | "aktif" | "nonaktif">("semua");
  const [halaman, setHalaman] = useState(1);
  const [perHalaman, setPerHalaman] = useState(10);

  // State Modal Form
  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [idUbah, setIdUbah] = useState<number | null>(null);
  const [namaLengkap, setNamaLengkap] = useState("");
  const [aktif, setAktif] = useState(true); // Ya = true, Tidak = false
  const [lokasiBlcId, setLokasiBlcId] = useState<number | "">("");
  const [avatar, setAvatar] = useState<string>("");
  const [fileFoto, setFileFoto] = useState<File | null>(null);

  // Field opsional
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("instruktur");
  const [tampilkanOpsional, setTampilkanOpsional] = useState(false);

  const [galat, setGalat] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);

  async function muatData() {
    setMemuat(true);
    try {
      const [dataTim, dataLok] = await Promise.all([
        ambilTimBlc(),
        ambilLokasi(),
      ]);
      setDaftar(dataTim);
      setDaftarLokasi(dataLok);
    } catch (e) {
      console.error("Gagal inisialisasi data:", e);
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatData();
  }, []);

  // Filter & Search
  const terfilter = useMemo(() => {
    return daftar.filter((item) => {
      // Filter status
      if (filterStatus === "aktif" && item.is_delete) return false;
      if (filterStatus === "nonaktif" && !item.is_delete) return false;

      // Filter cari
      if (cari.trim()) {
        const query = cari.toLowerCase();
        const namaCocok = item.nama_lengkap.toLowerCase().includes(query);
        const lokasiCocok = (item.nama_lokasi ?? "").toLowerCase().includes(query);
        const emailCocok = (item.email ?? "").toLowerCase().includes(query);
        return namaCocok || lokasiCocok || emailCocok;
      }
      return true;
    });
  }, [daftar, filterStatus, cari]);

  // Pagination
  const totalHalaman = Math.max(1, Math.ceil(terfilter.length / perHalaman));
  const tampil = useMemo(() => {
    const awal = (halaman - 1) * perHalaman;
    return terfilter.slice(awal, awal + perHalaman);
  }, [terfilter, halaman, perHalaman]);

  const jumlahAktif = daftar.filter((x) => !x.is_delete).length;
  const jumlahNonaktif = daftar.length - jumlahAktif;

  function bukaTambah() {
    setIdUbah(null);
    setNamaLengkap("");
    setAktif(true);
    setLokasiBlcId("");
    setAvatar("");
    setFileFoto(null);
    setEmail("");
    setPhone("");
    setRole("instruktur");
    setTampilkanOpsional(false);
    setGalat("");
    setModalTerbuka(true);
  }

  function bukaUbah(item: TimBlc) {
    setIdUbah(item.id);
    setNamaLengkap(item.nama_lengkap);
    setAktif(!item.is_delete);
    setLokasiBlcId(item.lokasi_blc_id ?? "");
    setAvatar(item.avatar ?? "");
    setFileFoto(null);
    setEmail(item.email ?? "");
    setPhone(item.phone ?? "");
    setRole(item.role ?? "instruktur");
    setTampilkanOpsional(Boolean(item.email || item.phone || (item.role && item.role !== "instruktur")));
    setGalat("");
    setModalTerbuka(true);
  }

  function handlePilihFoto(f: File | null) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setGalat("File harus berformat gambar (JPEG, PNG, GIF).");
      return;
    }
    if (f.size > MAKS_UKURAN) {
      setGalat("Ukuran foto maksimal 2 MB.");
      return;
    }
    setFileFoto(f);
    setAvatar(URL.createObjectURL(f));
    setGalat("");
  }

  async function handleSimpan(e: React.FormEvent) {
    e.preventDefault();
    if (!namaLengkap.trim()) {
      setGalat("Nama Personil wajib diisi.");
      return;
    }

    setMenyimpan(true);
    setGalat("");

    try {
      let avatarFinal = avatar;
      if (fileFoto) {
        avatarFinal = await kompresFoto(fileFoto);
      }

      const formPayload: FormTimBlc = {
        nama_lengkap: namaLengkap.trim(),
        role: role.trim() || "instruktur",
        lokasi_blc_id: lokasiBlcId === "" ? null : Number(lokasiBlcId),
        avatar: avatarFinal || null,
        is_delete: !aktif, // Aktif: Ya -> is_delete: false, Tidak -> is_delete: true
        email: email.trim() || null,
        phone: phone.trim() || null,
      };

      const res = await simpanTimBlc(formPayload, idUbah ?? undefined);
      if (res.success) {
        setModalTerbuka(false);
        await muatData();
      }
    } catch (err: any) {
      setGalat(err.message || "Gagal menyimpan data.");
    } finally {
      setMenyimpan(false);
    }
  }

  async function handleHapus(item: TimBlc) {
    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin menghapus data personil "${item.nama_lengkap}"?`
    );
    if (!konfirmasi) return;

    try {
      const berhasil = await hapusTimBlc(item.id);
      if (berhasil) {
        setDaftar((prev) => prev.filter((x) => x.id !== item.id));
      }
    } catch (err: any) {
      alert(err.message || "Gagal menghapus personil");
    }
  }

  async function handleToggleStatus(item: TimBlc) {
    const statusBaru = !item.is_delete;
    try {
      const ok = await ubahStatusTimBlc(item.id, statusBaru);
      if (ok) {
        setDaftar((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, is_delete: statusBaru } : x))
        );
      }
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status personil");
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER & BREADCRUMB */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <UsersRound className="text-emerald-600" size={28} />
            Data Tim BLC
          </h1>
          <p className="text-sm text-slate-500">
            Kelola data personil, instruktur, dan penugasan area BLC
          </p>
        </div>

        <button
          onClick={bukaTambah}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus size={18} />
          Tambah Data
        </button>
      </div>

      {/* STATISTIK RINGKAS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Personil</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{daftar.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Instruktur Aktif</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{jumlahAktif}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">Instruktur Nonaktif</p>
          <p className="mt-1 text-2xl font-bold text-rose-700">{jumlahNonaktif}</p>
        </div>
      </div>

      {/* CARD TABEL UTAMA */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TOOLBAR: Entries & Search */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Show</span>
            <select
              value={perHalaman}
              onChange={(e) => {
                setPerHalaman(Number(e.target.value));
                setHalaman(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-slate-600">entries</span>

            {/* Filter Tabs */}
            <div className="ml-4 hidden sm:flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => { setFilterStatus("semua"); setHalaman(1); }}
                className={`rounded-md px-2.5 py-1 transition ${
                  filterStatus === "semua" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => { setFilterStatus("aktif"); setHalaman(1); }}
                className={`rounded-md px-2.5 py-1 transition ${
                  filterStatus === "aktif" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => { setFilterStatus("nonaktif"); setHalaman(1); }}
                className={`rounded-md px-2.5 py-1 transition ${
                  filterStatus === "nonaktif" ? "bg-rose-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Nonaktif
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search: nama / area..."
                value={cari}
                onChange={(e) => {
                  setCari(e.target.value);
                  setHalaman(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <button
              onClick={muatData}
              title="Segarkan data"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} className={memuat ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* TABEL DATA (Persis Layout Screenshot Asli) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="w-16 px-4 py-3.5 text-center">No</th>
                <th className="px-6 py-3.5">Nama</th>
                <th className="px-6 py-3.5">Status Instruktur</th>
                <th className="px-6 py-3.5">Modified at</th>
                <th className="px-6 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memuat ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Memuat data tim BLC...
                  </td>
                </tr>
              ) : tampil.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Tidak ada data personil yang ditemukan.
                  </td>
                </tr>
              ) : (
                tampil.map((item, index) => {
                  const nomor = (halaman - 1) * perHalaman + index + 1;
                  const isAktif = !item.is_delete;

                  return (
                    <tr key={item.id} className="transition hover:bg-slate-50/80">
                      {/* NO */}
                      <td className="px-4 py-4 text-center font-medium text-slate-500">
                        {nomor}
                      </td>

                      {/* NAMA + DETAIL */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getAvatarUrl(item.avatar) ? (
                            <img
                              src={getAvatarUrl(item.avatar)!}
                              alt={item.nama_lengkap}
                              className="h-10 w-10 flex-shrink-0 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                              {item.nama_lengkap.slice(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-800">{item.nama_lengkap}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                              {item.nama_lokasi && (
                                <span className="inline-flex items-center gap-1 text-slate-600">
                                  <MapPin size={12} className="text-emerald-500" />
                                  {item.nama_lokasi}
                                </span>
                              )}
                              {item.email && (
                                <span className="inline-flex items-center gap-1 text-slate-400">
                                  <Mail size={12} />
                                  {item.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* STATUS INSTRUKTUR */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          title="Klik untuk mengubah status"
                          className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                        >
                          {isAktif ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 size={12} />
                              AKTIF
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                              <XCircle size={12} />
                              NON-AKTIF
                            </span>
                          )}
                        </button>
                      </td>

                      {/* MODIFIED AT */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">
                        {formatTanggal(item.updated_at || item.created_at)}
                      </td>

                      {/* ACTION: [ubah] [hapus] */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => bukaUbah(item)}
                            title="Ubah data personil"
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-amber-600"
                          >
                            <Pencil size={12} />
                            ubah
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHapus(item)}
                            title="Hapus data personil"
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-rose-700"
                          >
                            <Trash2 size={12} />
                            hapus
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

        {/* FOOTER & PAGINATION */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 p-4 text-xs text-slate-500 sm:flex-row sm:text-sm">
          <div>
            Showing{" "}
            {terfilter.length === 0 ? 0 : (halaman - 1) * perHalaman + 1} to{" "}
            {Math.min(halaman * perHalaman, terfilter.length)} of {terfilter.length}{" "}
            entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={halaman <= 1}
              onClick={() => setHalaman((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium transition hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((nomor) => (
              <button
                key={nomor}
                type="button"
                onClick={() => setHalaman(nomor)}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  halaman === nomor
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {nomor}
              </button>
            ))}

            <button
              type="button"
              disabled={halaman >= totalHalaman}
              onClick={() => setHalaman((p) => Math.min(totalHalaman, p + 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium transition hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL FORM (PERSIS FORM ASLI: Nama Personil, Aktif?, Lokasi Area BLC, Foto Personil) */}
      {modalTerbuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {idUbah ? "Ubah Data Personil" : "Tambah Data Personil"}
              </h2>
              <button
                type="button"
                onClick={() => setModalTerbuka(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSimpan} className="max-h-[85vh] overflow-y-auto p-6 space-y-5">
              {galat && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {galat}
                </div>
              )}

              {/* 1. NAMA PERSONIL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Personil <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Riris Eka Prasetyawati"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* 2. AKTIF ? */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Aktif ?
                </label>
                <select
                  value={aktif ? "ya" : "tidak"}
                  onChange={(e) => setAktif(e.target.value === "ya")}
                  className="w-full sm:w-1/2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="ya">Ya</option>
                  <option value="tidak">Tidak</option>
                </select>
              </div>

              {/* 3. LOKASI AREA BLC */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Lokasi Area BLC
                </label>
                <select
                  value={lokasiBlcId}
                  onChange={(e) => setLokasiBlcId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">-- Pilih --</option>
                  {daftarLokasi.map((lok) => (
                    <option key={lok.id} value={lok.id}>
                      {lok.nama_blc} {lok.area ? `(${lok.area.trim()})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. FOTO PERSONIL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Foto Personil (JPEG, PNG, GIF)
                </label>
                <div className="flex items-center gap-4">
                  {getAvatarUrl(avatar) ? (
                    <img
                      src={getAvatarUrl(avatar)!}
                      alt="Preview Foto"
                      className="h-16 w-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                      <Upload size={20} />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={(e) => handlePilihFoto(e.target.files?.[0] ?? null)}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    <p className="mt-1 text-xs text-slate-400">Maks. 2 MB (format JPG, PNG, GIF)</p>
                  </div>
                </div>
              </div>

              {/* INFORMASI TAMBAHAN (OPSIONAL) */}
              <div className="border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setTampilkanOpsional(!tampilkanOpsional)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <span>Informasi Tambahan (Opsional)</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${tampilkanOpsional ? "rotate-180" : ""}`}
                  />
                </button>

                {tampilkanOpsional && (
                  <div className="mt-3 space-y-3 rounded-xl bg-slate-50 p-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Email Personil
                      </label>
                      <input
                        type="email"
                        placeholder="contoh: personil@blc.go.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nomor Telepon / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="contoh: 08123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Role / Posisi
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500"
                      >
                        <option value="instruktur">Instruktur</option>
                        <option value="koordinator">Koordinator</option>
                        <option value="operator">Operator</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER MODAL */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalTerbuka(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={menyimpan}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  {menyimpan ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
