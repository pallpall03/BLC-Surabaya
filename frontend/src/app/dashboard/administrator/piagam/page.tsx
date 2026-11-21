"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  ambilPiagam,
  hapusPiagam,
  simpanPiagam,
  type Piagam,
} from "@/lib/piagam";

export default function KelolaPiagam() {
  const [daftar, setDaftar] = useState<Piagam[]>([]);
  const [modulId, setModulId] = useState("");
  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("");
  const [aktif, setAktif] = useState<string>("true");
  const [editId, setEditId] = useState<number | null>(null);

  async function muatUlang() {
    const res = await fetch("/api/v1/piagam");
    setDaftar(await res.json());
  }

  useEffect(() => {
    fetch("/api/v1/piagam")
      .then((res) => res.json())
      .then(setDaftar);
  }, []);

  function resetForm() {
    setModulId("");
    setJudul("");
    setSlug("");
    setTemplate("");
    setAktif("true");
    setEditId(null);
  }

  async function handleSimpan() {
    if (!judul.trim() || !slug.trim() || !modulId) return;

    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      modulId: Number(modulId),
      judul,
      slug,
      template,
      aktif: aktif === "true",
    });

    if (editId === null) {
      await fetch("/api/v1/piagam", { method: "POST", headers, body });
    } else {
      await fetch(`/api/v1/piagam/${editId}`, { method: "PUT", headers, body });
    }

    await muatUlang();
    resetForm();
  }

  function handleEdit(a: Piagam) {
    setEditId(a.id);
    setModulId(String(a.modulId));
    setJudul(a.judul);
    setSlug(a.slug);
    setTemplate(a.template);
    setAktif(a.aktif ? "true" : "false");
  }

  async function handleHapus(id: number) {
    if (!confirm("Hapus piagam ini?")) return;
    await fetch(`/api/v1/piagam/${id}`, { method: "DELETE" });
    await muatUlang();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Piagam</h1>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-semibold">
          {editId === null ? "Tambah Piagam" : "Ubah Piagam"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Modul ID</label>
          <input
            type="number"
            value={modulId}
            onChange={(e) => setModulId(e.target.value)}
            min={1}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Judul Piagam</label>
          <input
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
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
          <label className="block text-sm font-medium mb-1">Template</label>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />
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
          <h2 className="font-semibold">Daftar Piagam</h2>
        </div>

        {daftar.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">
            Belum ada piagam.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Modul</th>
                  <th className="px-6 py-3 font-medium">Judul</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-6 py-3">{a.modulId}</td>
                    <td className="px-6 py-3">{a.judul}</td>
                    <td className="px-6 py-3">{a.slug}</td>
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