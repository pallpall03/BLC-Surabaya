"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Home,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";
import {
  bacaSesi,
  DATA_AWAL_SESI,
  simpanSesi,
  type SesiPelatihan,
} from "./data";

const LIST_PATH = "/koordinator/master_data/sesi";

type SortKey = "nomor" | "jam";
type SortDirection = "asc" | "desc";

export default function SesiPage() {
  const { showNotification } = useCrudNotification();
  const [items, setItems] = useState<SesiPelatihan[]>(DATA_AWAL_SESI);
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("nomor");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [deleteTarget, setDeleteTarget] = useState<SesiPelatihan | null>(null);

  useEffect(() => {
    setItems(bacaSesi());
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
    const filtered = keyword
      ? items.filter((item) => `${item.nomor} ${item.jam}`.toLocaleLowerCase("id").includes(keyword))
      : items;
    const direction = sortDirection === "asc" ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (sortKey === "nomor") return (a.nomor - b.nomor) * direction;
      return a.jam.localeCompare(b.jam, "id", { numeric: true }) * direction;
    });
  }, [items, query, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleItems = sortedItems.slice(startIndex, startIndex + pageSize);
  const showingStart = sortedItems.length ? startIndex + 1 : 0;
  const showingEnd = Math.min(startIndex + pageSize, sortedItems.length);

  const changeSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const konfirmasiHapus = () => {
    if (!deleteTarget) return;
    const nextItems = items.filter((item) => item.id !== deleteTarget.id);
    if (!simpanSesi(nextItems)) {
      showNotification({
        type: "error",
        title: "Sesi gagal dihapus",
        message: "Data sesi tidak dapat disimpan di browser.",
      });
      return;
    }
    setItems(nextItems);
    setDeleteTarget(null);
    setPage(1);
    showNotification({
      type: "success",
      title: "Sesi dihapus",
      message: `Sesi ${deleteTarget.nomor} berhasil dihapus.`,
    });
  };

  const sortButton = (key: SortKey, label: string) => (
    <button type="button" className="kategori-sort" onClick={() => changeSort(key)} aria-label={`Urutkan ${label}`}>
      <span>{label}</span><ArrowUpDown size={14} />
    </button>
  );

  return (
    <main className="sesi-page">
      <section className="materi-page-header">
        <div className="materi-breadcrumb d-flex align-items-center gap-2 fs-7 fw-semibold mb-2">
          <Home size={14} /><span>Master Data</span><ChevronRight size={14} /><span>Sesi</span>
        </div>
        <h1 className="fs-2 fw-bolder mb-0">Daftar Sesi Pelatihan BLC</h1>
      </section>

      <section className="card kategori-table-card mt-4" aria-labelledby="sesi-table-title">
        <div className="card-header d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 py-4 px-4 px-lg-5">
          <div className="d-flex align-items-center gap-3">
            <span className="symbol symbol-40px">
              <span className="symbol-label bg-blue-100 text-blue-600"><Clock3 size={20} /></span>
            </span>
            <h2 id="sesi-table-title" className="fs-5 fw-bold text-gray-900 mb-0">Daftar Sesi Pelatihan BLC</h2>
          </div>
          <Link href={`${LIST_PATH}/baru`} className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2">
            <Plus size={18} /> Buat Sesi Baru
          </Link>
        </div>

        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div className="d-flex align-items-center gap-2 text-gray-700 fs-7">
              <label htmlFor="sesi-page-size">Show</label>
              <select
                id="sesi-page-size"
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
            <div className="materi-search position-relative" style={{ maxWidth: 300, width: "100%" }}>
              <Search size={17} className="position-absolute text-gray-400" style={{ left: 13, top: 10, zIndex: 2 }} />
              <input
                type="search"
                className="form-control form-control-sm"
                style={{ minHeight: 38, paddingLeft: 40 }}
                placeholder="Search..."
                aria-label="Cari sesi pelatihan"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle materi-table sesi-table">
              <caption className="visually-hidden">Daftar sesi pelatihan BLC</caption>
              <thead>
                <tr>
                  <th scope="col" style={{ width: "30%" }}>{sortButton("nomor", "Sesi")}</th>
                  <th scope="col">{sortButton("jam", "Jam")}</th>
                  <th scope="col" style={{ width: 190 }} className="text-end">#</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr key={item.id}>
                    <td><span className="materi-number">{item.nomor}</span></td>
                    <td className="kategori-nama">{item.jam}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Link
                          href={`${LIST_PATH}/${encodeURIComponent(item.id)}/ubah`}
                          className="kategori-action-btn edit"
                          aria-label={`Ubah sesi ${item.nomor}`}
                        >
                          <Pencil size={14} /> Ubah
                        </Link>
                        <button
                          type="button"
                          className="kategori-action-btn delete"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Hapus sesi ${item.nomor}`}
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!visibleItems.length && (
                  <tr>
                    <td colSpan={3}>
                      <div className="text-center py-8">
                        <Search size={28} className="text-gray-400 mb-3" />
                        <h3 className="fs-6 fw-bold text-gray-900">Data tidak ditemukan</h3>
                        <p className="text-muted fs-7 mb-0">Coba gunakan kata kunci lain.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 px-4 px-lg-5 py-3">
          <span className="text-muted fs-7">
            Showing {showingStart} to {showingEnd} of {sortedItems.length} entries
          </span>
          <nav className="kategori-pagination" aria-label="Pagination sesi pelatihan">
            <button type="button" className="page-link" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}>
              <ChevronLeft size={15} /> Previous
            </button>
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
            <button type="button" className="page-link" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages}>
              Next <ChevronRight size={15} />
            </button>
          </nav>
        </div>
      </section>

      {deleteTarget && (
        <div className="materi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
          <section className="materi-modal" role="dialog" aria-modal="true" aria-labelledby="hapus-sesi-title">
            <div className="materi-modal-header d-flex align-items-start justify-content-between gap-3">
              <div>
                <p className="text-white text-opacity-75 fs-7 mb-1">Sesi Pelatihan</p>
                <h2 id="hapus-sesi-title" className="fs-4 fw-bold mb-0">Hapus Sesi</h2>
              </div>
              <button type="button" className="materi-modal-close" onClick={() => setDeleteTarget(null)} aria-label="Tutup konfirmasi"><X size={18} /></button>
            </div>
            <div className="materi-modal-body">
              <p className="text-gray-700 mb-0">Apakah Anda yakin ingin menghapus sesi <strong>{deleteTarget.nomor}</strong> dengan jam <strong>{deleteTarget.jam}</strong>?</p>
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
