"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, MessageSquare, Search, Trash2, X } from "lucide-react";
import {
  ambilBukuTamu,
  hapusBukuTamu,
  tandaiDibaca,
  type BukuTamu,
} from "@/lib/buku-tamu";

const BARIS = 10;

export default function HalamanBukuTamuAdmin() {
  const [daftar, setDaftar] = useState<BukuTamu[]>([]);
  const [memuat, setMemuat] = useState<boolean>(true);
  const [tab, setTab] = useState<"semua" | "baru" | "dibaca">("semua");
  const [cari, setCari] = useState("");
  const [halaman, setHalaman] = useState<number>(1);
  const [detail, setDetail] = useState<BukuTamu | null>(null);

  useEffect(() => {
    ambilBukuTamu()
      .then(setDaftar)
      .finally(() => setMemuat(false));
  }, []);

  const jumlahBaru = daftar.filter((t) => !t.dibaca).length;

  const hasil = useMemo(
    () =>
      daftar.filter(
        (t) =>
          (tab === "semua" || (tab === "baru" ? !t.dibaca : t.dibaca)) &&
          `${t.nama} ${t.instansi} ${t.pesan}`.toLowerCase().includes(cari.toLowerCase())
      ),
    [daftar, tab, cari]
  );
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS));
  const halamanAman = Math.min(halaman, totalHalaman);
  const awal = (halamanAman - 1) * BARIS;
  const tampil = hasil.slice(awal, awal + BARIS);

  async function ubahStatus(t: BukuTamu, dibaca: boolean) {
    await tandaiDibaca(t.id, dibaca);
    setDaftar((lama) => lama.map((x) => (x.id === t.id ? { ...x, dibaca } : x)));
    setDetail((d) => (d && d.id === t.id ? { ...d, dibaca } : d));
  }

  // membuka detail otomatis menandai sudah dibaca
  function bukaDetail(t: BukuTamu) {
    setDetail(t);
    if (!t.dibaca) ubahStatus(t, true);
  }

  async function handleHapus(t: BukuTamu) {
    if (!window.confirm(`Hapus pesan dari "${t.nama}"?`)) return;
    await hapusBukuTamu(t.id);
    setDaftar((lama) => lama.filter((x) => x.id !== t.id));
    setDetail(null);
  }

  const tabs = [
    { kode: "semua" as const, label: "Semua", jumlah: daftar.length },
    { kode: "baru" as const, label: "Belum dibaca", jumlah: jumlahBaru },
    { kode: "dibaca" as const, label: "Sudah dibaca", jumlah: daftar.length - jumlahBaru },
  ];

  return (
    <div>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* BAR ATAS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              Pesan Buku Tamu
              {jumlahBaru > 0 && (
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
                  {jumlahBaru} baru
                </span>
              )}
            </h3>
            <p className="text-sm text-slate-400">Pesan dari pengunjung website BLC</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={cari}
              onChange={(e) => {
                setCari(e.target.value);
                setHalaman(1);
              }}
              placeholder="Cari nama atau pesan..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        {/* TAB */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-6 py-3">
          {tabs.map((t) => (
            <button
              key={t.kode}
              onClick={() => {
                setTab(t.kode);
                setHalaman(1);
              }}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm transition ${
                tab === t.kode
                  ? "bg-violet-600 font-medium text-white shadow-sm shadow-violet-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  tab === t.kode ? "bg-white/25" : "bg-white text-slate-500"
                }`}
              >
                {t.jumlah}
              </span>
            </button>
          ))}
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-semibold">No</th>
                <th className="px-4 py-3 font-semibold">Pengirim</th>
                <th className="px-4 py-3 font-semibold">Pesan</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memuat ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : tampil.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <MessageSquare size={36} />
                      <p>{cari ? "Pesan tidak ditemukan." : "Belum ada pesan."}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tampil.map((t, i) => (
                  <tr key={t.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-3.5 text-slate-400">{awal + i + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                          {t.nama.charAt(0).toUpperCase()}
                        </span>
                        <div className="leading-tight">
                          <p className={t.dibaca ? "text-slate-700" : "font-semibold text-slate-900"}>
                            {t.nama}
                          </p>
                          <p className="text-xs text-slate-400">{t.instansi || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs px-4 py-3.5">
                      <p className="line-clamp-2 text-slate-600">{t.pesan}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">{t.tanggal}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          t.dibaca ? "bg-slate-100 text-slate-500" : "bg-violet-100 text-violet-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            t.dibaca ? "bg-slate-400" : "bg-violet-500"
                          }`}
                        />
                        {t.dibaca ? "Dibaca" : "Baru"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => bukaDetail(t)}
                          className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600 transition hover:bg-violet-100"
                        >
                          <Eye size={14} /> Lihat
                        </button>
                        <button
                          onClick={() => handleHapus(t)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BAR BAWAH */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
          <span>
            Menampilkan {hasil.length === 0 ? 0 : awal + 1}–{Math.min(awal + BARIS, hasil.length)}{" "}
            dari {hasil.length} pesan
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setHalaman(halamanAman - 1)}
              disabled={halamanAman === 1}
              className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="px-2">
              {halamanAman} / {totalHalaman}
            </span>
            <button
              onClick={() => setHalaman(halamanAman + 1)}
              disabled={halamanAman === totalHalaman}
              className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </section>

      {/* MODAL DETAIL */}
      {detail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h4 className="font-semibold text-slate-800">Detail Pesan</h4>
              <button
                onClick={() => setDetail(null)}
                aria-label="Tutup"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Nama</p>
                  <p className="font-medium text-slate-800">{detail.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Asal</p>
                  <p className="text-slate-700">{detail.instansi || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="break-all text-slate-700">{detail.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Telepon</p>
                  <p className="text-slate-700">{detail.telepon || "-"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400">Dikirim pada {detail.tanggal}</p>
                <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-slate-700">
                  {detail.pesan}
                </p>
              </div>
            </div>

            <div className="flex justify-between gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => handleHapus(detail)}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={15} /> Hapus
              </button>
              <button
                onClick={() => ubahStatus(detail, !detail.dibaca)}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                {detail.dibaca ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}