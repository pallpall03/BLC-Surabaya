"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, PencilLine } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
import JadwalKelas from "../../components/jadwalkelas";
import FormKelas, { type NilaiKelas } from "../../components/formkelas";
import { cariBentrok, validasiKelas, type Kelas } from "../../data";
import { getKelas, getKelasDetail, updateKelas } from "@/lib/api";

export default function UbahKelasPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const kelasId = Number(id);

  const [kelas, setKelas] = useState<Kelas | null>(null);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [nilai, setNilai] = useState<NilaiKelas>({ sesi: 1, hari: [], materi: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

<<<<<<< HEAD
  if (!kelas) {
    return <div className="card"><div className="card-body text-center text-gray-600 py-15">Kelas tidak ditemukan.</div></div>;
  }
=======
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kelasRes, listRes] = await Promise.all([
          getKelasDetail(kelasId),
          getKelas(),
        ]);
        setKelas(kelasRes.data);
        setKelasList(listRes.data);
        setNilai({ sesi: kelasRes.data.sesi, hari: kelasRes.data.hari, materi: kelasRes.data.materi });
      } catch (e) {
        console.error(e);
        setError("Gagal memuat data kelas");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [kelasId]);
>>>>>>> 76d4f7dd648545a996f558989eb874d401051596

  const lain = kelasList.filter((k) => k.id !== kelasId);
  const bentrok = cariBentrok(lain, nilai.sesi, nilai.hari);

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
      await updateKelas(kelasId, { sesi_id: nilai.sesi, hari: nilai.hari, materi_id: nilai.materi });
      router.push("/instruktur/daftar_kelas");
    } catch (e) {
      console.error(e);
      setError("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
          </div>
        </div>
      </main>
    );
  }

  if (!kelas) return <main className="p-10 text-center text-slate-600">Kelas tidak ditemukan.</main>;

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
