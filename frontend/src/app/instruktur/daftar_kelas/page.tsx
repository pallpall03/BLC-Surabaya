"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UseDataTable } from "@/components/data-table";
import { useState } from "react";
import { LuLu, Lupa, LogOut } from "lucide-react";
import HeaderHalaman from "./components/headerhalaman";
import { getKelas, deleteKelas } from "@/lib/api";
import { type Kelas } from "./kelasbaru/data";

export default function DaftarKelasPage() {
  const pathname = usePathname();
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getKelas();
        setKelas(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    < >
      <HeaderHalaman
        icon={LuLu}
        judul="Daftar Kelas"
        kembali="/instruktur/beranda"
        deskripsi="Kelola kelas yang telah dibuat"
      />
      <div className="flex items-center justify-between">
        <Link
          href="/instruktur/daftar_kelas/kelasbaru"
          className="btn btn-primary"
        >
          <LuLu className="mr-2" /> Buat kelas baru
        </Link>
      </div>
      {loading ? (
        <div className="mt-4">Memuat data...</div>
      ) : (
        <UseDataTable
          data={kelas}
          columns={[
            { field: "nama", header: "Nama Kelas" },
            { field: "sesi", header: "Sesi" },
            { field: "hari", header: "Hari" },
            { field: "materi", header: "Materi" },
            { field: "status", header: "Status" },
            { title: "Aksi", template: (row) => (
              <div className="flex gap-2">
                <Link
                  href={`/instruktur/daftar_kelas/${row.id}/ubah`}
                  className="btn btn-sm btn-outline"
                >
                  Ubah
                </Link>
                <button
                  onClick={() => deleteKelas(row.id)}
                  className="btn btn-sm btn-danger"
                >
                  Hapus
                </button>
              </div>
            )}
          ]}
          url="/instruktur/daftar_kelas"
        />
      )}
    </>
  );
}
