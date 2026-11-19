"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  ambilLokasiBlc,
  hapusLokasiBlc,
  simpanLokasiBlc,
  type LokasiBlc,
} from "@/lib/lokasi-blc";

export default function KelolaLokasiBlc() {
  const [daftar, setDaftar] = useState<LokasiBlc[]>([]);
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [jamBuka, setJamBuka] = useState("");
  const [jamTutup, setJamTutup] = useState("");
  const [aktif, setAktif] = useState<string>("true");
  const [editId, setEditId] = useState<number | null>(null);

  async function muatUlang() {
    const res = await fetch("/api/v1/lokasi-blc");
    setDaftar(await res.json());
  }

  useEffect(() => {
    fetch("/api/v1/lokasi-blc")
      .then((res) => res.json())
      .then(setDaftar);
  }, []);

  function resetForm() {
    setNama("");
    setAlamat("");
    setLatitude("");
    setLongitude("");
    setTelepon("");
    setEmail("");
    setJamBuka("");
    setJamTutup("");
    setAktif("true");
    setEditId(null);
  }

  async function handleSimpan() {
    if (!nama.trim() || !alamat.trim()) return;

    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      nama,
      alamat,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      telepon,
      email,
      jamBuka,
      jamTutup,
      aktif: aktif === "true",
    });

    if (editId === null) {
      await fetch("/api/v1/lokasi-blc", { method: "POST", headers, body });
    } else {
      await fetch(`/api/v1/lokasi-blc/${editId}`, { method: "PUT", headers, body });
    }

    await muatUlang();
    resetForm();
  }

  function handleEdit(a: LokasiBlc) {
    setEditId(a.id);
    setNama(a.nama);
    setAlamat(a.alamat);
    setLatitude(a.latitude !== null ? String(a.latitude) : "");
    setLongitude(a.longitude !== null ? String(a.longitude) : "");
    setTelepon(a.telepon);
    setEmail(a.email);
    setJamBuka(a.jamBuka);
    setJamTutup(a.jamTutup);
    setAktif(a.aktif ? "true" : "false");
  }

  async function handleHapus(id: number) {
    if (!confirm("Hapus lokasi ini?")) return;
    await fetch(`/api/v1/lokasi-blc/${id}`, { method: "DELETE" });
    await muatUlang();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lokasi BLC</h1>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-semibold">
          {editId === null ? "Tambah Lokasi" : "Ubah Lokasi"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Nama Lokasi</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-7.2575"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="112.7521"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Telepon</label>
            <input
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Jam Buka</label>
            <input
              type="time"
              value={jamBuka}
              onChange={(e) => setJamBuka(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jam Tutup</label>
            <input
              type="time"
              value={jamTutup}
              onChange={(e) => setJamTutup(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={aktif}
            onChange={(e) => setAktif(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSimpan}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
          >
            {editId === null ? "Tambah" : "Simpan Perubahan"}
          </button>
          {editId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-5 py-2 rounded-lg"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Daftar Lokasi BLC</h2>
        </div>

        {daftar.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">
            Belum ada lokasi.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Nama</th>
                  <th className="px-6 py-3 font-medium">Alamat</th>
                  <th className="px-6 py-3 font-medium">Telepon</th>
                  <th className="px-6 py-3 font-medium">Jam</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-6 py-3">{a.nama}</td>
                    <td className="px-6 py-3 max-w-xs truncate">{a.alamat}</td>
                    <td className="px-6 py-3">{a.telepon || "-"}</td>
                    <td className="px-6 py-3">
                      {a.jamBuka && a.jamTutup
                        ? `${a.jamBuka} - ${a.jamTutup}`
                        : "-"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          a.aktif
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {a.aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(a)}
                          className="p-2 rounded hover:bg-gray-100"
                          aria-label="Ubah"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleHapus(a.id)}
                          className="p-2 rounded hover:bg-red-50 text-red-600"
                          aria-label="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}