
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  MapPinned,
  Phone,
  ExternalLink,
  Building2,
} from "lucide-react";

import {
  ambilLokasi,
  simpanLokasi,
  hapusLokasi,
  type Lokasi,
  type FormLokasi,
} from "./data";

const formAwal: FormLokasi = {
  nama: "",
  alamat: "",
  kecamatan: "",
  telepon: "",
  maps: "",
  status: "aktif",
};

export default function HalamanLokasi() {
  const [daftar, setDaftar] = useState<Lokasi[]>([]);
  const [cari, setCari] = useState("");
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | undefined>();
  const [form, setForm] = useState<FormLokasi>(formAwal);
  const [galat, setGalat] = useState("");
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    ambilLokasi().then((data) => {
      setDaftar(data);
      setMemuat(false);
    });
  }, []);

  const totalAktif = daftar.filter(
    (lokasi) => lokasi.status === "aktif"
  ).length;

  const hasilPencarian = useMemo(() => {
    return daftar.filter((lokasi) =>
      [
        lokasi.nama,
        lokasi.alamat,
        lokasi.kecamatan,
        lokasi.telepon,
      ]
        .join(" ")
        .toLowerCase()
        .includes(cari.toLowerCase())
    );
  }, [daftar, cari]);

  function bukaTambah() {
    setForm(formAwal);
    setEditId(undefined);
    setGalat("");
    setModal(true);
  }

  function bukaEdit(lokasi: Lokasi) {
    setForm({
      nama: lokasi.nama,
      alamat: lokasi.alamat,
      kecamatan: lokasi.kecamatan,
      telepon: lokasi.telepon,
      maps: lokasi.maps,
      status: lokasi.status,
    });

    setEditId(lokasi.id);
    setGalat("");
    setModal(true);
  }

  function ubahForm(
    field: keyof FormLokasi,
    value: string
  ) {
    setForm((sebelumnya) => ({
      ...sebelumnya,
      [field]: value,
    }));
  }

  async function handleSimpan() {
      if (
        !form.nama?.trim() ||
        !form.alamat?.trim() ||
        !form.kecamatan?.trim()
      ) {
      setGalat("Nama, alamat, dan kecamatan wajib diisi.");
      return;
    }

    if (form.maps.trim()) {
      try {
        const url = new URL(form.maps);
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("URL tidak valid");
        }
      } catch {
        setGalat("Link Google Maps harus berupa URL yang valid.");
        return;
      }
    }

    try {
      const tersimpan = await simpanLokasi(
        {
          ...form,
          nama: form.nama.trim(),
          alamat: form.alamat.trim(),
          kecamatan: form.kecamatan.trim(),
          telepon: form.telepon.trim(),
          maps: form.maps.trim(),
        },
        editId
      );

      setDaftar((sebelumnya) => {
        if (editId) {
          return sebelumnya.map((lokasi) =>
            lokasi.id === editId ? tersimpan : lokasi
          );
        }

        return [...sebelumnya, tersimpan];
      });

      setModal(false);
      setForm(formAwal);
    } catch {
      setGalat("Gagal menyimpan data lokasi.");
    }
  }

  async function handleHapus(lokasi: Lokasi) {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus ${lokasi.nama}?`
    );

    if (!yakin) return;

    await hapusLokasi(lokasi.id);

    setDaftar((sebelumnya) =>
      sebelumnya.filter((item) => item.id !== lokasi.id)
    );
  }

  async function handleStatus(lokasi: Lokasi) {
    const statusBaru =
      lokasi.status === "aktif" ? "nonaktif" : "aktif";

    const dataBaru = {
      nama: lokasi.nama,
      alamat: lokasi.alamat,
      kecamatan: lokasi.kecamatan,
      telepon: lokasi.telepon,
      maps: lokasi.maps,
      status: statusBaru as "aktif" | "nonaktif",
    };

    await simpanLokasi(dataBaru, lokasi.id);

    setDaftar((sebelumnya) =>
      sebelumnya.map((item) =>
        item.id === lokasi.id
          ? { ...item, status: statusBaru }
          : item
      )
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  return (
    <div className="space-y-5">
      {/* RINGKASAN */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Cabang</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">
                {daftar.length}
              </h3>
            </div>
            <Building2 className="text-violet-500" size={28} />
          </div>
        </div>

        <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Cabang Aktif</p>
              <h3 className="mt-2 text-2xl font-bold text-green-600">
                {totalAktif}
              </h3>
            </div>
            <MapPin className="text-green-500" size={28} />
          </div>
        </div>

        <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Cabang Nonaktif</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-500">
                {daftar.length - totalAktif}
              </h3>
            </div>
            <MapPinned className="text-slate-400" size={28} />
          </div>
        </div>
      </div>

      {/* DAFTAR LOKASI */}
      <section className="card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Daftar Lokasi Cabang
            </h2>
            <p className="text-sm text-slate-400">
              Kelola informasi lokasi cabang BLC Surabaya
            </p>
          </div>

          <button
            onClick={bukaTambah}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            <Plus size={16} />
            Tambah Lokasi
          </button>
        </div>

        {/* PENCARIAN */}
        <div className="border-b border-slate-100 p-5">
          <div className="relative max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama, alamat, atau kecamatan..."
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">
          <table className="table table-row-dashed align-middle w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">No.</th>
                <th className="px-6 py-4">Nama Cabang</th>
                <th className="px-6 py-4">Alamat</th>
                <th className="px-6 py-4">Kecamatan</th>
                <th className="px-6 py-4">Telepon</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {memuat ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-slate-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : hasilPencarian.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-slate-400"
                  >
                    {cari
                      ? "Lokasi tidak ditemukan."
                      : "Belum ada data lokasi."}
                  </td>
                </tr>
              ) : (
                hasilPencarian.map((lokasi, index) => (
                  <tr
                    key={lokasi.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {lokasi.nama}
                    </td>

                    <td className="max-w-xs px-6 py-4 text-slate-500">
                      {lokasi.alamat}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {lokasi.kecamatan}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {lokasi.telepon || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatus(lokasi)}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          lokasi.status === "aktif"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {lokasi.status === "aktif"
                          ? "Aktif"
                          : "Nonaktif"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {lokasi.maps && (
                          <a
                            href={lokasi.maps}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Lihat Google Maps"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}

                        <button
                          onClick={() => bukaEdit(lokasi)}
                          title="Ubah"
                          className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleHapus(lokasi)}
                          title="Hapus"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
          Menampilkan {hasilPencarian.length} dari {daftar.length} cabang
        </div>
      </section>

      {/* MODAL TAMBAH / EDIT */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {editId ? "Edit Lokasi Cabang" : "Tambah Lokasi Cabang"}
                </h3>
                <p className="text-xs text-slate-400">
                  Lengkapi informasi cabang BLC
                </p>
              </div>

              <button
                onClick={() => setModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nama Cabang *
                </label>
                <input
                  value={form.nama}
                  onChange={(e) => ubahForm("nama", e.target.value)}
                  placeholder="Contoh: BLC Surabaya"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Alamat Lengkap *
                </label>
                <textarea
                  value={form.alamat}
                  onChange={(e) => ubahForm("alamat", e.target.value)}
                  placeholder="Masukkan alamat lengkap cabang"
                  rows={3}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Kecamatan *
                </label>
                <input
                  value={form.kecamatan}
                  onChange={(e) => ubahForm("kecamatan", e.target.value)}
                  placeholder="Masukkan kecamatan"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={form.telepon}
                    onChange={(e) => ubahForm("telepon", e.target.value)}
                    placeholder="Contoh: 08xxxxxxxxxx"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Link Google Maps
                </label>
                <input
                  value={form.maps}
                  onChange={(e) => ubahForm("maps", e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Tempel link lokasi dari Google Maps.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    ubahForm("status", e.target.value as "aktif" | "nonaktif")
                  }
                  className={inputClass}
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              {galat && (
                <p className="text-sm text-red-600">{galat}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setModal(false)}
                className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-200"
              >
                Batal
              </button>

              <button
                onClick={handleSimpan}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700"
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
