"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Clock } from "lucide-react";
import HeaderHalaman from "../components/headerhalaman";
import JadwalKelas from "../components/jadwalkelas";
import FormKelas, { type NilaiKelas } from "../components/formkelas";
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
    <>
      <HeaderHalaman icon={CalendarPlus} judul="Buat kelas baru" kembali="/instruktur/daftar_kelas"
        deskripsi="Lihat jadwal di bawah untuk memilih sesi dan hari yang masih kosong." />

      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title d-flex align-items-center gap-2 fs-4 fw-bold">
            <Clock size={20} className="text-primary" /> Jadwal kelas aktif
          </div>
        </div>
        <div className="card-body">
          <JadwalKelas kelas={KELAS_CONTOH} dipilih={nilai} onKlikKosong={klikKosong} />
        </div>
      </div>

      <FormKelas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan}
        saving={saving} bentrok={bentrok} error={error} kembali="/instruktur/daftar_kelas" />
    </>
  );
}
