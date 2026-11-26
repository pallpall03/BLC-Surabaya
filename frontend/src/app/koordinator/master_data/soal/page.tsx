"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  BookOpenCheck,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Home,
  Image,
  ListChecks,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";
import {
  bacaSoal,
  DATA_AWAL_SOAL,
  formatTanggal,
  MATERI_SOAL,
  simpanSoal,
  type SoalPelatihan,
} from "./data";

const LIST_PATH = "/koordinator/master_data/soal";

type SortKey = "nomor" | "materi" | "pertemuan" | "soal" | "tanggal";
type SortDirection = "asc" | "desc";

export default function SoalPage() {
  const { showNotification } = useCrudNotification();
  const [items, setItems] = useState<SoalPelatihan[]>(DATA_AWAL_SOAL);
  const [query, setQuery] = useState("");
  const [filterDraft, setFilterDraft] = useState("");
  const [filterMateri, setFilterMateri] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("nomor");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [deleteTarget, setDeleteTarget] = useState<SoalPelatihan | null>(null);

  useEffect(() => {
    setItems(bacaSoal());
  }, []);

  useEffect(() => {
    if (!deleteTarget) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDeleteTarget(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [deleteTarget]);

  const sortedItems = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("id");
    const filtered = items.filter((item) => {
      const sesuaiMateri = !filterMateri || item.materi === filterMateri;
      const sesuaiPencarian = !keyword
        || `${item.materi} pertemuan ${item.pertemuan} ${item.teks}`.toLocaleLowerCase("id").includes(keyword);
      return sesuaiMateri && sesuaiPencarian;
    });
    const direction = sortDirection === "asc" ? 1 : -1;
    const nomorAsli = (id: string) => items.findIndex((item) => item.id === id) + 1;

    return [...filtered].sort((a, b) => {
      if (sortKey === "nomor") return (nomorAsli(a.id) - nomorAsli(b.id)) * direction;
      if (sortKey === "pertemuan") return (a.pertemuan - b.pertemuan) * direction;
      if (sortKey === "tanggal") return (new Date(a.dibuatPada).getTime() - new Date(b.dibuatPada).getTime()) * direction;
      const left = sortKey === "materi" ? a.materi : a.teks;
      const right = sortKey === "materi" ? b.materi : b.teks;
      return left.localeCompare(right, "id", { numeric: true }) * direction;
    });
  }, [filterMateri, items, query, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleItems = sortedItems.slice(startIndex, startIndex + pageSize);
  const showingStart = sortedItems.length ? startIndex + 1 : 0;
  const showingEnd = Math.min(startIndex + pageSize, sortedItems.length);
  const jumlahMateri = new Set(items.map((item) => item.materi)).size;
  const jumlahBergambar = items.filter((item) => item.gambarSoal || item.jawaban.some((entry) => entry.gambar)).length;

  const changeSort = (key: SortKey) => {
    if (sortKey === key) setSortDirection((current) => current === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const resetFilter = () => {
    setFilterDraft("");
    setFilterMateri("");
    setQuery("");
    setPage(1);
  };

  const konfirmasiHapus = () => {
    if (!deleteTarget) return;
    const nextItems = items.filter((item) => item.id !== deleteTarget.id);
    if (!simpanSoal(nextItems)) {
      showNotification({ type: "error", title: "Soal gagal dihapus", message: "Data soal tidak dapat disimpan di browser." });
      return;
    }
    setItems(nextItems);
    setDeleteTarget(null);
    setPage(1);
    showNotification({ type: "success", title: "Soal dihapus", message: "Soal pelatihan berhasil dihapus." });
  };

  const sortButton = (key: SortKey, label: string) => (
    <button type="button" className="kategori-sort" onClick={() => changeSort(key)} aria-label={`Urutkan ${label}`}>
      <span>{label}</span><ArrowUpDown size={14} />
    </button>
  );

  return (
    <main className="soal-page">
      <section className="materi-page-header">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div>
            <div className="materi-breadcrumb d-flex align-items-center gap-2 fs-7 fw-semibold mb-2">
              <Home size={14} /><span>Master Data</span><ChevronRight size={14} /><span>Soal</span>
            </div>
            <h1 className="fs-2 fw-bolder mb-2">Daftar Soal Pelatihan</h1>
            <p className="mb-0 text-white text-opacity-75">Kelola bank soal, pilihan jawaban, dan kunci jawaban pelatihan BLC.</p>
          </div>
          <span className="symbol symbol-55px flex-shrink-0" aria-hidden="true">
            <span className="symbol-label bg-white bg-opacity-15 text-white"><BookOpenCheck size={27} /></span>
          </span>
        </div>
      </section>

      <section className="row g-4 mt-1" aria-label="Ringkasan soal">
        <div className="col-12 col-md-4">
          <div className="card materi-stat-card h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <span className="symbol symbol-45px flex-shrink-0"><span className="symbol-label bg-blue-100 text-blue-600"><ListChecks size={22} /></span></span>
              <div><span className="text-muted fs-7 fw-semibold d-block mb-1">Total soal</span><strong className="text-gray-900 fs-2 fw-bolder">{items.length}</strong></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card materi-stat-card h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <span className="symbol symbol-45px flex-shrink-0"><span className="symbol-label bg-orange-100 text-orange-600"><BookOpenCheck size={22} /></span></span>
              <div><span className="text-muted fs-7 fw-semibold d-block mb-1">Materi tersedia</span><strong className="text-gray-900 fs-2 fw-bolder">{jumlahMateri}</strong></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card materi-stat-card h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <span className="symbol symbol-45px flex-shrink-0"><span className="symbol-label bg-blue-100 text-blue-600"><Image size={22} /></span></span>
              <div><span className="text-muted fs-7 fw-semibold d-block mb-1">Soal bergambar</span><strong className="text-gray-900 fs-2 fw-bolder">{jumlahBergambar}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="card kategori-table-card mt-4" aria-labelledby="soal-table-title">
        <div className="card-header d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 py-4 px-4 px-lg-5">
          <div className="d-flex align-items-center gap-3">
            <span className="symbol symbol-40px"><span className="symbol-label bg-blue-100 text-blue-600"><ListChecks size={20} /></span></span>
            <div>
              <h2 id="soal-table-title" className="fs-5 fw-bold text-gray-900 mb-1">Daftar Soal Pelatihan</h2>
              <p className="text-muted fs-7 mb-0">Cari, filter, dan kelola seluruh soal pelatihan.</p>
            </div>
          </div>
          <Link href={`${LIST_PATH}/baru`} className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2">
            <Plus size={18} /> Buat Soal Baru
          </Link>
        </div>

        <div className="card-body p-4">
          <div className="soal-filter-bar p-3 p-lg-4 mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-lg-4">
                <label htmlFor="soal-filter-materi" className="form-label fw-semibold">Filter materi</label>
                <select
                  id="soal-filter-materi"
                  className="form-select"
                  value={filterDraft}
                  onChange={(event) => setFilterDraft(event.target.value)}
                >
                  <option value="">-- Pilih Materi --</option>
                  {MATERI_SOAL.map((item) => <option key={item.nama} value={item.nama}>{item.nama}</option>)}
                </select>
              </div>
              <div className="col-12 col-lg-3">
                <button
                  type="button"
                  className="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2"
                  onClick={() => {
                    setFilterMateri(filterDraft);
                    setPage(1);
                  }}
                >
                  <Filter size={16} /> Filter
                </button>
              </div>
              <div className="col-12 col-lg-2">
                <button type="button" className="btn btn-light w-100 d-inline-flex align-items-center justify-content-center gap-2" onClick={resetFilter}>
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
              <div className="col-12 col-lg-3">
                <span className="text-muted fs-7 d-block">Menampilkan <strong className="text-gray-900">{sortedItems.length}</strong> dari {items.length} soal</span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div className="d-flex align-items-center gap-2 text-gray-700 fs-7">
              <label htmlFor="soal-page-size">Show</label>
              <select
                id="soal-page-size"
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
              {filterMateri && <span className="badge bg-blue-100 text-blue-700 ms-2">{filterMateri}</span>}
            </div>
            <div className="materi-search position-relative" style={{ maxWidth: 320, width: "100%" }}>
              <Search size={17} className="position-absolute text-gray-400" style={{ left: 13, top: 10, zIndex: 2 }} />
              <input
                type="search"
                className="form-control form-control-sm"
                style={{ minHeight: 38, paddingLeft: 40 }}
                placeholder="Cari soal..."
                aria-label="Cari soal pelatihan"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle materi-table soal-table">
              <caption className="visually-hidden">Daftar soal pelatihan BLC</caption>
              <thead>
                <tr>
                  <th scope="col" style={{ width: 70 }}>{sortButton("nomor", "No.")}</th>
                  <th scope="col">{sortButton("materi", "Materi")}</th>
                  <th scope="col">{sortButton("pertemuan", "Pertemuan")}</th>
                  <th scope="col" style={{ minWidth: 280 }}>{sortButton("soal", "Soal")}</th>
                  <th scope="col">{sortButton("tanggal", "Tgl Dibuat")}</th>
                  <th scope="col" style={{ width: 250 }} className="text-end">#</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr key={item.id}>
                    <td><span className="materi-number">{items.findIndex((entry) => entry.id === item.id) + 1}</span></td>
                    <td><span className="soal-materi-badge">{item.materi}</span></td>
                    <td><span className="soal-pertemuan-badge">{item.pertemuan}</span></td>
                    <td><p className="soal-table-text mb-0" title={item.teks}>{item.teks}</p></td>
                    <td><span className="soal-date"><CalendarClock size={14} />{formatTanggal(item.dibuatPada)}</span></td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Link href={`${LIST_PATH}/${encodeURIComponent(item.id)}/detail`} className="kategori-action-btn detail" aria-label={`Detail soal ${item.id}`}>
                          <Eye size={14} /> Detail
                        </Link>
                        <Link href={`${LIST_PATH}/${encodeURIComponent(item.id)}/ubah`} className="kategori-action-btn edit" aria-label={`Ubah soal ${item.id}`}>
                          <Pencil size={14} /> Ubah
                        </Link>
                        <button type="button" className="kategori-action-btn delete" onClick={() => setDeleteTarget(item)} aria-label={`Hapus soal ${item.id}`}>
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!visibleItems.length && (
                  <tr>
                    <td colSpan={6}>
                      <div className="text-center py-8">
                        <Search size={30} className="text-gray-400 mb-3" />
                        <h3 className="fs-6 fw-bold text-gray-900">Data tidak ditemukan</h3>
                        <p className="text-muted fs-7 mb-3">Coba kata kunci atau filter materi lain.</p>
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
          <span className="text-muted fs-7">Showing {showingStart} to {showingEnd} of {sortedItems.length} entries</span>
          <nav className="kategori-pagination" aria-label="Pagination soal pelatihan">
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

      {deleteTarget && (
        <div className="materi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
          <section className="materi-modal" role="dialog" aria-modal="true" aria-labelledby="hapus-soal-title">
            <div className="materi-modal-header d-flex align-items-start justify-content-between gap-3">
              <div>
                <p className="text-white text-opacity-75 fs-7 mb-1">Soal Pelatihan</p>
                <h2 id="hapus-soal-title" className="fs-4 fw-bold mb-0">Hapus Soal</h2>
              </div>
              <button type="button" className="materi-modal-close" onClick={() => setDeleteTarget(null)} aria-label="Tutup konfirmasi"><X size={18} /></button>
            </div>
            <div className="materi-modal-body">
              <p className="text-gray-700 mb-0">Apakah Anda yakin ingin menghapus soal berikut?</p>
              <blockquote className="soal-delete-preview">{deleteTarget.teks}</blockquote>
              <div className="d-flex justify-content-end gap-3 mt-5">
                <button type="button" className="btn btn-light" onClick={() => setDeleteTarget(null)}>Batal</button>
                <button type="button" className="btn btn-danger d-inline-flex align-items-center gap-2" onClick={konfirmasiHapus}><Trash2 size={16} /> Hapus</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
