"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, List, Lock, Eye, EyeOff, Check, X, Pencil, Trash2 } from "lucide-react";
import {
  ambilMenuAkses,
  simpanMenuAkses,
  hapusMenuAkses,
  type MenuAkses,
  daftarRole,
} from "@/lib/menu-akses";

export default function KelolaMenuAkses() {
  const [daftar, setDaftar] = useState<MenuAkses[]>([]);
  const [role, setRole] = useState<string>("administrator");
  const [pilihRole, setPilihRole] = useState<{ label: string; value: string }[]>([
    { label: "Administrator", value: "administrator" },
    { label: "Operator", value: "operator" },
    { label: "Instruktur", value: "instruktur" },
    { label: "Koordinator", value: "koordinator" },
    { label: "Peserta", value: "peserta" },
  ]);
  const [editId, setEditId] = useState<number | null>(null);

  async function muatUlang() {
    const res = await fetch(`/api/v1/menu-akses?role=${role}`);
    setDaftar(await res.json());
  }

  useEffect(() => {
    muatUlang();
  }, [role]);

  function resetForm() {
    setEditId(null);
  }

  async function handleSimpan() {
    if (!editId && !role) return;

    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ role });

    if (editId === null) {
      await fetch("/api/v1/menu-akses", { method: "POST", headers, body });
    } else {
      await fetch(`/api/v1/menu-akses/${editId}`, { method: "PUT", headers, body });
    }

    await muatUlang();
    resetForm();
  }

  function handleEdit(m: MenuAkses) {
    setEditId(m.id);
    setRole(m.role);
  }

  async function handleHapus(id: number) {
    if (!confirm("Hapus konfigurasi menu akses ini?")) return;
    await fetch(`/api/v1/menu-akses/${id}`, { method: "DELETE" });
    await muatUlang();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Menu Akses (RBAC)</h1>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="font-semibold pb-2 border-b">
          Pilih Role
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {pilihRole.map((r) => (
            <button
              key={r.value}
              onClick={() => {
                setRole(r.value);
                muatUlang();
              }}
              className={`px-4 py-2 rounded-lg border ${
                role === r.value ? "bg-orange-500 text-white" : "text-gray-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Konfigurasi Menu Akses</h2>
          <p className="text-sm text-gray-500">Mengatur izin per menu per role</p>
        </div>

        {role && daftar.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">
            Belum ada konfigurasi untuk role ini.
          </p>
        ) : (
          daftar.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-500 text-sm">
              Belum ada data.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Menu</th>
                    <th className="px-6 py-3 font-medium">Lihat</th>
                    <th className="px-6 py-3 font-medium">Tambah</th>
                    <th className="px-6 py-3 font-medium">Ubah</th>
                    <th className="px-6 py-3 font-medium">Hapus</th>
                    <th className="px-6 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {daftar.map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="px-6 py-3">{a.menuId}</td>
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={a.lihat}
                          onChange={() => {}}
                          className="cursor-pointer accent-color-orange-600"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={a.tambah}
                          onChange={() => {}}
                          className="cursor-pointer accent-color-orange-600"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={a.ubah}
                          onChange={() => {}}
                          className="cursor-pointer accent-color-orange-600"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={a.hapus}
                          onChange={() => {}}
                          className="cursor-pointer accent-color-orange-600"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-2">
                          {editId === a.id ? (
                            <button
                              onClick={() => {
                                setEditId(null);
                                muatUlang();
                              }}
                              className="text-gray-500 text-sm underline"
                            >
                              Batal
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(a)}
                              className="p-2 rounded hover:bg-gray-100 text-blue-600"
                              aria-label="Ubah"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
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
          )
        )}
      </div>
    </div>
  );
}