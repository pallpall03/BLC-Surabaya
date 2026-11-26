"use client";

<<<<<<< HEAD
import { Camera } from "lucide-react";
import FotoKegiatan from "@/components/fotokegiatan";

export default function FotoKegiatanPage() {
  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
=======
import { useMemo, useState } from "react";
import {
  Camera, CalendarDays, Clock, FileText, ImagePlus, Info, Pencil, FilePlus2,
  Printer, Save, Search, CheckSquare, Square, Trash2,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";

type Tab = "isi" | "laporan";
type FotoBaru = { file: File; url: string };
type FotoLaporan = { id: number; tanggal: string; sesi: number; keterangan: string; warna: string };

// TODO: ganti dengan data dari API
const SESI = [
  { id: 1, label: "1 (Jam: 07.30-09.00)" },
  { id: 2, label: "2 (Jam: 09.00-10.30)" },
  { id: 3, label: "3 (Jam: 10.30-12.00)" },
  { id: 4, label: "4 (Jam: 13.00-14.30)" },
];
// TODO: GET /api/foto-kegiatan?tanggal=&sesi= (ada data = mode update)
const TERSIMPAN: Record<string, string> = {
  "2026-11-17|1": "Pengunjung dengan jumlah 4 pelajar SD sedang memanfaatkan fasilitas",
};
// TODO: GET /api/laporan/foto-kegiatan?mulai=&sampai=  (isi url foto asli)
const DATA_LAPORAN: FotoLaporan[] = [
  { id: 1, tanggal: "2026-11-10", sesi: 4, keterangan: "Pengunjung dengan jumlah 4 pelajar SD sedang memanfaatkan fasilitas", warna: "from-orange-300 to-amber-200" },
  { id: 2, tanggal: "2026-11-12", sesi: 3, keterangan: "Pengunjung dengan jumlah 5 pelajar SMK mendaftar pelatihan", warna: "from-sky-300 to-cyan-200" },
  { id: 3, tanggal: "2026-11-16", sesi: 1, keterangan: "Pengunjung dengan jumlah 1 petugas kecamatan sedang memanfaatkan fasilitas", warna: "from-emerald-300 to-lime-200" },
];

const hariIni = () => new Date().toLocaleDateString("en-CA");
const awalBulan = () => hariIni().slice(0, 8) + "01";
const fmt = (t: string) => t.split("-").reverse().join("/");
const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

export default function FotoKegiatanPage() {
  const { showNotification } = useCrudNotification();
  const [tab, setTab] = useState<Tab>("isi");

  // Isi foto
  const [tanggal, setTanggal] = useState(hariIni());
  const [sesi, setSesi] = useState("1");
  const [aktif, setAktif] = useState<{ tanggal: string; sesi: string; update: boolean } | null>(null);
  const [ket, setKet] = useState("");
  const [foto, setFoto] = useState<FotoBaru[]>([]);

  // Laporan
  const [mulai, setMulai] = useState(awalBulan());
  const [sampai, setSampai] = useState(hariIni());
  const [dicari, setDicari] = useState<{ mulai: string; sampai: string } | null>(null);
  const [dipilih, setDipilih] = useState<Set<number>>(new Set());


  const cariForm = () => {
    if (!tanggal) {
      showNotification({ type: "error", title: "Pencarian gagal", message: "Isi tanggal kegiatan." });
      return;
    }
    const tersimpan = TERSIMPAN[`${tanggal}|${sesi}`];
    setKet(tersimpan ?? "Pengunjung dengan jumlah ");
    setFoto([]);
    setAktif({ tanggal, sesi, update: tersimpan !== undefined });
  };

  const tambahFoto = (files: FileList | null) => {
    if (!files) return;
    const baru = Array.from(files).filter((f) => f.type.startsWith("image/")).map((file) => ({ file, url: URL.createObjectURL(file) }));
    setFoto((f) => [...f, ...baru]);
  };
  const hapusFoto = (i: number) => setFoto((f) => { URL.revokeObjectURL(f[i].url); return f.filter((_, x) => x !== i); });

  const simpan = () => {
    if (!ket.trim()) {
      showNotification({ type: "error", title: "Foto kegiatan gagal disimpan", message: "Keterangan wajib diisi." });
      return;
    }
    // TODO: kirim FormData ke API Laravel (tanggal, sesi, keterangan, foto[])
    // aktif.update ? PUT : POST
    showNotification({
      type: "success",
      title: aktif!.update ? "Foto kegiatan diperbarui" : "Foto kegiatan tersimpan",
      message: `${fmt(aktif!.tanggal)} · sesi ${aktif!.sesi} · ${foto.length} foto baru berhasil disimpan.`,
    });
  };

  const hasilLaporan = useMemo(
    () => (dicari ? DATA_LAPORAN.filter((d) => d.tanggal >= dicari.mulai && d.tanggal <= dicari.sampai) : []),
    [dicari]
  );
  const cariLaporan = () => {
    if (!mulai || !sampai) {
      showNotification({ type: "error", title: "Pencarian gagal", message: "Isi tanggal mulai dan sampai." });
      return;
    }
    if (mulai > sampai) {
      showNotification({ type: "error", title: "Pencarian gagal", message: "Tanggal mulai tidak boleh melewati tanggal sampai." });
      return;
    }
    setDicari({ mulai, sampai });
    setDipilih(new Set());
  };
  const toggleFoto = (id: number) => setDipilih((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });
  const semuaDipilih = hasilLaporan.length > 0 && dipilih.size === hasilLaporan.length;
  const pilihSemua = () => setDipilih(semuaDipilih ? new Set() : new Set(hasilLaporan.map((f) => f.id)));

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Banner */}
        <div className="instruktur-page-header mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50 print:hidden">
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25"><Camera size={28} /></span>
          <div><h1 className="text-2xl font-semibold">Foto &amp; laporan kegiatan pengunjung</h1><p className="text-sm text-orange-50">Tulis laporan sekaligus unggah, ubah, dan kelola foto untuk seluruh BLC.</p></div>
        </div>
        <FotoKegiatan />
      </div>
<<<<<<< HEAD
=======

>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
    </main>
  );
}
