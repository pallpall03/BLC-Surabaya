"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  ambilFotoSlider,
  hapusFotoSlider,
  simpanFotoSlider,
  type FotoSlider,
} from "@/lib/foto-slider";

export default function KelolaFotoSlider() {
  const [daftar, setDaftar] = useState<FotoSlider[]>([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [urutan, setUrutan] = useState(1);
  const [aktif, setAktif] = useState<string>("true");
  const [file, setFile] = useState<File | null>(null);
  const [gambarLama, setGambarLama] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else if (gambarLama) {
      setPreview(gambarLama);
    } else {
      setPreview(null);
    }
    return () => {
      if (preview && file) URL.revokeObjectURL(preview);
    };
  }, [file, gambarLama]);

  async function muatUlang() {
    const res = await fetch("/api/v1/foto-slider");
    setDaftar(await res.json());
  }

  useEffect(() => {
    fetch("/api/v1/foto-slider")
      .then((res) => res.json())
      .then(setDaftar);
  }, []);

  function resetForm() {
    setJudul("");
    setDeskripsi("");
    setUrutan(1);
    setAktif("true");
    setFile(null);
    setGambarLama("");
    setEditId(null);
  }

  async function handleSimpan() {
    if (!judul.trim() || (!file && !gambarLama)) return;

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("deskripsi", deskripsi);
    formData.append("urutan", String(urutan));
    formData.append("aktif", aktif);
    if (file) {
      formData.append("gambar", file);
    }
    if (gambarLama) {
      formData.append("gambar_lama", gambarLama);
    }

    if (editId === null) {
      await fetch("/api/v1/foto-slider", { method: "POST", body: formData });
    } else {
      await fetch(`/api/v1/foto-slider/${editId}`, { method: "PUT", body: formData });
    }

    await muatUlang();
    resetForm();
  }

  function handleEdit(a: FotoSlider) {
    setEditId(a.id);
    setJudul(a.judul);
    setDeskripsi(a.deskripsi);
    setUrutan(a.urutan);
    setAktif(a.aktif ? "true" : "false");
    setFile(null);
    setGambarLama(a.gambar);
  }

  async function handleHapus(id: number) {
    if (!confirm("Hapus slider ini?")) return;
    await fetch(`/api/v1/foto-slider/${id}`, { method: "DELETE" });
    await muatUlang();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      if (!f.type.startsWith("image/")) {
        alert("File harus berupa gambar.");
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2 MB.");
        return;
      }
    }
    setFile(f);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Foto Slider</h1>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-semibold">
          {editId === null ? "Tambah Slider" : "Ubah Slider"}
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
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
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
            onChange={(e) => setAktif(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block"
          />
          {preview && (
            <img
              src={preview}
              alt={judul || "Preview"}
              className="mt-2 h-32 w-auto rounded-lg object-cover"
            />
          )}
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
          <h2 className="font-semibold">Daftar Slider</h2>
        </div>

        {daftar.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">
            Belum ada slider.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Gambar</th>
                  <th className="px-6 py-3 font-medium">Judul</th>
                  <th className="px-6 py-3 font-medium">Urutan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-6 py-3">
                      <img
                        src={a.gambar}
                        alt={a.judul}
                        className="h-16 w-auto rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-3">{a.judul}</td>
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