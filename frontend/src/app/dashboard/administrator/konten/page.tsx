"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  ambilKonten,
  hapusKonten,
  simpanKonten,
  type Konten,
} from "@/lib/konten";

export default function KelolaKonten() {
  const [daftar, setDaftar] = useState<Konten[]>([]);
  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [tipe, setTipe] = useState<"halaman" | "blok">("halaman");
  const [indukId, setIndukId] = useState<string>("");
  const [isi, setIsi] = useState("");
  const [urutan, setUrutan] = useState(1);
  const [aktif, setAktif] = useState<string>("true");
  const [editId, setEditId] = useState<number | null>(null);

  async function muatUlang() {
    const res = await fetch("/api/v1/konten");
    setDaftar(await res.json());
  }

  useEffect(() => {
    fetch("/api/v1/konten")
      .then((res) => res.json())
      .then(setDaftar);
  }, []);

  function resetForm() {
    setJudul("");
    setSlug("");
    setTipe("halaman");
    setIndukId("");
    setIsi("");
    setUrutan(1);
    setAktif("true");
    setEditId(null);
  }

  async function handleSimpan() {
    if (!judul.trim() || !slug.trim()) return;

    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      judul,
      slug,
      tipe,
      indukId: indukId ? Number(indukId) : null,
      isi,
      urutan,
      aktif: aktif === "true",
    });

    if (editId === null) {
      await fetch("/api/v1/konten", { method: "POST", headers, body });
    } else {
      await fetch(`/api/v1/konten/${editId}`, { method: "PUT", headers, body });
    }

    await muatUlang();
    resetForm();
  }

  function handleEdit(a: Konten) {
    setEditId(a.id);
    setJudul(a.judul);
    setSlug(a.slug);
    setTipe(a.tipe);
    setIndukId(a.indukId ? String(a.indukId) : "");
    setIsi(a.isi);
    setUrutan(a.urutan);
    setAktif(a.aktif ? "true" : "false");
  }

  async function handleHapus(id: number) {
    if (!confirm("Hapus konten ini?")) return;
    await fetch(`/api/v1/konten/${id}`, { method: "DELETE" });
    await muatUlang();
  }

  const pilihanInduk = daftar.filter((m) => m.id !== editId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Konten Statis</h1>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-semibold">
          {editId === null ? "Tambah Konten" : "Ubah Konten"}
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
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipe</label>
          <select
            value={tipe}
            onChange={(e) => setTipe(e.target.value as "halaman" | "blok")}
            className="border rounded-lg px-3 py-2"
          >
            <option value="halaman">Halaman</option>
            <option value="blok">Blok</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Induk (Parent)</label>
          <select
            value={indukId}
            onChange={(e) => setIndukId(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">— Tidak ada induk (Root) —</option>
            {pilihanInduk.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.judul} ({a.tipe})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Isi</label>
          <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            rows={5}
            className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
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
          <h2 className="font-semibold">Daftar Konten</h2>
        </div>

        {daftar.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">
            Belum ada konten.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Judul</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium">Tipe</th>
                  <th className="px-6 py-3 font-medium">Induk</th>
                  <th className="px-6 py-3 font-medium">Urutan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-6 py-3">{a.judul}</td>
                    <td className="px-6 py-3">{a.slug}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          a.tipe === "halaman"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {a.tipe}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {a.indukId
                        ? daftar.find((d) => d.id === a.indukId)?.judul || String(a.indukId)
                        : "—"}
                    </td>
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