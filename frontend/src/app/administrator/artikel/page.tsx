"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Artikel } from "@/lib/artikel-store";

export default function KelolaArtikel() {
  const [daftar, setDaftar] = useState<Artikel[]>([]);
  const [judul, setJudul] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [status, setStatus] = useState<Artikel["status"]>("Draf");
  const [editId, setEditId] = useState<number | null>(null);

  async function muatUlang() {
      const res = await fetch("/api/v1/artikel");
      setDaftar(await res.json());
    }

    useEffect(() => {
      fetch("/api/v1/artikel")
        .then((res) => res.json())
        .then(setDaftar);
    }, []);

  function resetForm() {
    setJudul("");
    setRingkasan("");
    setStatus("Draf");
    setEditId(null);
  }

  async function handleSimpan() {
      if (!judul.trim()) return;

      const headers = { "Content-Type": "application/json" };
      const body = JSON.stringify({ judul, ringkasan, status });

      if (editId === null) {
        await fetch("/api/v1/artikel", { method: "POST", headers, body });
      } else {
        await fetch(`/api/v1/artikel/${editId}`, { method: "PUT", headers, body });
      }

      await muatUlang();
      resetForm();
    }

  function handleEdit(a: Artikel) {
    setEditId(a.id);
    setJudul(a.judul);
    setRingkasan(a.ringkasan);
    setStatus(a.status);
  }

  async function handleHapus(id: number) {
      if (!confirm("Hapus artikel ini?")) return;
      await fetch(`/api/v1/artikel/${id}`, { method: "DELETE" });
      await muatUlang();
    }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Artikel</h1>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-semibold">
          {editId === null ? "Tambah Artikel" : "Ubah Artikel"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ringkasan</label>
          <textarea
            value={ringkasan}
            onChange={(e) => setRingkasan(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Artikel["status"])}
            className="border rounded-lg px-3 py-2"
          >
            <option value="Draf">Draf</option>
            <option value="Terbit">Terbit</option>
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
          <h2 className="font-semibold">Daftar Artikel</h2>
        </div>

        {daftar.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">
            Belum ada artikel.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Judul</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-6 py-3">{a.judul}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          a.status === "Terbit"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {a.status}
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