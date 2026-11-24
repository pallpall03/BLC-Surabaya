"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity, CalendarDays, CheckCircle2, Clock, Pencil, Plus, Printer, RotateCcw, Search, SearchX, Trash2, UserPlus, Users,
  type LucideIcon,
} from "lucide-react";
import HeaderHalaman from "./components/headerhalaman";
import JadwalKelas from "./components/jadwalkelas";
import { jamSesi, KELAS_CONTOH, type Kelas } from "./data";

type Filter = "Semua" | "Aktif" | "Selesai";

export default function DaftarKelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>(KELAS_CONTOH);
  const [filter, setFilter] = useState<Filter>("Semua");
  const [cari, setCari] = useState("");
  const [pesan, setPesan] = useState("");

  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return kelas.filter((k) => (filter === "Semua" || k.status === filter) && (!q || k.nama.toLowerCase().includes(q) || k.materi.toLowerCase().includes(q)));
  }, [kelas, filter, cari]);

  const toast = (t: string) => { setPesan(t); setTimeout(() => setPesan(""), 3000); };
  const ubahStatus = (id: number, status: Kelas["status"]) => {
    // TODO: kirim perubahan status ke API
    setKelas((d) => d.map((k) => (k.id === id ? { ...k, status } : k)));
    toast(status === "Selesai" ? "Kelas ditandai selesai." : "Kelas diaktifkan kembali.");
  };
  const hapus = (k: Kelas) => {
    if (!window.confirm(`Hapus kelas ${k.nama}?`)) return;
    setKelas((d) => d.filter((x) => x.id !== k.id));
    toast("Kelas dihapus.");
  };

  const jumlah = (f: Filter) => (f === "Semua" ? kelas.length : kelas.filter((k) => k.status === f).length);

  const statistik: { kunci: Filter; label: string; icon: LucideIcon; warna: string; aktif: string }[] = [
    { kunci: "Semua", label: "Semua kelas", icon: CalendarDays, warna: "bg-light-primary text-primary", aktif: "border-primary" },
    { kunci: "Aktif", label: "Kelas aktif", icon: Activity, warna: "bg-light-success text-success", aktif: "border-success" },
    { kunci: "Selesai", label: "Kelas selesai", icon: CheckCircle2, warna: "bg-light text-gray-600", aktif: "border-gray-500" },
  ];

  return (
    <>
      <HeaderHalaman icon={CalendarDays} judul="Daftar kelas" deskripsi="Lihat jadwal kelas aktif dan kelola semua kelas." />

      {/* Jadwal kelas aktif */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title d-flex align-items-center gap-2 fs-4 fw-bold">
            <Clock size={20} className="text-primary" /> Jadwal kelas aktif
          </div>
          <div className="card-toolbar">
            {/* TODO: ganti dengan ekspor PDF dari backend jika perlu */}
            <button type="button" onClick={() => window.print()} className="btn btn-sm btn-light-primary d-inline-flex align-items-center gap-2">
              <Printer size={16} /> Cetak jadwal
            </button>
          </div>
        </div>
        <div className="card-body">
          <JadwalKelas kelas={kelas} />
        </div>
      </div>

      {/* Kartu statistik (bisa diklik untuk memfilter) */}
      <div className="row g-5 g-xl-6 mb-6">
        {statistik.map(({ kunci, label, icon: Icon, warna, aktif }) => (
          <div className="col-sm-4" key={kunci}>
            <button type="button" onClick={() => setFilter(kunci)} aria-pressed={filter === kunci}
              className={`card card-body flex-row align-items-center gap-4 w-100 text-start border border-2 ${filter === kunci ? aktif : "border-gray-200"}`}>
              <span className="symbol symbol-50px">
                <span className={`symbol-label ${warna}`}><Icon size={24} /></span>
              </span>
              <span className="d-flex flex-column">
                <span className="fs-2x fw-bold text-gray-900 lh-1">{jumlah(kunci)}</span>
                <span className="fs-7 text-gray-500 mt-1">{label}</span>
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Semua kelas */}
      <div className="card">
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <div className="d-flex align-items-center position-relative my-1">
              <Search size={18} className="position-absolute ms-5 text-gray-500" style={{ pointerEvents: "none" }} />
              <input type="search" value={cari} onChange={(e) => setCari(e.target.value)}
                placeholder="Cari nama kelas atau materi" aria-label="Cari kelas"
                className="form-control form-control-solid w-250px ps-14" />
            </div>
          </div>
          <div className="card-toolbar">
            <Link href="/instruktur/daftar_kelas/kelasbaru" className="btn btn-sm btn-primary d-inline-flex align-items-center gap-2">
              <Plus size={18} /> Buat kelas baru
            </Link>
          </div>
        </div>

        <div className="card-body py-4">
          {tampil.length === 0 ? (
            <div className="d-flex flex-column align-items-center gap-3 text-center py-15">
              <span className="symbol symbol-80px symbol-circle">
                <span className="symbol-label bg-light-primary text-primary"><SearchX size={32} /></span>
              </span>
              <p className="fs-5 fw-bold text-gray-900 mb-0">Tidak ada kelas yang cocok</p>
              <p className="fs-7 text-gray-500 mb-0">Ubah kata kunci atau pilih filter lain.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                    <th>Kelas</th><th>Sesi</th><th>Hari</th><th>Materi</th><th>Status</th><th>Peserta</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-semibold">
                  {tampil.map((k) => (
                    <tr key={k.id}>
                      <td>
                        <span className="d-block fw-bold text-gray-900">{k.nama}</span>
                        <span className="fs-8 text-gray-500">{k.tanggal}</span>
                      </td>
                      <td>
                        <span className="d-block">Sesi {k.sesi}</span>
                        <span className="fs-8 text-gray-500">{jamSesi(k.sesi)}</span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {k.hari.map((h) => <span key={h} className="badge badge-light-info fs-8 py-2 px-3">{h}</span>)}
                        </div>
                      </td>
                      <td>{k.materi}</td>
                      <td>
                        {k.status === "Aktif"
                          ? <span className="badge badge-light-success fs-8 py-2 px-3">Aktif</span>
                          : <span className="badge badge-light fs-8 py-2 px-3">Selesai</span>}
                      </td>
                      <td><span className="d-inline-flex align-items-center gap-2"><Users size={15} className="text-primary" />{k.totalPeserta}</span></td>
                      <td>
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          {k.status === "Aktif" ? (
                            <>
                              <Link href={`/instruktur/daftar_kelas/${k.id}/peserta`} className="btn btn-sm btn-primary d-inline-flex align-items-center gap-2">
                                <UserPlus size={15} /> Isi peserta
                              </Link>
                              <button type="button" onClick={() => ubahStatus(k.id, "Selesai")} title="Tandai selesai" aria-label={`Tandai ${k.nama} selesai`}
                                className="btn btn-icon btn-sm btn-light btn-active-light-success"><CheckCircle2 size={16} /></button>
                            </>
                          ) : (
                            <button type="button" onClick={() => ubahStatus(k.id, "Aktif")} className="btn btn-sm btn-light d-inline-flex align-items-center gap-2">
                              <RotateCcw size={15} /> Aktifkan
                            </button>
                          )}
                          <Link href={`/instruktur/daftar_kelas/${k.id}/ubah`} title="Ubah" aria-label={`Ubah ${k.nama}`}
                            className="btn btn-icon btn-sm btn-light btn-active-light-primary"><Pencil size={16} /></Link>
                          <button type="button" onClick={() => hapus(k)} title="Hapus" aria-label={`Hapus ${k.nama}`}
                            className="btn btn-icon btn-sm btn-light btn-active-light-danger"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {pesan && (
        <div role="status" className="position-fixed bottom-0 end-0 m-6 rounded px-5 py-3 bg-dark text-white shadow fs-7" style={{ zIndex: 1090 }}>
          {pesan}
        </div>
      )}
    </>
  );
}
