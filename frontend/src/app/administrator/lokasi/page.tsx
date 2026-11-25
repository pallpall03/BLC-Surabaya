
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
  ExternalLink,
  Building2,
} from "lucide-react";

import {
  ambilLokasi,
  simpanLokasi,
  hapusLokasi,
  buatLinkGoogleMaps,
  ekstrakKoordinatMaps,
  type Lokasi,
  type FormLokasi,
} from "./data";

const formAwal: FormLokasi & { mapsUrl?: string } = {
  nama_blc: "",
  alamat: "",
  foto_blc: "",
  foto2_blc: "",
  latitude: "",
  longitude: "",
  area: "dalam",
  aktif: true,
  jumlah_slot_computer: null,
  jadwal_blc: "",
  wilayah_surabaya: "",
  mapsUrl: "",
};

export default function HalamanLokasi() {
  const [daftar, setDaftar] = useState<Lokasi[]>([]);
  const [cari, setCari] = useState("");
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | undefined>();
  const [form, setForm] = useState<typeof formAwal>(formAwal);
  const [galat, setGalat] = useState("");
  const [memuat, setMemuat] = useState(true);

  async function muatData() {
    setMemuat(true);
    try {
      const data = await ambilLokasi();
      setDaftar(Array.isArray(data) ? data : []);
    } catch {
      setDaftar([]);
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatData();
  }, []);

  const totalAktif = useMemo(() => {
    return (Array.isArray(daftar) ? daftar : []).filter((lokasi) => lokasi.aktif).length;
  }, [daftar]);

  const hasilPencarian = useMemo(() => {
    const list = Array.isArray(daftar) ? daftar : [];
    if (!cari.trim()) return list;

    const lower = cari.toLowerCase();
    return list.filter((lokasi) =>
      [
        lokasi.nama_blc,
        lokasi.alamat,
        lokasi.wilayah_surabaya,
        lokasi.area,
        lokasi.jadwal_blc,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }, [daftar, cari]);

  function bukaTambah() {
    setForm(formAwal);
    setEditId(undefined);
    setGalat("");
    setModal(true);
  }

  function bukaEdit(lokasi: Lokasi) {
    const mapsLink = buatLinkGoogleMaps(lokasi.latitude, lokasi.longitude) || "";
    setForm({
      nama_blc: lokasi.nama_blc || "",
      alamat: lokasi.alamat || "",
      foto_blc: lokasi.foto_blc || "",
      foto2_blc: lokasi.foto2_blc || "",
      latitude: lokasi.latitude || "",
      longitude: lokasi.longitude || "",
      area: lokasi.area || "dalam",
      aktif: lokasi.aktif,
      jumlah_slot_computer: lokasi.jumlah_slot_computer ?? null,
      jadwal_blc: lokasi.jadwal_blc || "",
      wilayah_surabaya: lokasi.wilayah_surabaya || "",
      mapsUrl: mapsLink,
    });

    setEditId(lokasi.id);
    setGalat("");
    setModal(true);
  }

  function ubahForm<K extends keyof typeof formAwal>(
    field: K,
    value: (typeof formAwal)[K]
  ) {
    setForm((sebelumnya) => {
      const updated = {
        ...sebelumnya,
        [field]: value,
      };

      // Jika user paste URL Maps, otomatis extract lat & long
      if (field === "mapsUrl" && typeof value === "string") {
        const coords = ekstrakKoordinatMaps(value);
        if (coords) {
          updated.latitude = coords.latitude;
          updated.longitude = coords.longitude;
        }
      }

      return updated;
    });
  }

  async function handleSimpan() {
    if (!form.nama_blc?.trim()) {
      setGalat("Nama cabang BLC wajib diisi.");
      return;
    }

    try {
      const res = await simpanLokasi(
        {
          nama_blc: form.nama_blc.trim(),
          alamat: form.alamat?.trim() || "",
          foto_blc: form.foto_blc?.trim() || "",
          foto2_blc: form.foto2_blc?.trim() || "",
          latitude: form.latitude?.trim() || "",
          longitude: form.longitude?.trim() || "",
          area: form.area?.trim() || "dalam",
          aktif: form.aktif,
          jumlah_slot_computer:
            form.jumlah_slot_computer !== null && form.jumlah_slot_computer !== undefined && (form.jumlah_slot_computer as unknown as string) !== ""
              ? Number(form.jumlah_slot_computer)
              : null,
          jadwal_blc: form.jadwal_blc?.trim() || "",
          wilayah_surabaya: form.wilayah_surabaya?.trim() || "",
        },
        editId
      );

      const tersimpan = res.data;

      setDaftar((sebelumnya) => {
        const list = Array.isArray(sebelumnya) ? sebelumnya : [];
        if (editId) {
          return list.map((lokasi) => (lokasi.id === editId ? tersimpan : lokasi));
        }
        return [...list, tersimpan];
      });

      setModal(false);
      setForm(formAwal);
    } catch {
      setGalat("Gagal menyimpan data lokasi.");
    }
  }

  async function handleHapus(lokasi: Lokasi) {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus ${lokasi.nama_blc}?`
    );

    if (!yakin) return;

    await hapusLokasi(lokasi.id);

    setDaftar((sebelumnya) =>
      (Array.isArray(sebelumnya) ? sebelumnya : []).filter((item) => item.id !== lokasi.id)
    );
  }

  async function handleStatus(lokasi: Lokasi) {
    const statusBaru = !lokasi.aktif;

    const dataBaru: FormLokasi = {
      nama_blc: lokasi.nama_blc,
      alamat: lokasi.alamat || "",
      foto_blc: lokasi.foto_blc || "",
      foto2_blc: lokasi.foto2_blc || "",
      latitude: lokasi.latitude || "",
      longitude: lokasi.longitude || "",
      area: lokasi.area || "",
      aktif: statusBaru,
      jumlah_slot_computer: lokasi.jumlah_slot_computer ?? null,
      jadwal_blc: lokasi.jadwal_blc || "",
      wilayah_surabaya: lokasi.wilayah_surabaya || "",
    };

    await simpanLokasi(dataBaru, lokasi.id);

    setDaftar((sebelumnya) =>
      (Array.isArray(sebelumnya) ? sebelumnya : []).map((item) =>
        item.id === lokasi.id ? { ...item, aktif: statusBaru } : item
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
              placeholder="Cari nama BLC, alamat, wilayah, atau jadwal..."
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
                <th className="px-6 py-4">Nama BLC</th>
                <th className="px-6 py-4">Alamat & Wilayah</th>
                <th className="px-6 py-4">Area</th>
                <th className="px-6 py-4">Slot PC</th>
                <th className="px-6 py-4">Jadwal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {memuat ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-slate-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : hasilPencarian.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-slate-400"
                  >
                    {cari
                      ? "Lokasi tidak ditemukan."
                      : "Belum ada data lokasi."}
                  </td>
                </tr>
              ) : (
                hasilPencarian.map((lokasi, index) => {
                  const linkMaps = buatLinkGoogleMaps(lokasi.latitude, lokasi.longitude);

                  return (
                    <tr
                      key={lokasi.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-800">
                        {lokasi.nama_blc}
                      </td>

                      <td className="max-w-xs px-6 py-4">
                        <div className="text-slate-700">{lokasi.alamat || "-"}</div>
                        {lokasi.wilayah_surabaya && (
                          <div className="text-xs text-violet-600 font-medium">
                            {lokasi.wilayah_surabaya}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="capitalize text-slate-600">
                          {lokasi.area || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {lokasi.jumlah_slot_computer ? `${lokasi.jumlah_slot_computer} Unit` : "-"}
                      </td>

                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {lokasi.jadwal_blc || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatus(lokasi)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            lokasi.aktif
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {lokasi.aktif ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {linkMaps && (
                            <a
                              href={linkMaps}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Buka Google Maps"
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
                  );
                })
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
                  Nama Cabang BLC *
                </label>
                <input
                  value={form.nama_blc}
                  onChange={(e) => ubahForm("nama_blc", e.target.value)}
                  placeholder="Contoh: BLC Siola / BLC Kebon Bibit"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Wilayah Surabaya
                  </label>
                  <select
                    value={form.wilayah_surabaya || ""}
                    onChange={(e) => ubahForm("wilayah_surabaya", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">-- Pilih Wilayah --</option>
                    <option value="Surabaya Pusat">Surabaya Pusat</option>
                    <option value="Surabaya Timur">Surabaya Timur</option>
                    <option value="Surabaya Barat">Surabaya Barat</option>
                    <option value="Surabaya Utara">Surabaya Utara</option>
                    <option value="Surabaya Selatan">Surabaya Selatan</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Area
                  </label>
                  <select
                    value={form.area || "dalam"}
                    onChange={(e) => ubahForm("area", e.target.value)}
                    className={inputClass}
                  >
                    <option value="dalam">Dalam Kota</option>
                    <option value="luar">Luar Kota</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Alamat Lengkap
                </label>
                <textarea
                  value={form.alamat || ""}
                  onChange={(e) => ubahForm("alamat", e.target.value)}
                  placeholder="Masukkan alamat lengkap cabang"
                  rows={2}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Jumlah Slot Komputer
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.jumlah_slot_computer ?? ""}
                    onChange={(e) =>
                      ubahForm(
                        "jumlah_slot_computer",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    placeholder="Contoh: 30"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Jadwal Operasional
                  </label>
                  <input
                    value={form.jadwal_blc || ""}
                    onChange={(e) => ubahForm("jadwal_blc", e.target.value)}
                    placeholder="Senin - Jumat, 08:00 - 16:00"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Link Google Maps
                </label>
                <input
                  value={form.mapsUrl || ""}
                  onChange={(e) => ubahForm("mapsUrl", e.target.value)}
                  placeholder="https://maps.google.com/?q=-7.2575,112.7521"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Tempel URL Google Maps. Koordinat akan otomatis diekstrak jika format URL sesuai.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Latitude
                  </label>
                  <input
                    value={form.latitude || ""}
                    onChange={(e) => ubahForm("latitude", e.target.value)}
                    placeholder="-7.2575..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Longitude
                  </label>
                  <input
                    value={form.longitude || ""}
                    onChange={(e) => ubahForm("longitude", e.target.value)}
                    placeholder="112.7521..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={form.aktif ? "aktif" : "nonaktif"}
                  onChange={(e) =>
                    ubahForm("aktif", e.target.value === "aktif")
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
