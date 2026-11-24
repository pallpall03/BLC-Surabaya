"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Clock } from "lucide-react";
import HeaderHalaman from "../components/headerhalaman";
import JadwalKelas from "../components/jadwalkelas";
import FormKelas, { type NilaiKelas } from "../components/formkelas";
import { cariBentrok, validasiKelas, type Kelas } from "../data";
import { getKelas, createKelas } from "@/lib/api";

export default function BuatKelasPage() {
  const router = useRouter();
  const [nilai, setNilai] = useState<NilaiKelas>({ sesi: 1, hari: [], materi: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing kelas for conflict checking
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getKelas();
        setKelasList(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const bentrok = cariBentrok(kelasList, nilai.sesi, nilai.hari);

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
      await createKelas({ nama_kelas: "", materi_id: nilai.materi, sesi_id: nilai.sesi, hari: nilai.hari, lokasi_blc_id: 1 });
      router.push("/instruktur/daftar_kelas");
    } catch (e) {
      console.error(e);
      setError("Gagal membuat kelas");
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

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <HeaderHalaman icon={CalendarPlus} judul="Buat kelas baru" kembali="/instruktur/daftar_kelas"
          deskripsi="Lihat jadwal di bawah untuk memilih sesi dan hari yang masih kosong." />

        <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><Clock size={20} className="text-orange-500" /> Jadwal kelas aktif</h2>
          <JadwalKelas kelas={kelasList} dipilih={nilai} onKlikKosong={klikKosong} />
        </section>

        <FormKelas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan}
          saving={saving} bentrok={bentrok} error={error} kembali="/instruktur/daftar_kelas" />
      </div>
    </main>
  );
}