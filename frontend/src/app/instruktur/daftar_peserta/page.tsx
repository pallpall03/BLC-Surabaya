"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, ChevronLeft, ChevronRight, CircleDashed, Fingerprint, LayoutGrid, LayoutList,
  MapPin, Mars, Pencil, Plus, Search, SearchX, Trash2, Users, Venus, X,
  type LucideIcon,
} from "lucide-react";

import HeaderHalaman from "../daftar_kelas/components/headerhalaman";
import { useCrudNotification } from "@/components/CrudNotification";

type Peserta = { id: number; nik: string; nama: string; blc: string; jk: "L" | "P"; tervalidasi: boolean };
type StatusFilter = "semua" | "valid" | "non";

// TODO: ganti dengan fetch ke API Laravel, mis. GET /api/peserta
const DATA_AWAL: Peserta[] = [
  { id: 1, nik: "0", nama: "Ahmat Ilham Khoirut Difin", blc: "Gunung Anyar", jk: "L", tervalidasi: true },
  { id: 2, nik: "00", nama: "Imelda", blc: "Gunung Anyar", jk: "P", tervalidasi: true },
  { id: 3, nik: "000", nama: "Aurelia Azzahra", blc: "Gunung Anyar", jk: "P", tervalidasi: true },
  { id: 4, nik: "0000", nama: "Javier Arsy Maulana", blc: "Bendul Merisi", jk: "L", tervalidasi: false },
  { id: 5, nik: "00000", nama: "Sridah Winarsih", blc: "Bendul Merisi", jk: "P", tervalidasi: false },
  { id: 6, nik: "000000", nama: "Roy Dwi Kusuma", blc: "Bendul Merisi", jk: "L", tervalidasi: true },
];

// Warna avatar memakai warna bawaan Metronic
const WARNA_AVATAR = [
  "bg-light-primary text-primary", "bg-light-info text-info", "bg-light-success text-success",
  "bg-light-warning text-warning", "bg-light-danger text-danger", "bg-light-dark text-dark",
];

function Avatar({ nama, besar }: { nama: string; besar?: boolean }) {
  const inisial = nama.split(" ").filter(Boolean).slice(0, 2).map((k) => k[0].toUpperCase()).join("");
  const warna = WARNA_AVATAR[[...nama].reduce((a, c) => a + c.charCodeAt(0), 0) % WARNA_AVATAR.length];
  return (
    <span className={`symbol symbol-circle ${besar ? "symbol-60px" : "symbol-40px"}`}>
      <span className={`symbol-label fw-bold ${warna} ${besar ? "fs-3" : "fs-6"}`}>{inisial}</span>
    </span>
  );
}

function StatusBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="badge badge-light-success d-inline-flex align-items-center gap-1 fs-8 py-2 px-3">
      <BadgeCheck size={14} /> Tervalidasi
    </span>
  ) : (
    <span className="badge badge-light d-inline-flex align-items-center gap-1 fs-8 py-2 px-3">
      <CircleDashed size={14} /> Non validasi
    </span>
  );
}

function JenisKelamin({ jk, panjang }: { jk: "L" | "P"; panjang?: boolean }) {
  return jk === "L" ? (
    <span className="badge badge-light-info d-inline-flex align-items-center gap-1 fs-8 py-2 px-3">
      <Mars size={14} /> {panjang ? "Laki-laki" : "L"}
    </span>
  ) : (
    <span className="badge badge-light-danger d-inline-flex align-items-center gap-1 fs-8 py-2 px-3">
      <Venus size={14} /> {panjang ? "Perempuan" : "P"}
    </span>
  );
}

function Aksi({ p, onValidasi, onHapus }: { p: Peserta; onValidasi: () => void; onHapus: () => void }) {
  return (
    <div className="d-flex align-items-center justify-content-end gap-2">
      <button type="button" onClick={onValidasi}
        className={`btn btn-sm ${p.tervalidasi ? "btn-light" : "btn-success"}`}>
        {p.tervalidasi ? "Batalkan" : "Validasi"}
      </button>
      <Link href={`/instruktur/daftar_peserta/${p.id}/ubah`} aria-label={`Ubah ${p.nama}`} title="Ubah"
        className="btn btn-icon btn-sm btn-light btn-active-light-primary">
        <Pencil size={16} />
      </Link>
      <button type="button" onClick={onHapus} aria-label={`Hapus ${p.nama}`} title="Hapus"
        className="btn btn-icon btn-sm btn-light btn-active-light-danger">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function DaftarPesertaPage() {
  const { showNotification } = useCrudNotification();
  const [data, setData] = useState<Peserta[]>(DATA_AWAL);
  const [cari, setCari] = useState("");
  const [area, setArea] = useState("");
  const [cariArea, setCariArea] = useState("");
  const [bukaArea, setBukaArea] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("semua");
  const [tampilan, setTampilan] = useState<"tabel" | "kartu">("tabel");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const daftarArea = useMemo(() => Array.from(new Set(data.map((d) => d.blc))).sort(), [data]);
  const jumlahValid = data.filter((d) => d.tervalidasi).length;

  const saranArea = useMemo(
    () => daftarArea.filter((a) => a.toLowerCase().includes(cariArea.trim().toLowerCase())),
    [daftarArea, cariArea]
  );

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    const qa = cariArea.trim().toLowerCase();
    return data.filter(
      (d) =>
        (!q || d.nama.toLowerCase().includes(q) || d.nik.includes(q)) &&
        (area ? d.blc === area : !qa || d.blc.toLowerCase().includes(qa)) &&
        (status === "semua" || (status === "valid") === d.tervalidasi)
    );
  }, [data, cari, area, cariArea, status]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / perPage));
  const halaman = Math.min(page, totalHalaman);
  const mulai = (halaman - 1) * perPage;
  const baris = hasil.slice(mulai, mulai + perPage);
  const adaFilter = cari !== "" || area !== "" || cariArea !== "" || status !== "semua";

  const ubah = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setPage(1); };
  const reset = () => { setCari(""); setArea(""); setCariArea(""); setStatus("semua"); setPage(1); };
  const pilihArea = (a: string) => { setArea(a); setCariArea(a); setBukaArea(false); setPage(1); };

  const toggleValidasi = (id: number) => {
    const peserta = data.find((p) => p.id === id);
    if (!peserta) return;
    setData((d) => d.map((p) => (p.id === id ? { ...p, tervalidasi: !p.tervalidasi } : p)));
    showNotification({
      type: "success",
      title: peserta.tervalidasi ? "Validasi dibatalkan" : "Peserta divalidasi",
      message: `${peserta.nama} ${peserta.tervalidasi ? "kembali berstatus non validasi" : "berhasil divalidasi"}.`,
    });
  };
  const hapus = (p: Peserta) => {
    if (!window.confirm(`Hapus peserta ${p.nama}?`)) return;
    setData((d) => d.filter((x) => x.id !== p.id));
    showNotification({ type: "success", title: "Peserta dihapus", message: `${p.nama} berhasil dihapus.` });
  };

  const statistik: { kunci: StatusFilter; label: string; nilai: number; icon: LucideIcon; warna: string; aktif: string }[] = [
    { kunci: "semua", label: "Semua peserta", nilai: data.length, icon: Users, warna: "bg-light-primary text-primary", aktif: "border-primary" },
    { kunci: "valid", label: "Tervalidasi", nilai: jumlahValid, icon: BadgeCheck, warna: "bg-light-success text-success", aktif: "border-success" },
    { kunci: "non", label: "Belum validasi", nilai: data.length - jumlahValid, icon: CircleDashed, warna: "bg-light text-gray-600", aktif: "border-gray-500" },
  ];

  return (
    <>
      <HeaderHalaman icon={Users} judul="Daftar peserta" deskripsi="Kelola data peserta dan pantau status validasinya." />

      {/* Kartu statistik (bisa diklik untuk memfilter) */}
      <div className="row g-5 g-xl-6 mb-6">
        {statistik.map(({ kunci, label, nilai, icon: Icon, warna, aktif }) => (
          <div className="col-sm-4" key={kunci}>
            <button type="button" onClick={() => ubah(setStatus)(kunci)} aria-pressed={status === kunci}
              className={`card card-body flex-row align-items-center gap-4 w-100 text-start border border-2 ${status === kunci ? aktif : "border-gray-200"}`}>
              <span className="symbol symbol-50px">
                <span className={`symbol-label ${warna}`}><Icon size={24} /></span>
              </span>
              <span className="d-flex flex-column">
                <span className="fs-2x fw-bold text-gray-900 lh-1">{nilai}</span>
                <span className="fs-7 text-gray-500 mt-1">{label}</span>
              </span>
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        {/* Pencarian & filter */}
        <div className="card-header border-0 pt-6">
          <div className="card-title flex-wrap gap-3">
            {/* Cari nama / NIK */}
            <div className="d-flex align-items-center position-relative my-1">
              <Search size={18} className="position-absolute ms-5 text-gray-500" style={{ pointerEvents: "none" }} />
              <input type="search" value={cari} onChange={(e) => ubah(setCari)(e.target.value)}
                placeholder="Cari nama atau NIK peserta" aria-label="Cari nama atau NIK peserta"
                className="form-control form-control-solid w-250px ps-14" />
            </div>

            {/* Cari area BLC */}
            <div className="d-flex align-items-center position-relative my-1">
              <MapPin size={18} className="position-absolute ms-5 text-gray-500" style={{ pointerEvents: "none" }} />
              <input
                type="text"
                value={cariArea}
                onChange={(e) => { setCariArea(e.target.value); setArea(""); setPage(1); setBukaArea(true); }}
                onFocus={() => setBukaArea(true)}
                onBlur={() => setBukaArea(false)}
                placeholder="Cari area BLC"
                aria-label="Cari area BLC"
                className="form-control form-control-solid w-200px ps-14 pe-10"
              />
              {cariArea && (
                <button type="button" aria-label="Hapus area"
                  onMouseDown={(e) => { e.preventDefault(); pilihArea(""); }}
                  className="btn btn-icon btn-sm btn-active-light-primary position-absolute end-0 me-1">
                  <X size={14} />
                </button>
              )}
              {bukaArea && (
                <ul className="dropdown-menu show w-100 shadow overflow-auto"
                  style={{ top: "100%", left: 0, maxHeight: 224, zIndex: 20 }}>
                  <li>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); pilihArea(""); }}
                      className="dropdown-item d-flex align-items-center justify-content-between">
                      Semua area <span className="fs-8 text-gray-500">{data.length}</span>
                    </button>
                  </li>
                  {saranArea.map((a) => (
                    <li key={a}>
                      <button type="button" onMouseDown={(e) => { e.preventDefault(); pilihArea(a); }}
                        className={`dropdown-item d-flex align-items-center justify-content-between ${area === a ? "active" : ""}`}>
                        {a} <span className="fs-8 text-gray-500">{data.filter((d) => d.blc === a).length}</span>
                      </button>
                    </li>
                  ))}
                  {saranArea.length === 0 && <li className="px-4 py-2 fs-7 text-gray-500">Area tidak ditemukan</li>}
                </ul>
              )}
            </div>
          </div>

          <div className="card-toolbar flex-wrap gap-3">
            {/* Toggle tampilan */}
            <div className="btn-group" role="group" aria-label="Pilih tampilan">
              {([["tabel", LayoutList, "Tabel"], ["kartu", LayoutGrid, "Kartu"]] as const).map(([k, Icon, label]) => (
                <button key={k} type="button" onClick={() => setTampilan(k)} aria-pressed={tampilan === k}
                  className={`btn btn-sm d-inline-flex align-items-center gap-2 ${tampilan === k ? "btn-primary" : "btn-light"}`}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>

            {adaFilter && (
              <button type="button" onClick={reset} className="btn btn-sm btn-light d-inline-flex align-items-center gap-1">
                <X size={16} /> Reset
              </button>
            )}

            <Link href="/instruktur/daftar_peserta/tambah_peserta" className="btn btn-sm btn-primary d-inline-flex align-items-center gap-2">
              <Plus size={18} /> Tambah peserta
            </Link>
          </div>
        </div>

        {/* Isi */}
        <div className="card-body py-4">
          {baris.length === 0 ? (
            <div className="d-flex flex-column align-items-center gap-3 text-center py-15">
              <span className="symbol symbol-80px symbol-circle">
                <span className="symbol-label bg-light-primary text-primary"><SearchX size={32} /></span>
              </span>
              <p className="fs-5 fw-bold text-gray-900 mb-0">Tidak ada peserta yang cocok</p>
              <p className="fs-7 text-gray-500 mb-0">Ubah kata kunci atau reset filter untuk melihat semua peserta.</p>
              {adaFilter && <button type="button" onClick={reset} className="btn btn-sm btn-primary mt-2">Reset filter</button>}
            </div>
          ) : tampilan === "tabel" ? (
            <div className="table-responsive">
              <table className="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-200px">Peserta</th>
                    <th>NIK</th>
                    <th>BLC</th>
                    <th>L/P</th>
                    <th>Status</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-semibold">
                  {baris.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <Avatar nama={p.nama} />
                          <span className="fw-bold text-gray-900">{p.nama}</span>
                        </div>
                      </td>
                      <td>{p.nik}</td>
                      <td><span className="d-inline-flex align-items-center gap-2"><MapPin size={15} className="text-primary" />{p.blc}</span></td>
                      <td><JenisKelamin jk={p.jk} /></td>
                      <td><StatusBadge ok={p.tervalidasi} /></td>
                      <td><Aksi p={p} onValidasi={() => toggleValidasi(p.id)} onHapus={() => hapus(p)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="row g-5">
              {baris.map((p) => (
                <div className="col-md-6 col-xl-4" key={p.id}>
                  <article className="card card-bordered h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-3">
                        <Avatar nama={p.nama} besar />
                        <div className="min-w-0">
                          <h3 className="fs-5 fw-bold text-gray-900 mb-1 text-truncate">{p.nama}</h3>
                          <p className="d-flex align-items-center gap-1 fs-8 text-gray-500 mb-0"><Fingerprint size={13} /> {p.nik}</p>
                        </div>
                      </div>
                      <div className="d-flex flex-wrap align-items-center gap-2 mt-5">
                        <span className="badge badge-light d-inline-flex align-items-center gap-1 fs-8 py-2 px-3">
                          <MapPin size={13} className="text-primary" />{p.blc}
                        </span>
                        <JenisKelamin jk={p.jk} panjang />
                        <StatusBadge ok={p.tervalidasi} />
                      </div>
                    </div>
                    <div className="card-footer py-3">
                      <Aksi p={p} onValidasi={() => toggleValidasi(p.id)} onHapus={() => hapus(p)} />
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paginasi */}
        <div className="card-footer d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2 fs-7 text-gray-600">
            <span>Tampilkan</span>
            <select value={perPage} onChange={(e) => ubah(setPerPage)(Number(e.target.value))} aria-label="Jumlah baris per halaman"
              className="form-select form-select-sm form-select-solid w-75px">
              {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
            </select>
            <span>baris, {hasil.length === 0 ? 0 : mulai + 1}–{Math.min(mulai + perPage, hasil.length)} dari {hasil.length}</span>
          </div>
          <div className="d-flex align-items-center gap-2 fs-7 text-gray-600">
            <button type="button" onClick={() => setPage(halaman - 1)} disabled={halaman <= 1} aria-label="Halaman sebelumnya"
              className="btn btn-icon btn-sm btn-light"><ChevronLeft size={18} /></button>
            <span>{halaman} / {totalHalaman}</span>
            <button type="button" onClick={() => setPage(halaman + 1)} disabled={halaman >= totalHalaman} aria-label="Halaman berikutnya"
              className="btn btn-icon btn-sm btn-light"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </>
  );
}