"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  ambilKategoriArtikel,
  hapusKategoriArtikel,
  simpanKategoriArtikel,
  type KategoriArtikel,
} from "@/lib/kategori-artikel";

export default function KelolaKategoriArtikel() {
  const [daftar, setDaftar] = useState<KategoriArtikel[]>([]);
  const [nama, setNama] = useState("");
  const [slug, setSlug] = useState("");
  const [urutan, setUrutan] = useState(1);
  const [aktif, setAktif] = useState<string>("true");
  const [editId, setEditId] = useState<number | null>(null);

  async function muatUlang() {
    const res = await fetch("/api/v1/kategori-artikel");
    setDaftar(await res.json());
  }

  useEffect(() => {
    fetch("/api/v1/kategori-artikel")
      .then((res) => res.json())
      .then(setDaftar);
  }, []);

  function resetForm() {
    setNama("");
    setSlug("");
    setUrutan(1);
    setAktif("true");
    setEditId(null);
  }

  async function handleSimpan() {
    if (!nama.trim() || !slug.trim()) return;

    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ nama, slug, urutan, aktif });

    if (editId === null) {
      await fetch("/api/v1/kategori-artikel", { method: "POST", headers, body });
    } else {
      await fetch(`/api/v1/kategori-artikel/${editId}`, { method: "PUT", headers, body });
    }

    await muatUlang();
    resetForm();
  }

  function handleEdit(a: KategoriArtikel) {
    setEditId(a.id);
    setNama(a.nama);
    setSlug(a.slug);
    setUrutan(a.urutan);
    setAktif(a.aktif ? "true" : "false");
  }

  async function handleHapus(id: number) {
    if (!confirm("Hapus kategori ini?")) return;
    await fetch(`/api/v1/kategori-artikel/${id}`, { method: "DELETE" });
    await muatUlang();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kategori Artikel</h1>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-semibold">
          {editId === null ? "Tambah Kategori" : "Ubah Kategori"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Nama Kategori</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Urutan</label>
          <input
            type="number"
            value={urutan}
            onChange={(e) => setUrutan(Number(e.target.value) || 1)}
            min={1}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={aktif}
            onChange={(e) => setAktif(e.target.value as string)}
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
          <h2 className="font-semibold">Daftar Kategori Artikel</h2>
        </div>

        {daftar.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">
            Belum ada kategori artikel.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Nama</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium">Urutan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-6 py-3">{a.nama}</td>
                    <td className="px-6 py-3">{a.slug}</td>
                    <td className="px-6 py-3">{a.urutan}</td>
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