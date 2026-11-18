// DATA HARDCODE SEMENTARA untuk menu Daftar Kelas.
// Saat API backend siap, hapus data contoh di bawah dan ganti dengan fetch ke API.

export const SESI = [
    { no: 1, jam: "07.30-09.00" },
    { no: 2, jam: "09.00-10.30" },
    { no: 3, jam: "10.30-12.00" },
    { no: 4, jam: "13.00-14.30" },
    { no: 5, jam: "14.30-16.00" },
  ];
  export const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  export const MATERI = ["APLIKASI PERKANTORAN", "DESAIN GRAFIS"];
  
  export type Kelas = {
    id: number;
    tanggal: string;
    nama: string;
    sesi: number;
    hari: string[];
    materi: string;
    status: "Aktif" | "Selesai";
    totalPeserta: number;
  };
  
  export const KELAS_CONTOH: Kelas[] = [
    { id: 3278, tanggal: "24-JUL-26", nama: "Simok-APL-1", sesi: 1, hari: ["Selasa", "Kamis"], materi: "APLIKASI PERKANTORAN", status: "Aktif", totalPeserta: 5 },
    { id: 3277, tanggal: "22-MAY-26", nama: "Simok-APL-2", sesi: 2, hari: ["Rabu", "Jumat"], materi: "APLIKASI PERKANTORAN", status: "Aktif", totalPeserta: 3 },
    { id: 3276, tanggal: "12-MAY-26", nama: "Simok-APL-3", sesi: 3, hari: ["Selasa", "Jumat"], materi: "APLIKASI PERKANTORAN", status: "Aktif", totalPeserta: 3 },
    { id: 3100, tanggal: "12-NOV-24", nama: "Simok-DES-1", sesi: 1, hari: ["Jumat"], materi: "DESAIN GRAFIS", status: "Selesai", totalPeserta: 4 },
    { id: 3101, tanggal: "12-NOV-24", nama: "Simok-APL-5", sesi: 5, hari: ["Kamis"], materi: "APLIKASI PERKANTORAN", status: "Selesai", totalPeserta: 4 },
  ];
  
  export type CalonPeserta = {
    id: number; nik: string; noDaftar: string; nama: string; jk: "L" | "P"; kategori: string; blc: string;
  };
  export const CALON_PESERTA: CalonPeserta[] = [
    { id: 1, nik: "3578000000000001", noDaftar: "14489/34/F-I/2026", nama: "Contoh Peserta Satu", jk: "L", kategori: "SD", blc: "Gunung Anyar" },
    { id: 2, nik: "3578000000000002", noDaftar: "14488/34/F-I/2026", nama: "Contoh Peserta Dua", jk: "L", kategori: "SD", blc: "Gunung Anyar" },
    { id: 3, nik: "3578000000000003", noDaftar: "14487/34/F-I/2026", nama: "Contoh Peserta Tiga", jk: "P", kategori: "SD", blc: "Bendul Merisi" },
    { id: 4, nik: "3578000000000004", noDaftar: "14486/34/F-I/2026", nama: "Contoh Peserta Empat", jk: "P", kategori: "SMP", blc: "Bendul Merisi" },
    { id: 5, nik: "3578000000000005", noDaftar: "14485/34/F-I/2026", nama: "Contoh Peserta Lima", jk: "L", kategori: "SD", blc: "Gunung Anyar" },
    { id: 6, nik: "3578000000000006", noDaftar: "14484/34/F-I/2026", nama: "Contoh Peserta Enam", jk: "L", kategori: "SMP", blc: "Bendul Merisi" },
  ];
  
  export const jamSesi = (no: number) => SESI.find((s) => s.no === no)?.jam ?? "";
  
  /** Hari yang bentrok: sudah dipakai kelas aktif lain pada sesi yang sama. */
  export function cariBentrok(lain: Kelas[], sesi: number, hari: string[]) {
    return hari.filter((h) => lain.some((k) => k.status === "Aktif" && k.sesi === sesi && k.hari.includes(h)));
  }
  
  export function validasiKelas(hari: string[], materi: string, bentrok: string[]) {
    if (hari.length === 0) return "Pilih minimal satu hari.";
    if (!materi) return "Pilih materi kelas.";
    if (bentrok.length) return `Jadwal bentrok pada hari ${bentrok.join(", ")}.`;
    return "";
  }