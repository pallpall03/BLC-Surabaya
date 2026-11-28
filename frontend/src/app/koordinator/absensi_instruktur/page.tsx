"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Home,
  Info,
  LogIn,
  LogOut,
  MapPin,
  RotateCcw,
  Search,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";

type StatusKehadiran = "hadir" | "terlambat" | "tidak";
type SortKey = "nomor" | "nama" | "area" | "status";
type SortDirection = "asc" | "desc";

type AbsensiInstruktur = {
  id: number;
  nama: string;
  area: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  status: StatusKehadiran;
  keterangan: string;
};

const AREA_BLC = ["Dukuh Menanggal", "Simomulyo", "DINKOMINFO", "Gayungan", "Mulyorejo"];

const DATA_ABSENSI: AbsensiInstruktur[] = [
  { id: 1, nama: "Afidah Putri Khairani", area: "Dukuh Menanggal", jamMasuk: "07.12", jamPulang: "16.03", status: "hadir", keterangan: "Hadir tepat waktu dan menyelesaikan seluruh jam mengajar." },
  { id: 2, nama: "Annas Fardyansyah", area: "Simomulyo", jamMasuk: "07.25", jamPulang: "16.01", status: "terlambat", keterangan: "Terlambat 15 menit karena kendala perjalanan ke BLC." },
  { id: 3, nama: "Arif Agung Pambudi", area: "DINKOMINFO", jamMasuk: null, jamPulang: null, status: "tidak", keterangan: "Tidak hadir karena sedang mengikuti pelatihan di luar kota." },
  { id: 4, nama: "Aulia Chaqiqi", area: "Gayungan", jamMasuk: "07.05", jamPulang: "15.58", status: "hadir", keterangan: "Kehadiran tercatat lengkap tanpa kendala." },
  { id: 5, nama: "Benny Al Azhhar", area: "DINKOMINFO", jamMasuk: "07.31", jamPulang: "16.10", status: "terlambat", keterangan: "Terlambat 21 menit dan mengajukan surat keterangan." },
  { id: 6, nama: "Bernadus Aditya Pringgokusumo", area: "DINKOMINFO", jamMasuk: "07.18", jamPulang: "16.00", status: "hadir", keterangan: "Menjadi pengganti instruktur pada satu sesi pelatihan." },
  { id: 7, nama: "Dewa Aji", area: "Mulyorejo", jamMasuk: null, jamPulang: null, status: "tidak", keterangan: "Belum ada konfirmasi kehadiran dari instruktur." },
  { id: 8, nama: "Fajar Ramadhan", area: "Dukuh Menanggal", jamMasuk: "07.08", jamPulang: "15.55", status: "hadir", keterangan: "Hadir lebih awal untuk menyiapkan ruang pelatihan." },
  { id: 9, nama: "Gilang Pratama", area: "Simomulyo", jamMasuk: "07.22", jamPulang: "16.04", status: "hadir", keterangan: "Kehadiran dan jam pulang sudah terverifikasi." },
  { id: 10, nama: "Hesti Puspita", area: "Gayungan", jamMasuk: "07.15", jamPulang: "15.59", status: "hadir", keterangan: "Mengajar sesuai jadwal dan melapor di akhir hari." },
  { id: 11, nama: "Ilham Maulana", area: "Mulyorejo", jamMasuk: "07.35", jamPulang: "16.12", status: "terlambat", keterangan: "Terlambat 25 menit karena hujan deras." },
  { id: 12, nama: "Joko Susilo", area: "DINKOMINFO", jamMasuk: "07.02", jamPulang: "15.50", status: "hadir", keterangan: "Menyelesaikan seluruh sesi pelatihan hari ini." },
];

const STATUS_META: Record<StatusKehadiran, { label: string; className: string }> = {
  hadir: { label: "Hadir", className: "success" },
  terlambat: { label: "Terlambat", className: "warning" },
  tidak: { label: "Tidak hadir", className: "danger" },
};

const hariIni = () => new Date().toLocaleDateString("en-CA");
const inisial = (nama: string) => nama.split(" ").filter(Boolean).slice(0, 2).map((kata) => kata[0].toUpperCase()).join("");
const formatTanggal = (tanggal: string) => tanggal
  ? new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${tanggal}T00:00:00`))
  : "Tanggal belum dipilih";

export default function AbsensiInstrukturPage() {
  const { showNotification } = useCrudNotification();
  const [tanggal, setTanggal] = useState(hariIni);
  const [areaDraft, setAreaDraft] = useState("");
  const [areaAktif, setAreaAktif] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("nomor");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [detail, setDetail] = useState<AbsensiInstruktur | null>(null);

  useEffect(() => {
    if (!detail) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetail(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [detail]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("id");
    const result = DATA_ABSENSI.filter((item) => {
      const sesuaiArea = !areaAktif || item.area === areaAktif;
      const sesuaiPencarian = !keyword || `${item.nama} ${item.area}`.toLocaleLowerCase("id").includes(keyword);
      return sesuaiArea && sesuaiPencarian;
    });
    const direction = sortDirection === "asc" ? 1 : -1;
    const nomorAsli = (id: number) => DATA_ABSENSI.findIndex((item) => item.id === id);

    return [...result].sort((a, b) => {
      if (sortKey === "nomor") return (nomorAsli(a.id) - nomorAsli(b.id)) * direction;
      if (sortKey === "status") return a.status.localeCompare(b.status, "id") * direction;
      const left = sortKey === "nama" ? a.nama : a.area;
      const right = sortKey === "nama" ? b.nama : b.area;
      return left.localeCompare(right, "id", { numeric: true }) * direction;
    });
  }, [areaAktif, query, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleItems = filteredItems.slice(startIndex, startIndex + pageSize);
  const showingStart = filteredItems.length ? startIndex + 1 : 0;
  const showingEnd = Math.min(startIndex + pageSize, filteredItems.length);
  const jumlahHadir = filteredItems.filter((item) => item.status === "hadir").length;
  const jumlahTerlambat = filteredItems.filter((item) => item.status === "terlambat").length;
  const jumlahTidakHadir = filteredItems.filter((item) => item.status === "tidak").length;

  const changeSort = (key: SortKey) => {
    if (sortKey === key) setSortDirection((current) => current === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const terapkanFilter = () => {
    if (!tanggal) {
      showNotification({ type: "error", title: "Filter belum lengkap", message: "Pilih tanggal absensi terlebih dahulu." });
      return;
    }
    setAreaAktif(areaDraft);
    setPage(1);
  };

  const resetFilter = () => {
    setTanggal(hariIni());
    setAreaDraft("");
    setAreaAktif("");
    setQuery("");
    setPage(1);
  };

  const sortButton = (key: SortKey, label: string) => (
    <button type="button" className="kategori-sort" onClick={() => changeSort(key)} aria-label={`Urutkan ${label}`}>
      <span>{label}</span><ArrowUpDown size={14} />
    </button>
  );

  return (
    <main className="absensi-page">
      <section className="materi-page-header absensi-page-header">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div>
            <div className="materi-breadcrumb d-flex align-items-center gap-2 fs-7 fw-semibold mb-2">
              <Home size={14} /><span>Absensi</span><ChevronRight size={14} /><span>Instruktur</span>
            </div>
            <h1 className="fs-2 fw-bolder mb-2">Absensi Instruktur</h1>
            <p className="mb-0 text-white text-opacity-75">Pantau kehadiran, jam masuk, dan jam pulang instruktur per area BLC.</p>
          </div>
          <span className="symbol symbol-55px flex-shrink-0" aria-hidden="true">
            <span className="symbol-label bg-white bg-opacity-15 text-white"><ClipboardCheck size={27} /></span>
          </span>
        </div>
      </section>

      <section className="row g-4 mt-1" aria-label="Ringkasan absensi instruktur">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card materi-stat-card h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <span className="symbol symbol-45px flex-shrink-0"><span className="symbol-label bg-blue-100 text-blue-600"><Users size={22} /></span></span>
              <div><span className="text-muted fs-7 fw-semibold d-block mb-1">Total instruktur</span><strong className="text-gray-900 fs-2 fw-bolder">{filteredItems.length}</strong></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card materi-stat-card h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <span className="symbol symbol-45px flex-shrink-0"><span className="symbol-label bg-green-100 text-green-600"><UserCheck size={22} /></span></span>
              <div><span className="text-muted fs-7 fw-semibold d-block mb-1">Hadir</span><strong className="text-gray-900 fs-2 fw-bolder">{jumlahHadir}</strong></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card materi-stat-card h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <span className="symbol symbol-45px flex-shrink-0"><span className="symbol-label bg-orange-100 text-orange-600"><Clock3 size={22} /></span></span>
              <div><span className="text-muted fs-7 fw-semibold d-block mb-1">Terlambat</span><strong className="text-gray-900 fs-2 fw-bolder">{jumlahTerlambat}</strong></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card materi-stat-card h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <span className="symbol symbol-45px flex-shrink-0"><span className="symbol-label bg-red-100 text-red-600"><UserX size={22} /></span></span>
              <div><span className="text-muted fs-7 fw-semibold d-block mb-1">Tidak hadir</span><strong className="text-gray-900 fs-2 fw-bolder">{jumlahTidakHadir}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="card absensi-filter-card mt-4" aria-labelledby="absensi-filter-title">
        <div className="card-header border-0 pt-4 px-4 px-lg-5">
          <div className="d-flex align-items-center gap-3">
            <span className="symbol symbol-40px"><span className="symbol-label bg-blue-100 text-blue-600"><CalendarDays size={20} /></span></span>
            <div>
              <h2 id="absensi-filter-title" className="fs-5 fw-bold text-gray-900 mb-1">Filter absensi</h2>
              <p className="text-muted fs-7 mb-0">Tampilkan rekap berdasarkan tanggal dan area BLC.</p>
            </div>
          </div>
        </div>
        <div className="card-body px-4 px-lg-5 pb-4">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label htmlFor="absensi-tanggal" className="form-label fw-semibold text-gray-800">Tanggal</label>
              <input
                id="absensi-tanggal"
                type="date"
                className="form-control"
                value={tanggal}
                onChange={(event) => setTanggal(event.target.value)}
                suppressHydrationWarning
              />
            </div>
            <div className="col-12 col-md-4">
              <label htmlFor="absensi-area" className="form-label fw-semibold text-gray-800">Area BLC</label>
              <select id="absensi-area" className="form-select" value={areaDraft} onChange={(event) => setAreaDraft(event.target.value)}>
                <option value="">-- Pilih Area BLC --</option>
                {AREA_BLC.map((area) => <option key={area} value={area}>{area}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 flex-grow-1" onClick={terapkanFilter}>
                  <Search size={16} /> Filter
                </button>
                <button type="button" className="btn btn-light d-inline-flex align-items-center justify-content-center gap-2" onClick={resetFilter}>
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          </div>
          {areaAktif && (
            <div className="d-flex align-items-center gap-2 mt-3 fs-7 text-gray-600">
              <Info size={15} className="text-blue-500" />
              Menampilkan area <span className="badge bg-blue-100 text-blue-700">{areaAktif}</span> pada {formatTanggal(tanggal)}
            </div>
          )}
        </div>
      </section>

      <section className="card kategori-table-card absensi-table-card mt-4" aria-labelledby="absensi-table-title">
        <div className="card-header border-0 pt-4 px-4 px-lg-5">
          <div className="d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 w-100">
            <div className="d-flex align-items-center gap-3">
              <span className="symbol symbol-40px"><span className="symbol-label bg-orange-100 text-orange-600"><ClipboardCheck size={20} /></span></span>
              <div>
                <h2 id="absensi-table-title" className="fs-5 fw-bold text-gray-900 mb-1">Daftar Hadir Instruktur</h2>
                <p className="text-muted fs-7 mb-0">Rekap kehadiran instruktur pada {formatTanggal(tanggal)}.</p>
              </div>
            </div>
            <div className="materi-search position-relative absensi-search">
              <Search size={17} className="position-absolute text-gray-400" style={{ left: 13, top: 10, zIndex: 2 }} />
              <input
                type="search"
                className="form-control form-control-sm"
                style={{ minHeight: 38, paddingLeft: 40 }}
                placeholder="Cari nama atau area..."
                aria-label="Cari absensi instruktur"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div className="d-flex align-items-center gap-2 text-gray-700 fs-7">
              <label htmlFor="absensi-page-size">Show</label>
              <select
                id="absensi-page-size"
                className="form-select form-select-sm"
                style={{ width: 76 }}
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span>entries</span>
            </div>
            <span className="text-muted fs-7">Menampilkan <strong className="text-gray-900">{filteredItems.length}</strong> dari {DATA_ABSENSI.length} instruktur</span>
          </div>

          <div className="table-responsive">
            <table className="table align-middle materi-table absensi-table">
              <caption className="visually-hidden">Daftar hadir instruktur BLC Surabaya</caption>
              <thead>
                <tr>
                  <th scope="col" style={{ width: 70 }}>{sortButton("nomor", "No.")}</th>
                  <th scope="col">{sortButton("nama", "Nama Instruktur")}</th>
                  <th scope="col">{sortButton("area", "Area BLC")}</th>
                  <th scope="col">Jam Masuk</th>
                  <th scope="col">Jam Pulang</th>
                  <th scope="col">{sortButton("status", "Status")}</th>
                  <th scope="col" style={{ width: 140 }} className="text-end">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr key={item.id}>
                    <td><span className="materi-number">{DATA_ABSENSI.findIndex((entry) => entry.id === item.id) + 1}</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <span className={`absensi-avatar avatar-${item.id % 3}`}>{inisial(item.nama)}</span>
                        <div>
                          <p className="absensi-name mb-0">{item.nama}</p>
                          <span className="text-muted fs-8">Instruktur BLC</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="absensi-area"><MapPin size={14} />{item.area}</span></td>
                    <td><span className={`absensi-time${!item.jamMasuk ? " empty" : ""}`}><LogIn size={15} />{item.jamMasuk ?? "—"}</span></td>
                    <td><span className={`absensi-time${!item.jamPulang ? " empty" : ""}`}><LogOut size={15} />{item.jamPulang ?? "—"}</span></td>
                    <td><span className={`absensi-status ${STATUS_META[item.status].className}`}>{STATUS_META[item.status].label}</span></td>
                    <td className="text-end">
                      <button type="button" className="kategori-action-btn detail" onClick={() => setDetail(item)} aria-label={`Lihat keterangan ${item.nama}`}>
                        <Info size={14} /> Keterangan
                      </button>
                    </td>
                  </tr>
                ))}
                {!visibleItems.length && (
                  <tr>
                    <td colSpan={7}>
                      <div className="text-center py-8">
                        <Search size={30} className="text-gray-400 mb-3" />
                        <h3 className="fs-6 fw-bold text-gray-900">Data tidak ditemukan</h3>
                        <p className="text-muted fs-7 mb-3">Coba gunakan kata kunci atau area BLC lain.</p>
                        <button type="button" className="btn btn-sm btn-light" onClick={resetFilter}><RotateCcw size={15} /> Reset filter</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 px-4 px-lg-5 py-3">
          <span className="text-muted fs-7">Showing {showingStart} to {showingEnd} of {filteredItems.length} entries</span>
          <nav className="kategori-pagination" aria-label="Pagination absensi instruktur">
            <button type="button" className="page-link" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}><ChevronLeft size={15} /> Previous</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                type="button"
                className={`page-link${pageNumber === currentPage ? " active" : ""}`}
                key={pageNumber}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button type="button" className="page-link" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages}>Next <ChevronRight size={15} /></button>
          </nav>
        </div>
      </section>

      {detail && (
        <div className="materi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetail(null); }}>
          <section className="materi-modal absensi-detail-modal" role="dialog" aria-modal="true" aria-labelledby="absensi-detail-title">
            <div className="materi-modal-header d-flex align-items-start justify-content-between gap-3">
              <div>
                <p className="text-white text-opacity-75 fs-7 mb-1">Detail Kehadiran</p>
                <h2 id="absensi-detail-title" className="fs-4 fw-bold mb-0">Keterangan Instruktur</h2>
              </div>
              <button type="button" className="materi-modal-close" onClick={() => setDetail(null)} aria-label="Tutup detail" autoFocus><X size={19} /></button>
            </div>
            <div className="materi-modal-body">
              <div className="d-flex align-items-center gap-3 pb-4 mb-4 border-bottom">
                <span className={`absensi-avatar absensi-avatar-lg avatar-${detail.id % 3}`}>{inisial(detail.nama)}</span>
                <div>
                  <h3 className="fs-5 fw-bold text-gray-900 mb-1">{detail.nama}</h3>
                  <p className="text-muted fs-7 mb-0 d-flex align-items-center gap-1"><MapPin size={14} />{detail.area}</p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="absensi-detail-item">
                    <span className="text-muted fs-8 d-block mb-1">Tanggal</span>
                    <strong className="text-gray-800 fs-7">{formatTanggal(tanggal)}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="absensi-detail-item">
                    <span className="text-muted fs-8 d-block mb-1">Status</span>
                    <span className={`absensi-status ${STATUS_META[detail.status].className}`}>{STATUS_META[detail.status].label}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="absensi-detail-item">
                    <span className="text-muted fs-8 d-block mb-1">Jam masuk</span>
                    <strong className="text-gray-800 fs-7 d-flex align-items-center gap-1"><LogIn size={14} />{detail.jamMasuk ?? "—"}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="absensi-detail-item">
                    <span className="text-muted fs-8 d-block mb-1">Jam pulang</span>
                    <strong className="text-gray-800 fs-7 d-flex align-items-center gap-1"><LogOut size={14} />{detail.jamPulang ?? "—"}</strong>
                  </div>
                </div>
              </div>

              <div className="absensi-note mt-4">
                <span className="text-gray-700 fs-7 fw-semibold d-block mb-1">Catatan kehadiran</span>
                <p className="text-gray-600 fs-7 mb-0">{detail.keterangan}</p>
              </div>
            </div>
            <div className="d-flex justify-content-end px-4 pb-4">
              <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={() => setDetail(null)}><CheckCircle2 size={16} /> Tutup</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
