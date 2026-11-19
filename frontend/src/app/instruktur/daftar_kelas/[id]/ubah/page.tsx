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
    return <main className="p-10 text-center text-slate-600">Kelas tidak ditemukan.</main>;
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
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <HeaderHalaman icon={PencilLine} judul="Ubah kelas" kembali="/instruktur/daftar_kelas" deskripsi={`Mengubah profil kelas ${kelas.nama}`} />

        <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><Clock size={20} className="text-orange-500" /> Jadwal kelas lain</h2>
          <JadwalKelas kelas={lain} dipilih={nilai} onKlikKosong={klikKosong} />
        </section>

        <FormKelas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan}
          bentrok={bentrok} error={error} kembali="/instruktur/daftar_kelas" />
      </div>
    </main>
  );
}