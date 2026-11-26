import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";
import HeaderHalaman from "../../components/headerhalaman";
import JadwalKelas from "../../components/jadwalkelas";
import FormKelas, { type NilaiKelas } from "../../components/formkelas";
import { cariBentrok, validasiKelas, type Kelas } from "../../data";
import { getKelas, getKelasDetail, updateKelas } from "@/lib/api";
import { useCrudNotification } from "@/components/CrudNotification";

export default function UbahKelasPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const kelasId = Number(id);

  const [kelas, setKelas] = useState<Kelas | null>(null);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [nilai, setNilai] = useState<NilaiKelas>({ sesi: 1, hari: [], materi: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
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
      }
    };
    void fetchData();
  }, [kelasId]);

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
    if (pesan) {
      setError(pesan);
      showNotification({ type: "error", title: "Data kelas belum valid", message: pesan });
      return;
    }
    setSaving(true);
    try {
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
}
