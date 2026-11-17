"use client";

import { useState } from "react";
import { dataLokasi } from "@/lib/data-dummy";

export default function HalamanLokasi() {
  const [cari, setCari] = useState("");

  const hasil = dataLokasi.filter((l) =>
    l.nama.toLowerCase().includes(cari.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Lokasi BLC</h1>

      <input
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        placeholder="Cari lokasi..."
        className="w-full md:w-80 border rounded-lg px-4 py-2 mb-8"
      />

      {hasil.length === 0 ? (
        <p className="text-gray-500">Lokasi tidak ditemukan.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {hasil.map((l) => (
            <div key={l.id} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-2">{l.nama}</h2>
              <p className="text-gray-600 text-sm">{l.alamat}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}