"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CalendarPlus, Clock, RotateCcw } from "lucide-react";
import HeaderHalaman from "../components/headerhalaman";
import JadwalKelas from "../components/jadwalkelas";
import FormKelas, { type NilaiKelas } from "../components/formkelas";
import { cariBentrok, validasiKelas, type Kelas } from "../data";
import { getKelas, createKelas } from "@/lib/api";

export default function BuatKelasPage() {
  const router = useRouter();
  const [nilai, setNilai] = useState<NilaiKelas>({ sesi: 1, hari: [], materi: "" });
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aktif = true;
    void getKelas()
      .then((res) => {
        if (aktif) setKelasList(res.data ?? []);
      })
      .catch(() => {
        if (aktif) setLoadError("Jadwal kelas belum berhasil dimuat. Coba lagi beberapa saat.");
      })
      .finally(() => {
        if (aktif) setLoading(false);
      });
    return () => {
      aktif = false;
    };
  }, [reloadKey]);

  const muatUlang = () => {
    setLoading(true);
    setLoadError("");
    setReloadKey((value) => value + 1);
  };

  const bentrok = cariBentrok(kelasList, nilai.sesi, nilai.hari);

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
    } catch {
      setError("Kelas belum berhasil disimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="instruktur-loading" role="status">
        <span className="instruktur-spinner" aria-hidden="true" />
        <span className="fw-semibold text-gray-800">Memuat jadwal kelas…</span>
      </div>
    );
  }

  return (
    <main className="instruktur-main">
      <div className="mx-auto w-full max-w-5xl">
        <HeaderHalaman icon={CalendarPlus} judul="Buat kelas baru" kembali="/instruktur/daftar_kelas"
          deskripsi="Lihat jadwal di bawah untuk memilih sesi dan hari yang masih kosong." />

        <section className="instruktur-card mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><Clock size={20} className="text-orange-500" /> Jadwal kelas aktif</h2>
          {loadError ? (
            <div className="d-flex flex-column align-items-center gap-3 py-8 text-center" role="alert">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <AlertTriangle size={24} />
              </span>
              <div>
                <p className="fs-6 fw-semibold text-gray-900 mb-1">Jadwal kelas tidak dapat dimuat</p>
                <p className="fs-7 text-gray-500 mb-0">{loadError}</p>
              </div>
              <button type="button" className="btn btn-sm btn-primary d-inline-flex align-items-center gap-2" onClick={muatUlang}>
                <RotateCcw size={16} /> Coba lagi
              </button>
            </div>
          ) : (
            <JadwalKelas kelas={kelasList} dipilih={nilai} onKlikKosong={klikKosong} />
          )}
        </section>

        {!loadError && (
          <FormKelas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan}
            saving={saving} bentrok={bentrok} error={error} kembali="/instruktur/daftar_kelas" />
        )}
      </div>
    </main>
  );
}
