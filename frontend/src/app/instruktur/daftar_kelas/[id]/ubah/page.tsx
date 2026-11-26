import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";
import HeaderHalaman from "../../components/headerhalaman";
import { getKelas, updateKelas } from "@/lib/api";
import { type Kelas } from "../kelasbaru/data";
import FormKelas from "../formkelas";
import { CalendarPlus } from "lucide-react";
import { validasiKelas } from "../data";

export default function UbahKelasPage() {
  const pathname = usePathname();
  const { id: kelasId } = useParams<{ id: string }>();
  const [nilai, setNilai] = useState<Kelas>({ id: Number(kelasId), nama_kelas: "", materi_id: "", sesi_id: 1, hari: [], lokasi_blc_id: 1 });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getKelas(Number(kelasId));
        setNilai({ ...nilai, ...res.data });
      } catch (e) {
        console.error(e);
        setError("Gagal memuat data kelas");
      }
    };
    fetchData();
  }, [kelasId]);

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    const pesan = validasiKelas(nilai.hari, nilai.materi);
    if (pesan) return setError(pesan);
    setSaving(true);
    try {
      await updateKelas(kelasId, { nama_kelas: nilai.nama_kelas, materi_id: nilai.materi, sesi_id: nilai.sesi, hari: nilai.hari, lokasi_blc_id: 1 });
      window.location.href = "/instruktur/daftar_kelas";
    } catch (e) {
      console.error(e);
      setError("Gagal memperbarui kelas");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <HeaderHalaman
        icon={CalendarPlus}
        judul="Ubah Kelas"
        kembali="/instruktur/daftar_kelas"
        deskripsi="Perbarui detail kelas berikut"
      />
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {saving && <p className="mt-2 text-orange-600">Menyimpan...</p>}
      <FormKelas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan} />
    </>
  );
}
