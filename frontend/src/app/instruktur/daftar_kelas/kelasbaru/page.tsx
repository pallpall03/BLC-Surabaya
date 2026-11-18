"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Clock } from "lucide-react";
import HeaderHalaman from "@/components/instruktur/daftar_kelas/headerhalaman";
import JadwalKelas from "@/components/instruktur/daftar_kelas/jadwalkelas";
import FormKelas, { type NilaiKelas } from "@/components/instruktur/daftar_kelas/formkelas";
import { cariBentrok, KELAS_CONTOH, validasiKelas } from "../data";

export default function BuatKelasPage() {
  const router = useRouter();
  const [nilai, setNilai] = useState<NilaiKelas>({ sesi: 1, hari: [], materi: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const bentrok = cariBentrok(KELAS_CONTOH, nilai.sesi, nilai.hari);

  // Klik sel kosong di jadwal: ganti sesi, atau tambah/hapus hari pada sesi yang sama
  const klikKosong = (hari: string, sesi: number) => {
    setError("");
    setNilai((n) =>
      n.sesi !== sesi
        ? { ...n, sesi, hari: [hari] }
        : { ...n, hari: n.hari.includes(hari) ? n.hari.filter((h) => h !== hari) : [...n.hari, hari] }
    );
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    const pesan = validasiKelas(nilai.hari, nilai.materi, bentrok);
    if (pesan) return setError(pesan);
    setSaving(true);
    try {
      // TODO: kirim ke API Laravel, mis. POST /api/kelas dengan body nilai
      router.push("/instruktur/daftar_kelas");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <HeaderHalaman icon={CalendarPlus} judul="Buat kelas baru" kembali="/instruktur/daftar_kelas"
          deskripsi="Lihat jadwal di bawah untuk memilih sesi dan hari yang masih kosong." />

        <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><Clock size={20} className="text-orange-500" /> Jadwal kelas aktif</h2>
          <JadwalKelas kelas={KELAS_CONTOH} dipilih={nilai} onKlikKosong={klikKosong} />
        </section>

        <FormKelas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan}
          saving={saving} bentrok={bentrok} error={error} kembali="/instruktur/daftar_kelas" />
      </div>
    </main>
  );
}