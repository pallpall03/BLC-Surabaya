// Hanya tipe, konstanta UI, dan helper validasi — tidak ada data contoh.
export const SESI = [
  { no: 1, jam: "07.30-09.00" },
  { no: 2, jam: "09.00-10.30" },
  { no: 3, jam: "10.30-12.00" },
  { no: 4, jam: "13.00-14.30" },
  { no: 5, jam: "14.30-16.00" },
];
export const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
export const MATERI = ["APLIKASI PERKANTORAN", "DESAIN GRAFIS"];

import type { Kelas } from "@/lib/api";
export type { Kelas } from "@/lib/api";

export type CalonPeserta = {
  id: number; nik: string; noDaftar: string; nama: string; jk: "L" | "P"; kategori: string; blc: string;
};

export const jamSesi = (no: number) => SESI.find((s) => s.no === no)?.jam ?? "";

/** Hari yang bentrok: sudah dipakai kelas aktif lain pada sesi yang sama. */
export function cariBentrok(lain: Kelas[], sesi: number, hari: string[]) {
  return hari.filter((h) => lain.some((k) => k.status === "Aktif" && k.sesi_id === sesi && k.hari.includes(h)));
}

export function validasiKelas(hari: string[], materi: string, bentrok: string[]) {
  if (hari.length === 0) return "Pilih minimal satu hari.";
  if (!materi) return "Pilih materi kelas.";
  if (bentrok.length) return `Jadwal bentrok pada hari ${bentrok.join(", ")}.`;
  return "";
}