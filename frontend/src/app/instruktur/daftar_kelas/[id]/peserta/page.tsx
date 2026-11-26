import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
import { getCalonPeserta, addPesertaToKelas } from "@/lib/api";
import { type Peserta } from "../../_home/data";

export default function DaftarPesertaKelasPage() {
  const pathname = usePathname();
  const { id: kelasId } = useParams<{ id: string }>();
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getCalonPeserta(Number(kelasId));
        setPeserta(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [kelasId]);

  return (
    <>
      <HeaderHalaman
        icon={User}
        judul="Daftar Peserta"
        kembali="/instruktur/daftar_kelas"
        deskripsi="Pilih peserta untuk dimasukkan ke kelas"
      />
      {loading ? (
        <div className="mt-4">Memuat data...</div>
      ) : (
        <div className="space-y-4">
          <p className="text-slate-500">
            Kelas ID: {kelasId} - Semua peserta yang belum tergabung
          </p>
          <div className="overflow-x-auto">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="text-center">Pilih</th>
                  <th>Nama</th>
                  <th>NIM/NIK</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {peserta.map((p) => (
                  <tr key={p.id}>
                    <td className="text-center">
                      <label className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(p.id)}
                          onChange={() => {
                            setSelected(
                              selected.includes(p.id)
                                ? selected.filter((id) => id !== p.id)
                                : [...selected, p.id]
                            );
                          }}
                        />
                      </label>
                    </td>
                    <td>{p.nama ?? "-"}</td>
                    <td>{p.nik ?? "-"}</td>
                    <td>{p.email ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                const pesertaIds = selected;
                if (pesertaIds.length === 0) return alert("Pilih minimal 1 peserta");
                addPesertaToKelas(Number(kelasId), pesertaIds);
                setSelected([]);
                alert("Peserta berhasil ditambahkan ke kelas");
              }}
              className="btn btn-primary"
            >
              Masukkan Peserta ke Kelas
            </button>
            <Link
              href="/instruktur/daftar_kelas"
              className="btn btn-outline"
            >
              Batal
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
