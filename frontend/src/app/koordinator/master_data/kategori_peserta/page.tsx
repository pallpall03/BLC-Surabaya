"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";

const LIST_PATH = "/koordinator/master_data/kategori_peserta";
const JENIS_KATEGORI = ["ORGANISASI", "PELAJAR"] as const;

type JenisKategori = (typeof JENIS_KATEGORI)[number];
type KategoriPeserta = { id: string; jenis: JenisKategori; nama: string };
type SortKey = "nomor" | "jenis" | "kategori";
type SortDirection = "asc" | "desc";
type FormMode = "baru" | "ubah";

const DATA_AWAL: KategoriPeserta[] = [
  { id: "kategori-1", jenis: "ORGANISASI", nama: "KIM" },
  { id: "kategori-2", jenis: "ORGANISASI", nama: "KADER (KSH)" },
  { id: "kategori-3", jenis: "PELAJAR", nama: "SD" },
  { id: "kategori-4", jenis: "PELAJAR", nama: "SMP" },
  { id: "kategori-5", jenis: "PELAJAR", nama: "SMA/SMK" },
  { id: "kategori-6", jenis: "PELAJAR", nama: "MAHASISWA" },
  { id: "kategori-7", jenis: "ORGANISASI", nama: "UKKM" },
  { id: "kategori-8", jenis: "ORGANISASI", nama: "PKKK" },
  { id: "kategori-9", jenis: "ORGANISASI", nama: "KARTAR" },
  { id: "kategori-10", jenis: "ORGANISASI", nama: "PENDIDIK PAUD" },
  { id: "kategori-11", jenis: "PELAJAR", nama: "SMA/MA" },
  { id: "kategori-12", jenis: "PELAJAR", nama: "SMK/MAK" },
  { id: "kategori-13", jenis: "ORGANISASI", nama: "KARANG TARUNA" },
  { id: "kategori-14", jenis: "ORGANISASI", nama: "PEMUDA" },
  { id: "kategori-15", jenis: "PELAJAR", nama: "KULIAH" },
  { id: "kategori-16", jenis: "PELAJAR", nama: "PESANTREN" },
  { id: "kategori-17", jenis: "ORGANISASI", nama: "LEMBAGA" },
];

function KategoriPesertaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formQuery = searchParams.toString();
  const { showNotification } = useCrudNotification();
  const [items, setItems] = useState<KategoriPeserta[]>(DATA_AWAL);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("nomor");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [deleteTarget, setDeleteTarget] = useState<KategoriPeserta | null>(null);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formJenis, setFormJenis] = useState<JenisKategori>("ORGANISASI");
  const [formNama, setFormNama] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(formQuery);
    const mode = params.get("form");
    const id = params.get("id");

    if (mode === "baru") {
      setFormMode("baru");
      setEditingId(null);
      setFormJenis("ORGANISASI");
      setFormNama("");
      setFormError("");
      return;
    }

    if (mode === "ubah" && id) {
      const item = itemsRef.current.find((entry) => entry.id === id);
      if (!item) {
        setFormMode(null);
        showNotification({ type: "error", title: "Kategori tidak ditemukan", message: "Data kategori yang ingin diubah sudah tidak tersedia." });
        router.replace(LIST_PATH, { scroll: false });
        return;
      }
      setFormMode("ubah");
      setEditingId(item.id);
      setFormJenis(item.jenis);
      setFormNama(item.nama);
      setFormError("");
      return;
    }

    setFormMode(null);
    setEditingId(null);
    setFormError("");
  }, [formQuery, router, showNotification]);

  useEffect(() => {
    if (!deleteTarget && !formMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (deleteTarget) {
        setDeleteTarget(null);
        return;
      }
      setFormMode(null);
      setEditingId(null);
      setFormError("");
      router.replace(LIST_PATH, { scroll: false });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [deleteTarget, formMode, router]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("id");
    if (!keyword) return items;
    return items.filter((item) => `${item.jenis} ${item.nama}`.toLocaleLowerCase("id").includes(keyword));
  }, [items, query]);

  const sortedItems = useMemo(() => {
    const direction = sortDirection === "asc" ? 1 : -1;
    return [...filteredItems].sort((a, b) => {
      if (sortKey === "nomor") {
        return (items.findIndex((item) => item.id === a.id) - items.findIndex((item) => item.id === b.id)) * direction;
      }
      const left = sortKey === "kategori" ? a.nama : a.jenis;
      const right = sortKey === "kategori" ? b.nama : b.jenis;
      return left.localeCompare(right, "id", { numeric: true }) * direction;
    });
  }, [filteredItems, items, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleItems = sortedItems.slice(startIndex, startIndex + pageSize);
  const showingStart = sortedItems.length ? startIndex + 1 : 0;
  const showingEnd = Math.min(startIndex + pageSize, sortedItems.length);

  const changeSort = (key: SortKey) => {
    if (sortKey === key) setSortDirection((current) => current === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const bukaForm = (mode: FormMode, item?: KategoriPeserta) => {
    if (mode === "ubah" && !item) {
      showNotification({ type: "error", title: "Kategori tidak ditemukan", message: "Data kategori yang ingin diubah sudah tidak tersedia." });
      return;
    }
    setFormMode(mode);
    setEditingId(item?.id ?? null);
    setFormJenis(item?.jenis ?? "ORGANISASI");
    setFormNama(item?.nama ?? "");
    setFormError("");
    const params = new URLSearchParams({ form: mode });
    if (item) params.set("id", item.id);
    router.replace(`${LIST_PATH}?${params.toString()}`, { scroll: false });
  };

  const tutupForm = () => {
    setFormMode(null);
    setEditingId(null);
    setFormError("");
    router.replace(LIST_PATH, { scroll: false });
  };

  const simpanKategori = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const namaBersih = formNama.trim().toLocaleUpperCase("id");
    if (!formJenis) {
      setFormError("Jenis kategori wajib dipilih.");
      showNotification({ type: "error", title: "Kategori gagal disimpan", message: "Jenis kategori wajib dipilih." });
      return;
    }
    if (!namaBersih) {
      setFormError("Nama kategori wajib diisi.");
      showNotification({ type: "error", title: "Kategori gagal disimpan", message: "Nama kategori wajib diisi." });
      return;
    }
    const duplikat = items.some((item) =>
      item.id !== editingId
      && item.jenis === formJenis
      && item.nama.toLocaleLowerCase("id") === namaBersih.toLocaleLowerCase("id"));
    if (duplikat) {
      setFormError("Kategori dengan jenis dan nama yang sama sudah tersedia.");
      showNotification({ type: "error", title: "Kategori gagal disimpan", message: "Kategori dengan jenis dan nama yang sama sudah tersedia." });
      return;
    }

    if (formMode === "ubah" && editingId) {
      setItems((current) => current.map((item) => item.id === editingId ? { ...item, jenis: formJenis, nama: namaBersih } : item));
      showNotification({ type: "success", title: "Kategori diperbarui", message: `Kategori ${namaBersih} berhasil diperbarui.` });
    } else {
      const id = `kategori-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
      setItems((current) => [...current, { id, jenis: formJenis, nama: namaBersih }]);
      showNotification({ type: "success", title: "Kategori ditambahkan", message: `Kategori ${namaBersih} berhasil ditambahkan.` });
    }
    tutupForm();
    setPage(1);
  };

  const konfirmasiHapus = () => {
    if (!deleteTarget) return;
    setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
    showNotification({ type: "success", title: "Kategori dihapus", message: `Kategori ${deleteTarget.nama} berhasil dihapus.` });
    setDeleteTarget(null);
  };

  const sortButton = (key: SortKey, label: string) => (
    <button type="button" className="kategori-sort" onClick={() => changeSort(key)} aria-label={`Urutkan ${label}`}>
      <span>{label}</span><ArrowUpDown size={14} />
    </button>
  );

  return (
    <main className="kategori-page">
      <section className="materi-page-header">
        <div className="materi-breadcrumb d-flex align-items-center gap-2 fs-7 fw-semibold mb-2">
          <Home size={14} /><span>Master Data</span><ChevronRight size={14} /><span>Kategori Peserta</span>
        </div>
        <h1 className="fs-2 fw-bolder mb-0">Daftar Kategori Peserta Pelatihan</h1>
      </section>

      <section className="card kategori-table-card mt-4" aria-labelledby="kategori-table-title">
        <div className="card-header d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 py-4 px-4 px-lg-5">
          <div className="d-flex align-items-center gap-3">
            <span className="symbol symbol-40px">
              <span className="symbol-label bg-blue-100 text-blue-600"><UserRound size={20} /></span>
            </span>
            <h2 id="kategori-table-title" className="fs-5 fw-bold text-gray-900 mb-0">Daftar Kategori Peserta Pelatihan</h2>
          </div>
          <button type="button" onClick={() => bukaForm("baru")} className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2">
            <Plus size={18} /> Buat Kategori Peserta Baru
          </button>
        </div>

        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div className="d-flex align-items-center gap-2 text-gray-700 fs-7">
              <label htmlFor="kategori-page-size">Show</label>
              <select
                id="kategori-page-size"
                className="form-select form-select-sm"
                style={{ width: 76 }}
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="kategori-search position-relative" style={{ maxWidth: 300, width: "100%" }}>
              <Search size={17} className="position-absolute text-gray-400" style={{ left: 13, top: 10, zIndex: 2 }} />
              <input
                type="search"
                className="form-control form-control-sm"
                style={{ minHeight: 38, paddingLeft: 40 }}
                placeholder="Search..."
                aria-label="Cari kategori peserta"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle materi-table kategori-table">
              <caption className="visually-hidden">Daftar kategori peserta pelatihan</caption>
              <thead>
                <tr>
                  <th scope="col" style={{ width: 80 }}>{sortButton("nomor", "No.")}</th>
                  <th scope="col">{sortButton("jenis", "Jenis Kategori")}</th>
                  <th scope="col">{sortButton("kategori", "Kategori")}</th>
                  <th scope="col" style={{ width: 190 }} className="text-end">#</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr key={item.id}>
                    <td><span className="materi-number">{items.findIndex((entry) => entry.id === item.id) + 1}</span></td>
                    <td className="kategori-jenis">{item.jenis}</td>
                    <td className="kategori-nama">{item.nama}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="kategori-action-btn edit" onClick={() => bukaForm("ubah", item)} aria-label={`Ubah ${item.nama}`}>
                          <Pencil size={14} /> Ubah
                        </button>
                        <button type="button" className="kategori-action-btn delete" onClick={() => setDeleteTarget(item)} aria-label={`Hapus ${item.nama}`}>
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!visibleItems.length && (
                  <tr>
                    <td colSpan={4}>
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
          <nav className="kategori-pagination" aria-label="Pagination kategori peserta">
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

      {formMode && (
        <div className="materi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) tutupForm(); }}>
          <section className="materi-modal" role="dialog" aria-modal="true" aria-labelledby="form-kategori-title">
            <div className="materi-modal-header d-flex align-items-start justify-content-between gap-3">
              <div>
                <p className="text-white text-opacity-75 fs-7 mb-1">Kategori Peserta</p>
                <h2 id="form-kategori-title" className="fs-4 fw-bold mb-0">{formMode === "ubah" ? "Ubah Kategori" : "Buat Kategori Baru"}</h2>
              </div>
              <button type="button" className="materi-modal-close" onClick={tutupForm} aria-label="Tutup form"><X size={18} /></button>
            </div>
            <div className="materi-modal-body">
              <form onSubmit={simpanKategori} noValidate>
                <div className="row g-4">
                  <div className="col-12 col-lg-5">
                    <label htmlFor="kategori-form-jenis" className="form-label fw-semibold">Jenis Kategori</label>
                    <select
                      id="kategori-form-jenis"
                      className="form-select"
                      value={formJenis}
                      onChange={(event) => {
                        setFormJenis(event.target.value as JenisKategori);
                        setFormError("");
                      }}
                      required
                    >
                      {JENIS_KATEGORI.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-lg-7">
                    <label htmlFor="kategori-form-nama" className="form-label fw-semibold">Kategori</label>
                    <input
                      id="kategori-form-nama"
                      className="form-control"
                      value={formNama}
                      onChange={(event) => {
                        setFormNama(event.target.value);
                        setFormError("");
                      }}
                      placeholder="Contoh: KIM"
                      maxLength={100}
                      autoFocus
                      required
                    />
                  </div>
                </div>
                {formError && <div className="alert alert-danger mt-4 mb-0 py-3" role="alert">{formError}</div>}
                <div className="d-flex justify-content-end gap-3 mt-5">
                  <button type="button" className="btn btn-light" onClick={tutupForm}>Batal</button>
                  <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2"><Save size={16} /> Simpan</button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="materi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
          <section className="materi-modal" role="dialog" aria-modal="true" aria-labelledby="hapus-kategori-title">
            <div className="materi-modal-header d-flex align-items-start justify-content-between gap-3">
              <div>
                <p className="text-white text-opacity-75 fs-7 mb-1">Kategori Peserta</p>
                <h2 id="hapus-kategori-title" className="fs-4 fw-bold mb-0">Hapus Kategori</h2>
              </div>
              <button type="button" className="materi-modal-close" onClick={() => setDeleteTarget(null)} aria-label="Tutup konfirmasi"><X size={18} /></button>
            </div>
            <div className="materi-modal-body">
              <p className="text-gray-700 mb-0">Apakah Anda yakin ingin menghapus kategori <strong>{deleteTarget.nama}</strong>?</p>
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

export default function KategoriPesertaPage() {
  return (
    <Suspense fallback={<main className="kategori-page"><div className="card p-5 text-muted">Memuat data kategori...</div></main>}>
      <KategoriPesertaContent />
    </Suspense>
  );
}
