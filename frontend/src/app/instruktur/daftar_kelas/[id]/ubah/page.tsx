"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, PencilLine } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
import JadwalKelas from "../../components/jadwalkelas";
import FormKelas, { type NilaiKelas, type OpsiKelas } from "../../components/formkelas";
import { cariBentrok, validasiKelas, type Kelas } from "../../data";
<<<<<<< HEAD
import { getKelas, getKelasDetail, getKelasOpsi, updateKelas } from "@/lib/api";
=======
import { getKelas, getKelasDetail, updateKelas } from "@/lib/api";
import { useCrudNotification } from "@/components/CrudNotification";
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

export default function UbahKelasPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const kelasId = Number(id);
  const [kelas, setKelas] = useState<Kelas | null>(null);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [nilai, setNilai] = useState<NilaiKelas>({ nama: "", sesi: 0, hari: [], materi: "", lokasiBlcId: 0 });
  const [opsi, setOpsi] = useState<OpsiKelas>({ sesi: [], materi: [], blc: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
    Promise.all([getKelasDetail(kelasId), getKelas(), getKelasOpsi()]).then(([detailRes, listRes, opsiRes]) => {
      const data = detailRes.data;
      setKelas(data);
      setKelasList(listRes.data);
      setOpsi(opsiRes.data);
      setNilai({ nama: data.nama, sesi: data.sesi_id, hari: data.hari, materi: data.materi_id, lokasiBlcId: data.lokasi_blc_id });
    }).catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat data kelas"))
      .finally(() => setLoading(false));
=======
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kelasRes, listRes] = await Promise.all([
          getKelasDetail(kelasId),
          getKelas(),
        ]);
        setKelas(kelasRes.data);
        setKelasList(listRes.data ?? []);
        setNilai({ sesi: kelasRes.data.sesi, hari: kelasRes.data.hari, materi: kelasRes.data.materi });
      } catch (e) {
        console.error(e);
        setError("Gagal memuat data kelas");
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
  }, [kelasId]);

  const lain = kelasList.filter((k) => k.id !== kelasId);
  const bentrok = cariBentrok(lain, nilai.sesi, nilai.hari);
  const klikKosong = (hari: string, sesi: number) => {
    setError("");
    setNilai((n) => n.sesi !== sesi ? { ...n, sesi, hari: [hari] } : { ...n, hari: n.hari.includes(hari) ? n.hari.filter((h) => h !== hari) : [...n.hari, hari] });
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nilai.nama.trim()) return setError("Nama kelas wajib diisi.");
    if (!nilai.lokasiBlcId) return setError("Pilih BLC.");
    const pesan = validasiKelas(nilai.hari, nilai.materi, bentrok);
    if (pesan) {
      setError(pesan);
      showNotification({ type: "error", title: "Data kelas belum valid", message: pesan });
      return;
    }
    setSaving(true);
    try {
<<<<<<< HEAD
      await updateKelas(kelasId, {
        nama_kelas: nilai.nama.trim(), sesi_id: nilai.sesi, hari: nilai.hari,
        materi_id: nilai.materi, lokasi_blc_id: nilai.lokasiBlcId,
      });
      router.push("/instruktur/daftar_kelas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan perubahan");
    } finally { setSaving(false); }
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-orange-50/60"><div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></main>;
  if (!kelas) return <main className="p-10 text-center text-red-600">{error || "Kelas tidak ditemukan."}</main>;

  return <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8"><div className="mx-auto max-w-5xl">
    <HeaderHalaman icon={PencilLine} judul="Ubah kelas" kembali="/instruktur/daftar_kelas" deskripsi={`Mengubah profil kelas ${kelas.nama}`} />
    <section className="mb-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-300/40">
      <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><Clock size={20} className="text-orange-500" /> Jadwal kelas lain</h2>
      <JadwalKelas kelas={lain} dipilih={nilai} onKlikKosong={klikKosong} sesi={opsi.sesi} />
    </section>
    <FormKelas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan} saving={saving}
      bentrok={bentrok} error={error} kembali="/instruktur/daftar_kelas" opsi={opsi} />
  </div></main>;
=======
      await updateKelas(kelasId, { sesi_id: nilai.sesi, hari: nilai.hari, materi_id: nilai.materi });
      showNotification({ type: "success", title: "Kelas berhasil diperbarui", message: "Perubahan kelas berhasil disimpan." });
      router.push("/instruktur/daftar_kelas");
    } catch (e) {
      console.error(e);
      const pesan = e instanceof Error ? e.message : "Gagal menyimpan perubahan";
      setError(pesan);
      showNotification({ type: "error", title: "Kelas gagal diperbarui", message: pesan });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="instruktur-loading" role="status">
        <span className="instruktur-spinner" aria-hidden="true" />
        <span className="fw-semibold text-gray-800">Memuat data kelas…</span>
      </div>
    );
  }

  if (!kelas) {
    return (
      <div className="card"><div className="card-body text-center text-gray-600 py-15">
        {error || "Kelas tidak ditemukan."}
      </div></div>
    );
  }

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
        saving={saving} bentrok={bentrok} error={error} kembali="/instruktur/daftar_kelas" />
    </>
  );
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
}
