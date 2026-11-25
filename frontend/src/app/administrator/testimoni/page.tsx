
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Clock,
  CheckCircle,
  MapPin,
  Star,
} from "lucide-react";

import {
  ambilTestimoni,
  simpanTestimoni,
  hapusTestimoni,
  ubahStatusTestimoni,
  type Testimoni,
  type FormTestimoni,
  type StatusTestimoni,
} from "./data";

const formAwal: FormTestimoni = {
  nama: "",
  email: "",
  phone: "",
  isi: "",
  status: "aktif",
};

export default function TestimoniPage() {
  const [data, setData] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState(true);
  const [kataKunci, setKataKunci] = useState("");
  const [tabStatus, setTabStatus] = useState<"semua" | StatusTestimoni>("semua");
  const [jumlahData, setJumlahData] = useState(10);
  const [halaman, setHalaman] = useState(1);

  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [modeEdit, setModeEdit] = useState(false);
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const [form, setForm] = useState<FormTestimoni>(formAwal);
  const [pesanError, setPesanError] = useState("");
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);

  async function muatData() {
    setLoading(true);
    try {
      const hasil = await ambilTestimoni();
      setData(Array.isArray(hasil) ? hasil : []);
    } catch (e) {
      console.error("Gagal muat testimoni:", e);
      setPesanError("Gagal memuat data testimoni dari server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    muatData();

    const perbarui = () => muatData();
    window.addEventListener("testimoni-berubah", perbarui);
    return () => {
      window.removeEventListener("testimoni-berubah", perbarui);
    };
  }, []);

  const totalPending = useMemo(
    () => data.filter((item) => item.status === "pending").length,
    [data]
  );
  const totalAktif = useMemo(
    () => data.filter((item) => item.status === "aktif").length,
    [data]
  );
  const totalNonaktif = useMemo(
    () => data.filter((item) => item.status === "nonaktif").length,
    [data]
  );

  const dataFilter = useMemo(() => {
    const kata = kataKunci.toLowerCase().trim();
    const daftar = Array.isArray(data) ? data : [];

    return daftar.filter((item) => {
      const matchKata =
        item.nama.toLowerCase().includes(kata) ||
        item.isi.toLowerCase().includes(kata) ||
        (item.namaLokasi && item.namaLokasi.toLowerCase().includes(kata)) ||
        (item.email && item.email.toLowerCase().includes(kata));

      const matchStatus =
        tabStatus === "semua" ? true : item.status === tabStatus;

      return matchKata && matchStatus;
    });
  }, [data, kataKunci, tabStatus]);

  const totalHalaman = Math.max(
    1,
    Math.ceil(dataFilter.length / jumlahData)
  );

  const dataTampil = dataFilter.slice(
    (halaman - 1) * jumlahData,
    halaman * jumlahData
  );

  const nomorAwal =
    dataFilter.length === 0 ? 0 : (halaman - 1) * jumlahData + 1;

  const nomorAkhir = Math.min(
    halaman * jumlahData,
    dataFilter.length
  );

  function bukaTambah() {
    setModeEdit(false);
    setIdEdit(null);
    setForm(formAwal);
    setPesanError("");
    setModalTerbuka(true);
  }

  function bukaEdit(item: Testimoni) {
    setModeEdit(true);
    setIdEdit(item.id);
    setForm({
      nama: item.nama,
      email: item.email || "",
      phone: item.phone || "",
      isi: item.isi,
      status: item.status,
    });
    setPesanError("");
    setModalTerbuka(true);
  }

  function tutupModal() {
    setModalTerbuka(false);
    setForm(formAwal);
    setIdEdit(null);
    setPesanError("");
  }

  async function handleSimpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.nama.trim() || !form.isi.trim()) {
      setPesanError("Nama dan isi testimoni wajib diisi.");
      return;
    }

    setSedangMenyimpan(true);
    setPesanError("");
    try {
      const res = await simpanTestimoni(
        {
          nama: form.nama.trim(),
          email: form.email?.trim() || undefined,
          phone: form.phone?.trim() || undefined,
          isi: form.isi.trim(),
          status: form.status,
        },
        idEdit ?? undefined
      );

      if (res.error) {
        setPesanError(res.error);
        return;
      }

      await muatData();
      tutupModal();
    } catch {
      setPesanError("Gagal menyimpan data testimoni.");
    } finally {
      setSedangMenyimpan(false);
    }
  }

  async function handleHapus(item: Testimoni) {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus testimoni dari "${item.nama}"?`
    );

    if (!yakin) return;

    await hapusTestimoni(item.id);
    await muatData();

    if (dataTampil.length === 1 && halaman > 1) {
      setHalaman((prev) => prev - 1);
    }
  }

  async function handleUbahStatus(item: Testimoni, targetStatus: StatusTestimoni) {
    const teksPesan =
      targetStatus === "aktif"
        ? `Tayangkan testimoni dari "${item.nama}" di website?`
        : targetStatus === "nonaktif"
        ? `Nonaktifkan testimoni dari "${item.nama}"?`
        : `Ubah status testimoni dari "${item.nama}" menjadi menunggu review?`;

    if (!window.confirm(teksPesan)) return;

    await ubahStatusTestimoni(item.id, targetStatus);
    await muatData();
  }

  function formatTanggal(tanggal?: string) {
    if (!tanggal) return "-";
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function ubahKataKunci(value: string) {
    setKataKunci(value);
    setHalaman(1);
  }

  const tombolHalaman = Array.from(
    { length: totalHalaman },
    (_, i) => i + 1
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER HALAMAN */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Data Website</span>
            <span>/</span>
            <span className="font-medium text-gray-800">Testimoni</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-800">
            Data Testimoni
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola testimoni peserta dan kurasi konten yang tayang di landing page.
          </p>
        </div>

        <button
          type="button"
          onClick={bukaTambah}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          <Plus size={18} />
          Tambah Testimoni
        </button>
      </div>

      {/* RINGKASAN DATA */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div
          onClick={() => { setTabStatus("semua"); setHalaman(1); }}
          className={`cursor-pointer rounded-xl border p-4 shadow-sm transition ${
            tabStatus === "semua"
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Testimoni</p>
            <MessageSquareQuote className="text-blue-600" size={22} />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">{data.length}</p>
        </div>

        <div
          onClick={() => { setTabStatus("pending"); setHalaman(1); }}
          className={`cursor-pointer rounded-xl border p-4 shadow-sm transition ${
            tabStatus === "pending"
              ? "border-amber-500 bg-amber-50/50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-amber-700">Menunggu Review</p>
            <Clock className="text-amber-500" size={22} />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">{totalPending}</p>
        </div>

        <div
          onClick={() => { setTabStatus("aktif"); setHalaman(1); }}
          className={`cursor-pointer rounded-xl border p-4 shadow-sm transition ${
            tabStatus === "aktif"
              ? "border-green-500 bg-green-50/50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-green-700">Tayang (Aktif)</p>
            <CheckCircle className="text-green-600" size={22} />
          </div>
          <p className="mt-2 text-2xl font-bold text-green-600">{totalAktif}</p>
        </div>

        <div
          onClick={() => { setTabStatus("nonaktif"); setHalaman(1); }}
          className={`cursor-pointer rounded-xl border p-4 shadow-sm transition ${
            tabStatus === "nonaktif"
              ? "border-gray-500 bg-gray-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Nonaktif / Arsip</p>
            <EyeOff className="text-gray-500" size={22} />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-600">{totalNonaktif}</p>
        </div>
      </div>

      {/* FILTER TAB & SEARCH */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          {/* TABS STATUS */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => { setTabStatus("semua"); setHalaman(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                tabStatus === "semua"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua ({data.length})
            </button>
            <button
              type="button"
              onClick={() => { setTabStatus("pending"); setHalaman(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                tabStatus === "pending"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Menunggu Review ({totalPending})
            </button>
            <button
              type="button"
              onClick={() => { setTabStatus("aktif"); setHalaman(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                tabStatus === "aktif"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-green-700 hover:bg-green-100"
              }`}
            >
              Tayang ({totalAktif})
            </button>
            <button
              type="button"
              onClick={() => { setTabStatus("nonaktif"); setHalaman(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                tabStatus === "nonaktif"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Nonaktif ({totalNonaktif})
            </button>
          </div>

          {/* SEARCH & PER PAGE */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              Show
              <select
                value={jumlahData}
                onChange={(e) => {
                  setJumlahData(Number(e.target.value));
                  setHalaman(1);
                }}
                className="rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-blue-500 text-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={kataKunci}
                onChange={(e) => ubahKataKunci(e.target.value)}
                placeholder="Cari nama, isi, lokasi..."
                className="w-full rounded-lg border border-gray-300 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* TABEL TESTIMONI */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
              <tr>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold w-12 text-center">
                  No
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold min-w-[200px]">
                  Pengirim & Info
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold min-w-[320px]">
                  Isi Testimoni
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold text-center w-36">
                  Status
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold w-32">
                  Tanggal
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold text-center w-28">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                    Memuat data testimoni...
                  </td>
                </tr>
              ) : dataTampil.length > 0 ? (
                dataTampil.map((item, index) => (
                  <tr key={item.id} className="transition hover:bg-gray-50/70">
                    <td className="px-4 py-3.5 text-center text-xs text-gray-500">
                      {nomorAwal + index}
                    </td>

                    <td className="px-4 py-3.5 align-top">
                      <div className="font-semibold text-gray-900">{item.nama}</div>
                      
                      {/* Sub-info: Lokasi BLC & Rating Bintang */}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {item.rating && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            {item.rating}/5
                          </span>
                        )}
                        {item.namaLokasi && (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                            <MapPin size={10} className="text-slate-400" />
                            {item.namaLokasi}
                          </span>
                        )}
                      </div>

                      {/* Kontak Email/Phone jika ada */}
                      {(item.email || item.phone) && (
                        <div className="mt-1 text-[11px] text-gray-400">
                          {item.email} {item.phone && `• ${item.phone}`}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 align-top text-gray-700">
                      <p className="line-clamp-3 text-sm leading-relaxed">
                        {item.isi ? `“${item.isi}”` : <span className="italic text-gray-400 font-light">Tidak ada isi testimoni</span>}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 align-top text-center">
                      {item.status === "pending" ? (
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                            <Clock size={11} />
                            Menunggu Review
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleUbahStatus(item, "aktif")}
                              className="rounded bg-green-600 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-green-700 shadow-xs"
                              title="Setujui dan Tayangkan"
                            >
                              Setujui
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUbahStatus(item, "nonaktif")}
                              className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-700 hover:bg-gray-300"
                              title="Tolak / Arsipkan"
                            >
                              Tolak
                            </button>
                          </div>
                        </div>
                      ) : item.status === "aktif" ? (
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-800">
                            <CheckCircle size={11} />
                            Tayang
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUbahStatus(item, "nonaktif")}
                            className="text-[10px] text-gray-400 hover:text-red-600 underline"
                          >
                            Nonaktifkan
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                            <EyeOff size={11} />
                            Nonaktif
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUbahStatus(item, "aktif")}
                            className="text-[10px] text-blue-600 hover:text-blue-800 underline"
                          >
                            Aktifkan
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 align-top text-xs text-gray-500">
                      {formatTanggal(item.createdAt || item.updatedAt)}
                    </td>

                    <td className="px-4 py-3.5 align-top text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => bukaEdit(item)}
                          title="Ubah Testimoni"
                          className="rounded p-1 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 transition"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHapus(item)}
                          title="Hapus Testimoni"
                          className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <MessageSquareQuote size={36} className="mx-auto mb-2 text-gray-300" />
                    <p className="font-medium text-gray-700">Data testimoni tidak ditemukan.</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Coba ubah kata kunci pencarian atau ganti filter status.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
          <p>
            Menampilkan {nomorAwal} - {nomorAkhir} dari {dataFilter.length} testimoni
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={halaman === 1}
              onClick={() => setHalaman((prev) => Math.max(1, prev - 1))}
              className="rounded border border-gray-200 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            {tombolHalaman.map((nomor) => (
              <button
                key={nomor}
                type="button"
                onClick={() => setHalaman(nomor)}
                className={`min-w-7 rounded border px-2 py-1 font-medium ${
                  halaman === nomor
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {nomor}
              </button>
            ))}

            <button
              type="button"
              disabled={halaman === totalHalaman}
              onClick={() => setHalaman((prev) => Math.min(totalHalaman, prev + 1))}
              className="rounded border border-gray-200 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH DAN UBAH */}
      {modalTerbuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-800">
                  {modeEdit ? "Ubah Testimoni" : "Tambah Testimoni Baru"}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  {modeEdit
                    ? "Perbarui teks atau status moderasi testimoni."
                    : "Tambahkan testimoni manual dari peserta."}
                </p>
              </div>

              <button
                type="button"
                onClick={tutupModal}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSimpan}>
              <div className="space-y-3.5 p-5 text-sm">
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Nama Peserta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      value={form.email || ""}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="budi@example.com"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      No. Handphone (Opsional)
                    </label>
                    <input
                      type="text"
                      value={form.phone || ""}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="08123456789"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Isi Testimoni <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.isi}
                    onChange={(e) => setForm({ ...form, isi: e.target.value })}
                    placeholder="Tuliskan ulasan atau pengalaman pelatihan..."
                    rows={4}
                    className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Status Moderasi
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as StatusTestimoni,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="aktif">Aktif (Tayang di Website)</option>
                    <option value="pending">Menunggu Review</option>
                    <option value="nonaktif">Nonaktif (Disembunyikan)</option>
                  </select>
                  <p className="mt-1 text-[11px] text-gray-400">
                    Hanya status &quot;Aktif&quot; yang akan tampil di landing page publik.
                  </p>
                </div>

                {pesanError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    {pesanError}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-3">
                <button
                  type="button"
                  onClick={tutupModal}
                  disabled={sedangMenyimpan}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={sedangMenyimpan}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {sedangMenyimpan ? "Menyimpan..." : modeEdit ? "Simpan Perubahan" : "Simpan Testimoni"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
