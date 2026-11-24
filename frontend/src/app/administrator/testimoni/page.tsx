
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
  Eye,
  EyeOff,
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
  isi: "",
  status: "nonaktif",
};

export default function TestimoniPage() {
  const [data, setData] = useState<Testimoni[]>([]);
  const [kataKunci, setKataKunci] = useState("");
  const [jumlahData, setJumlahData] = useState(10);
  const [halaman, setHalaman] = useState(1);

  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [modeEdit, setModeEdit] = useState(false);
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const [form, setForm] = useState<FormTestimoni>(formAwal);
  const [pesanError, setPesanError] = useState("");

  async function muatData() {
    setData(await ambilTestimoni());
  }

  useEffect(() => {
    muatData();

    const perbarui = () => muatData();

    window.addEventListener("testimoni-berubah", perbarui);

    return () => {
      window.removeEventListener("testimoni-berubah", perbarui);
    };
  }, []);

  const dataFilter = useMemo(() => {
    const kata = kataKunci.toLowerCase().trim();
    const daftar = Array.isArray(data) ? data : [];

    return daftar.filter(
      (item) =>
        item.nama.toLowerCase().includes(kata) ||
        item.isi.toLowerCase().includes(kata)
    );
  }, [data, kataKunci]);

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

  function handleSimpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.nama.trim() || !form.isi.trim()) {
      setPesanError("Nama dan isi testimoni wajib diisi.");
      return;
    }

    try {
      simpanTestimoni(
        {
          nama: form.nama.trim(),
          isi: form.isi.trim(),
          status: form.status,
        },
        idEdit ?? undefined
      );

      muatData();
      tutupModal();
    } catch {
      setPesanError("Gagal menyimpan data testimoni.");
    }
  }

  async function handleHapus(item: Testimoni) {
      const yakin = window.confirm(
        `Apakah kamu yakin ingin menghapus testimoni dari "${item.nama}"?`
      );

      if (!yakin) return;

      await hapusTestimoni(item.id);
      muatData();

      if (dataTampil.length === 1 && halaman > 1) {
        setHalaman((prev) => prev - 1);
      }
    }

    async function handleUbahStatus(item: Testimoni) {
      const statusBaru =
        item.status === "aktif" ? "nonaktif" : "aktif";

      const konfirmasi = window.confirm(
        statusBaru === "aktif"
          ? `Tampilkan testimoni dari "${item.nama}" di website?`
          : `Sembunyikan testimoni dari "${item.nama}" dari website?`
      );

      if (!konfirmasi) return;

      await ubahStatusTestimoni(item.id);
      muatData();
    }

  function formatTanggal(tanggal: string) {
    return new Date(tanggal).toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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
            <span className="font-medium text-gray-800">
              Testimoni
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-800">
            Data Testimoni
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola testimoni dan tentukan testimoni yang ditampilkan
            pada website.
          </p>
        </div>

        <button
          type="button"
          onClick={bukaTambah}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          <Plus size={18} />
          Tambah Data
        </button>
      </div>

      {/* RINGKASAN DATA */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Testimoni</p>
            <MessageSquareQuote className="text-blue-600" size={22} />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {data.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Tayang</p>
            <Eye className="text-green-600" size={22} />
          </div>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {(data || []).filter((item) => item.status === "aktif").length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Tidak Tayang</p>
            <EyeOff className="text-red-600" size={22} />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {(data || []).filter((item) => item.status === "nonaktif").length}
          </p>
        </div>
      </div>

      {/* TABEL TESTIMONI */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Show
            <select
              value={jumlahData}
              onChange={(e) => {
                setJumlahData(Number(e.target.value));
                setHalaman(1);
              }}
              className="rounded-md border border-gray-300 px-2 py-1.5 outline-none focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            entries
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={kataKunci}
              onChange={(e) => ubahKataKunci(e.target.value)}
              placeholder="Cari testimoni..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-row-dashed align-middle w-full min-w-[1000px] border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold">
                  No
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold">
                  Nama
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold">
                  Isi Testimoni
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold">
                  Status
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold">
                  Modified at
                </th>
                <th className="border-b border-gray-200 px-4 py-3 font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {dataTampil.length > 0 ? (
                dataTampil.map((item, index) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="border-b border-gray-100 px-4 py-3">
                      {nomorAwal + index}
                    </td>

                    <td className="max-w-[180px] border-b border-gray-100 px-4 py-3 font-medium text-gray-800">
                      {item.nama}
                    </td>

                    <td className="max-w-[380px] border-b border-gray-100 px-4 py-3 text-gray-600">
                      <p className="line-clamp-3">{item.isi}</p>
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleUbahStatus(item)}
                        title="Klik untuk mengubah status tayang"
                        className={`rounded-md px-2.5 py-1 text-xs font-bold text-white transition ${
                          item.status === "aktif"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {item.status === "aktif"
                          ? "AKTIF"
                          : "NON-AKTIF"}
                      </button>
                    </td>


                    <td className="whitespace-nowrap border-b border-gray-100 px-4 py-3 text-gray-600">
                      {formatTanggal(item.modifiedAt)}
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => bukaEdit(item)}
                          title="Ubah testimoni"
                          className="inline-flex items-center gap-1 rounded-md bg-yellow-400 px-2.5 py-1.5 text-xs font-semibold text-gray-900 hover:bg-yellow-500"
                        >
                          <Pencil size={13} />
                          Ubah
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHapus(item)}
                          title="Hapus testimoni"
                          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          <Trash2 size={13} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <MessageSquareQuote
                      size={35}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="font-medium">
                      Data testimoni tidak ditemukan.
                    </p>
                    <p className="mt-1 text-xs">
                      Coba ubah kata kunci pencarian atau tambahkan data baru.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {nomorAwal} to {nomorAkhir} of {dataFilter.length} entries
          </p>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              disabled={halaman === 1}
              onClick={() => setHalaman((prev) => Math.max(1, prev - 1))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            {tombolHalaman.map((nomor) => (
              <button
                key={nomor}
                type="button"
                onClick={() => setHalaman(nomor)}
                className={`min-w-9 rounded-md border px-3 py-2 text-sm ${
                  halaman === nomor
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {nomor}
              </button>
            ))}

            <button
              type="button"
              disabled={halaman === totalHalaman}
              onClick={() =>
                setHalaman((prev) => Math.min(totalHalaman, prev + 1))
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH DAN UBAH */}
      {modalTerbuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {modeEdit ? "Ubah Testimoni" : "Tambah Testimoni"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Isi informasi testimoni di bawah ini.
                </p>
              </div>

              <button
                type="button"
                onClick={tutupModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSimpan}>
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) =>
                      setForm({ ...form, nama: e.target.value })
                    }
                    placeholder="Masukkan nama pengirim"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Isi Testimoni <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.isi}
                    onChange={(e) =>
                      setForm({ ...form, isi: e.target.value })
                    }
                    placeholder="Masukkan isi testimoni"
                    rows={5}
                    className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Status Tayang
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as StatusTestimoni,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="nonaktif">Nonaktif (Tidak Tayang)</option>
                    <option value="aktif">Aktif (Tayang)</option>
                  </select>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Hanya testimoni aktif yang boleh ditampilkan pada website.
                  </p>
                </div>

                {pesanError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {pesanError}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4">
                <button
                  type="button"
                  onClick={tutupModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {modeEdit ? "Simpan Perubahan" : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
