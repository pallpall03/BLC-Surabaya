"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, ClipboardList, Mars, Search, SearchX, UserCheck, UserMinus, UserPlus, Venus } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
import { jamSesi, type Kelas } from "../../data";
import { getKelasDetail, getCalonPeserta, getKelasPeserta, addPesertaToKelas, removePesertaFromKelas, type Peserta } from "@/lib/api";
import { useCrudNotification } from "@/components/CrudNotification";

const JK = ({ jk }: { jk: "L" | "P" }) =>
  jk === "L" ? (
    <span className="badge badge-light-info d-inline-flex align-items-center gap-1 fs-8 py-2 px-3"><Mars size={14} /> L</span>
  ) : (
    <span className="badge badge-light-danger d-inline-flex align-items-center gap-1 fs-8 py-2 px-3"><Venus size={14} /> P</span>
  );

const THEAD = "text-start text-muted fw-bold fs-7 text-uppercase gs-0";

type CalonPeserta = Peserta & { noDaftar: string };

export default function PesertaKelasPage() {
  const { id } = useParams<{ id: string }>();
  const kelasId = Number(id);
  const { showNotification } = useCrudNotification();

  const [kelas, setKelas] = useState<Kelas | null>(null);
  const [tersedia, setTersedia] = useState<CalonPeserta[]>([]);
  const [terdaftar, setTerdaftar] = useState<CalonPeserta[]>([]);
  const [dipilih, setDipilih] = useState<number[]>([]);
  const [cari, setCari] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(true);

  const toast = (t: string, type: "success" | "error" = "success") => {
    showNotification({ type, title: type === "success" ? "Berhasil" : "Operasi gagal", message: t });
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kelasRes, calonRes, terdaftarRes] = await Promise.all([
          getKelasDetail(kelasId),
          getCalonPeserta(kelasId),
          getKelasPeserta(kelasId),
        ]);
        setKelas(kelasRes.data);
        setTersedia(calonRes.data.map(p => ({ ...p, noDaftar: `-` })));
        setTerdaftar(terdaftarRes.data.map(p => ({ ...p, noDaftar: `-` })));
      } catch (e) {
        console.error(e);
        showNotification({ type: "error", title: "Operasi gagal", message: "Gagal memuat data" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [kelasId, showNotification]);

  const daftarArea = useMemo(() => Array.from(new Set(tersedia.map((p) => p.blc))).sort(), [tersedia]);
  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return tersedia.filter((p) => (!q || p.nama.toLowerCase().includes(q) || p.nik.includes(q)) && (!area || p.blc === area));
  }, [tersedia, cari, area]);

  if (loading) {
    return (
      <div className="instruktur-loading" role="status">
        <span className="instruktur-spinner" aria-hidden="true" />
        <span className="fw-semibold text-gray-800">Memuat peserta kelas…</span>
      </div>
    );
  }

  if (!kelas) return <main className="p-10 text-center text-slate-600">Kelas tidak ditemukan.</main>;

  const semua = tampil.length > 0 && tampil.every((p) => dipilih.includes(p.id));
  const toggle = (pid: number) => setDipilih((d) => (d.includes(pid) ? d.filter((x) => x !== pid) : [...d, pid]));
  const toggleSemua = () =>
    setDipilih((d) => (semua ? d.filter((i) => !tampil.some((p) => p.id === i)) : Array.from(new Set([...d, ...tampil.map((p) => p.id)]))));

  const daftarkan = async () => {
    const pindah = tersedia.filter((p) => dipilih.includes(p.id));
    if (pindah.length === 0) {
      toast("Pilih minimal satu peserta untuk didaftarkan.", "error");
      return;
    }
    try {
      await addPesertaToKelas(kelasId, pindah.map(p => p.id));
      setTerdaftar((t) => [...t, ...pindah]);
      setTersedia((t) => t.filter((p) => !dipilih.includes(p.id)));
      setDipilih([]);
      toast(`${pindah.length} peserta didaftarkan.`);
    } catch (e) {
      console.error(e);
      toast("Gagal mendaftarkan peserta", "error");
    }
  };

  const keluarkan = async (p: CalonPeserta) => {
    try {
      await removePesertaFromKelas(kelasId, p.id);
      setTerdaftar((t) => t.filter((x) => x.id !== p.id));
      setTersedia((t) => [...t, p]);
      toast("Peserta dikeluarkan dari kelas.");
    } catch (e) {
      console.error(e);
      toast("Gagal mengeluarkan peserta", "error");
    }
  };

  return (
    <>
      <HeaderHalaman icon={ClipboardList} judul="Pendaftaran peserta" kembali="/instruktur/daftar_kelas"
        deskripsi={
          <span className="d-flex flex-wrap align-items-center gap-2">
            Kelas <b className="text-gray-900">{kelas.nama}</b>
            {kelas.hari.map((h) => <span key={h} className="badge badge-light-info fs-8">{h}</span>)}
            <span>Sesi {kelas.sesi} · {jamSesi(kelas.sesi)}</span>
          </span>
        } />

      {/* Belum terdaftar */}
      <div className="card mb-6">
        <div className="card-header border-0 pt-6">
          <div className="card-title flex-wrap gap-3">
            <span className="d-flex align-items-center gap-2 fs-4 fw-bold">
              <UserPlus size={20} className="text-primary" /> Peserta belum terdaftar
              <span className="badge badge-light-primary fs-8">{tersedia.length}</span>
            </span>
          </div>
          <div className="card-toolbar flex-wrap gap-3">
            <div className="d-flex align-items-center position-relative my-1">
              <Search size={18} className="position-absolute ms-5 text-gray-500" style={{ pointerEvents: "none" }} />
              <input type="search" value={cari} onChange={(e) => setCari(e.target.value)}
                placeholder="Cari nama, NIK, no. pendaftaran" aria-label="Cari peserta"
                className="form-control form-control-solid w-300px ps-14" />
            </div>
            <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Filter area BLC"
              className="form-select form-select-solid w-200px">
              <option value="">Semua area BLC</option>
              {daftarArea.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className="card-body py-4">
          {tampil.length === 0 ? (
            <div className="d-flex flex-column align-items-center gap-3 text-center py-15">
              <span className="symbol symbol-80px symbol-circle">
                <span className="symbol-label bg-light-primary text-primary"><SearchX size={32} /></span>
              </span>
              <p className="fs-6 text-gray-500 mb-0">
                {tersedia.length === 0 ? "Semua peserta sudah didaftarkan." : "Tidak ada peserta yang cocok."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr className={THEAD}>
                    <th className="w-10px pe-2">
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input type="checkbox" className="form-check-input" checked={semua} onChange={toggleSemua} aria-label="Pilih semua" />
                      </div>
                    </th>
                    <th>NIK</th><th>No. pendaftaran</th><th>Nama lengkap</th><th>L/P</th><th>Kategori</th><th>BLC</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-semibold">
                  {tampil.map((p) => (
                    <tr key={p.id} className={dipilih.includes(p.id) ? "table-active" : ""}>
                      <td>
                        <div className="form-check form-check-sm form-check-custom form-check-solid">
                          <input type="checkbox" className="form-check-input" checked={dipilih.includes(p.id)} onChange={() => toggle(p.id)}
                            aria-label={`Pilih ${p.nama}`} />
                        </div>
                      </td>
                      <td>{p.nik}</td>
                      <td>{p.noDaftar}</td>
                      <td className="fw-bold text-gray-900">{p.nama}</td>
                      <td><JK jk={p.jk} /></td>
                      <td><span className="badge badge-light-primary fs-8 py-2 px-3">{p.kategori}</span></td>
                      <td>{p.blc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sudah terdaftar */}
      <div className="card">
        <div className="card-header">
          <div className="card-title d-flex align-items-center gap-2 fs-4 fw-bold">
            <UserCheck size={20} className="text-success" /> Peserta terdaftar
            <span className="badge badge-light-success fs-8">{terdaftar.length}</span>
          </div>
        </div>
        <div className="card-body py-4">
          {terdaftar.length === 0 ? (
            <p className="text-center fs-7 text-gray-500 py-10 mb-0">Belum ada peserta. Centang peserta di atas lalu klik &quot;Daftarkan&quot;.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr className={THEAD}>
                    <th>NIK</th><th>No. pendaftaran</th><th>Nama lengkap</th><th>L/P</th><th>Kategori</th><th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-semibold">
                  {terdaftar.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nik}</td>
                      <td>{p.noDaftar}</td>
                      <td className="fw-bold text-gray-900">{p.nama}</td>
                      <td><JK jk={p.jk} /></td>
                      <td><span className="badge badge-light-primary fs-8 py-2 px-3">{p.kategori}</span></td>
                      <td className="text-end">
                        <button type="button" onClick={() => keluarkan(p)} className="btn btn-sm btn-light-danger d-inline-flex align-items-center gap-2">
                          <UserMinus size={15} /> Keluarkan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {dipilih.length > 0 && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-6 card shadow"
          style={{ zIndex: 1080, width: "min(560px, calc(100% - 2rem))" }}>
          <div className="card-body d-flex align-items-center justify-content-between gap-3 py-4">
            <span className="fs-7 text-gray-600"><b className="text-gray-900">{dipilih.length}</b> peserta dipilih</span>
            <div className="d-flex gap-2">
              <button type="button" onClick={() => setDipilih([])} className="btn btn-sm btn-light">Batal</button>
              <button type="button" onClick={daftarkan} className="btn btn-sm btn-success d-inline-flex align-items-center gap-2">
                <CheckCircle2 size={16} /> Daftarkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
