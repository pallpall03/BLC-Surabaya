"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, PencilLine } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
import JadwalKelas from "../../components/jadwalkelas";
import FormKelas, { type NilaiKelas } from "../../components/formkelas";
import { cariBentrok, KELAS_CONTOH, validasiKelas } from "../../data";

export default function UbahKelasPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  // TODO: ambil data kelas dari API, mis. GET /api/kelas/{id}
  const kelas = KELAS_CONTOH.find((k) => k.id === Number(id));

  const [nilai, setNilai] = useState<NilaiKelas>({
    sesi: kelas?.sesi ?? 1, hari: kelas?.hari ?? [], materi: kelas?.materi ?? "",
  });
  const [error, setError] = useState("");

  if (!kelas) {
    return <div className="card"><div className="card-body text-center text-gray-600 py-15">Kelas tidak ditemukan.</div></div>;
  }

  const lain = KELAS_CONTOH.filter((k) => k.id !== kelas.id); // jadwal kelas lain (kelas ini tidak dihitung bentrok)
  const bentrok = cariBentrok(lain, nilai.sesi, nilai.hari);

  const klikKosong = (hari: string, sesi: number) => {
    setError("");
    setNilai((n) =>
      n.sesi !== sesi
        ? { ...n, sesi, hari: [hari] }
        : { ...n, hari: n.hari.includes(hari) ? n.hari.filter((h) => h !== hari) : [...n.hari, hari] }
    );
  };

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    const pesan = validasiKelas(nilai.hari, nilai.materi, bentrok);
    if (pesan) return setError(pesan);
    // TODO: kirim ke API Laravel, mis. PUT /api/kelas/{id}
    router.push("/instruktur/daftar_kelas");
  };

  return (
    <>
      <HeaderHalaman icon={PencilLine} judul="Ubah kelas" kembali="/instruktur/daftar_kelas" deskripsi={`Mengubah profil kelas ${kelas.nama}`} />

      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title d-flex align-items-center gap-2 fs-4 fw-bold">
            <Clock size={20} className="text-primary" /> Jadwal kelas lain
          </div>
        </div>
        <div className="card-body">
          <JadwalKelas kelas={lain} dipilih={nilai} onKlikKosong={klikKosong} />
        </div>
      </div>

      <FormKelas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan}
        bentrok={bentrok} error={error} kembali="/instruktur/daftar_kelas" />
    </>
  );
}
