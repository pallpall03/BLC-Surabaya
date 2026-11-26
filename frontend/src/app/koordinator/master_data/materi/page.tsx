"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers3,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";

const KATEGORI_MATERI = [
  "Teknologi Informasi",
  "Aplikasi Perkantoran",
  "Desain",
  "Bisnis Digital",
] as const;

const PILIHAN_PERTEMUAN = [1, 2, 3, 4, 5, 6, 7, 8] as const;

type KategoriMateri = (typeof KATEGORI_MATERI)[number];

type MateriItem = {
  id: string;
  nama: string;
  kategori: KategoriMateri;
  pertemuan: number[];
};

const INITIAL_MATERI: MateriItem[] = [
  { id: "materi-1", nama: "Pengenalan Komputer", kategori: "Teknologi Informasi", pertemuan: [1, 2] },
  { id: "materi-2", nama: "Aplikasi Perkantoran", kategori: "Aplikasi Perkantoran", pertemuan: [1, 2, 3] },
  { id: "materi-3", nama: "Desain Grafis", kategori: "Desain", pertemuan: [1, 2] },
  { id: "materi-4", nama: "Internet dan Email", kategori: "Teknologi Informasi", pertemuan: [1] },
  { id: "materi-5", nama: "Kewirausahaan Digital", kategori: "Bisnis Digital", pertemuan: [1] },
];

function newId() {
  return `materi-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

export default function MateriPage() {
  const { showNotification } = useCrudNotification();
  const [materiList, setMateriList] = useState<MateriItem[]>(INITIAL_MATERI);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState<KategoriMateri | "">("");
  const [pertemuan, setPertemuan] = useState<number[]>([]);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MateriItem | null>(null);

  useEffect(() => {
    if (!formOpen && !deleteTarget) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormOpen(false);
        setDeleteTarget(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [formOpen, deleteTarget]);

  const filteredMateri = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("id");
    if (!keyword) return materiList;
    return materiList.filter((item) => (
      `${item.nama} ${item.kategori} pertemuan ${item.pertemuan.join(", ")}`
        .toLocaleLowerCase("id")
        .includes(keyword)
    ));
  }, [materiList, query]);

  const totalPertemuan = materiList.reduce((total, item) => total + item.pertemuan.length, 0);

  const openCreate = () => {
    setEditingId(null);
    setFormError("");
    setNama("");
    setKategori("");
    setPertemuan([]);
    setFormOpen(true);
  };

  const openEdit = (item: MateriItem) => {
    setEditingId(item.id);
    setFormError("");
    setNama(item.nama);
    setKategori(item.kategori);
    setPertemuan([...item.pertemuan]);
    setFormOpen(true);
  };

  const togglePertemuan = (nomor: number) => {
    setPertemuan((current) => (
      current.includes(nomor)
        ? current.filter((item) => item !== nomor)
        : [...current, nomor].sort((a, b) => a - b)
    ));
    setFormError("");
  };

  const simpanMateri = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const namaBersih = nama.trim();

    if (!namaBersih) {
      setFormError("Nama materi wajib diisi.");
      showNotification({ type: "error", title: "Materi gagal disimpan", message: "Nama materi wajib diisi." });
      return;
    }
    if (!kategori) {
      setFormError("Pilih kategori materi terlebih dahulu.");
      showNotification({ type: "error", title: "Materi gagal disimpan", message: "Pilih kategori materi terlebih dahulu." });
      return;
    }
    if (!pertemuan.length) {
      setFormError("Pilih minimal satu pertemuan.");
      showNotification({ type: "error", title: "Materi gagal disimpan", message: "Pilih minimal satu pertemuan." });
      return;
    }

    const duplikat = materiList.some((item) => (
      item.nama.toLocaleLowerCase("id") === namaBersih.toLocaleLowerCase("id")
      && item.id !== editingId
    ));
    if (duplikat) {
      setFormError("Nama materi sudah digunakan. Pilih nama lain.");
      showNotification({ type: "error", title: "Materi gagal disimpan", message: "Nama materi sudah digunakan. Pilih nama lain." });
      return;
    }

    if (editingId) {
      setMateriList((items) => items.map((item) => (
        item.id === editingId
          ? { ...item, nama: namaBersih, kategori, pertemuan }
          : item
      )));
      showNotification({ type: "success", title: "Materi diperbarui", message: "Data materi berhasil diperbarui." });
    } else {
      setMateriList((items) => [
        ...items,
        { id: newId(), nama: namaBersih, kategori, pertemuan },
      ]);
      showNotification({ type: "success", title: "Materi ditambahkan", message: "Materi pelatihan berhasil ditambahkan." });
    }
    setFormOpen(false);
  };

  const hapusMateri = () => {
    if (!deleteTarget) return;
    setMateriList((items) => items.filter((item) => item.id !== deleteTarget.id));
    showNotification({ type: "success", title: "Materi dihapus", message: "Materi pelatihan berhasil dihapus." });
    setDeleteTarget(null);
  };

  return (
    <main className="materi-page">
      <section className="materi-page-header text-white" aria-labelledby="materi-title">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div>
            <div className="materi-breadcrumb d-flex align-items-center gap-2 text-white fs-7 fw-semibold mb-2">
              <span>Master Data</span><ChevronRight size={14} /><span>Materi</span>
            </div>
            <h1 id="materi-title" className="fs-2 fw-bolder mb-2">Kelola Materi Pelatihan</h1>
            <p className="mb-0 text-white text-opacity-75">Atur nama, kategori, dan pertemuan materi dalam satu daftar.</p>
          </div>
          <span className="symbol symbol-55px flex-shrink-0" aria-hidden="true">
            <span className="symbol-label bg-white bg-opacity-15 text-white"><Layers3 size={27} /></span>
          </span>
        </div>
      </section>

      <section className="row g-4 mt-1" aria-label="Ringkasan materi">
        <div className="col-12 col-md-6">
          <div className="card materi-stat-card h-100">
            <div className="card-body d-flex align-items-center gap-4 p-4">
              <span className="symbol symbol-45px flex-shrink-0">
                <span className="symbol-label bg-blue-100 text-blue-600"><BookOpen size={22} /></span>
              </span>
              <div>
                <span className="text-muted fs-7 fw-semibold d-block mb-1">Total materi pelatihan</span>
                <strong className="text-gray-900 fs-2 fw-bolder">{materiList.length}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card materi-stat-card h-100">
            <div className="card-body d-flex align-items-center gap-4 p-4">
              <span className="symbol symbol-45px flex-shrink-0">
                <span className="symbol-label bg-orange-100 text-orange-600"><CalendarDays size={22} /></span>
              </span>
              <div>
                <span className="text-muted fs-7 fw-semibold d-block mb-1">Total pertemuan terpetakan</span>
                <strong className="text-gray-900 fs-2 fw-bolder">{totalPertemuan}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card materi-table-card mt-4" aria-labelledby="materi-table-title">
        <div className="card-header d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-4 py-4 px-4 px-lg-5">
          <div className="d-flex align-items-center gap-3">
            <span className="symbol symbol-40px">
              <span className="symbol-label bg-blue-100 text-blue-600"><BookOpen size={20} /></span>
            </span>
            <div>
              <h2 id="materi-table-title" className="fs-5 fw-bold text-gray-900 mb-1">Daftar Materi Pelatihan</h2>
              <p className="text-muted fs-7 mb-0">Kelola materi beserta kategori dan pertemuannya.</p>
            </div>
          </div>
          <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3 w-100 w-xl-auto">
            <div className="position-relative materi-search flex-grow-1" style={{ minWidth: 260 }}>
              <Search size={18} className="position-absolute text-gray-400" style={{ left: 15, top: 13, zIndex: 2 }} />
              <input
                type="search"
                className="form-control"
                placeholder="Cari materi, kategori, atau pertemuan…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Cari materi pelatihan"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2 flex-shrink-0"
              onClick={openCreate}
            >
              <Plus size={18} /> Tambah Materi
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle materi-table">
              <caption className="visually-hidden">Daftar materi pelatihan BLC</caption>
              <thead>
                <tr>
                  <th scope="col" style={{ width: 80 }}>No</th>
                  <th scope="col">Nama Materi</th>
                  <th scope="col" style={{ width: 230 }}>Kategori Materi</th>
                  <th scope="col">Per Pertemuan</th>
                  <th scope="col" style={{ width: 130 }} className="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMateri.map((item, index) => (
                  <tr key={item.id}>
                    <td><span className="materi-number">{index + 1}</span></td>
                    <td className="materi-name">{item.nama}</td>
                    <td><span className="materi-category-badge">{item.kategori}</span></td>
                    <td>
                      <div className="materi-meeting-list">
                        {item.pertemuan.map((nomor) => (
                          <span className="materi-meeting-badge" key={nomor}>
                            <CalendarDays size={14} /> Pertemuan {nomor}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="materi-action-btn edit" aria-label={`Ubah ${item.nama}`} title="Ubah materi" onClick={() => openEdit(item)}><Pencil size={16} /></button>
                        <button type="button" className="materi-action-btn delete" aria-label={`Hapus ${item.nama}`} title="Hapus materi" onClick={() => setDeleteTarget(item)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filteredMateri.length && (
            <div className="d-flex flex-column align-items-center text-center px-4 py-8">
              <span className="symbol symbol-55px mb-4">
                <span className="symbol-label bg-blue-100 text-blue-600"><BookOpen size={25} /></span>
              </span>
              <h3 className="fs-6 fw-bold text-gray-900 mb-2">{query ? "Data tidak ditemukan" : "Belum ada data"}</h3>
              <p className="text-muted mb-0">{query ? "Coba gunakan kata kunci lain." : "Tambahkan materi pelatihan pertama."}</p>
            </div>
          )}
        </div>

        <div className="card-footer bg-blue-50 border-0 px-4 px-lg-5 py-3">
          <div className="d-flex align-items-start gap-2 text-blue-800 fs-7">
            <Info size={16} className="flex-shrink-0 mt-1" />
            <p className="mb-0">Satu materi dapat dipetakan ke beberapa pertemuan. Pilih pertemuannya saat menambah atau mengubah materi.</p>
          </div>
        </div>
      </section>

      {formOpen && (
        <div className="materi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}>
          <section className="materi-modal" role="dialog" aria-modal="true" aria-labelledby="form-materi-title">
            <div className="materi-modal-header d-flex align-items-start justify-content-between gap-3">
              <div>
                <p className="text-white text-opacity-75 fs-7 mb-1">Materi Pelatihan</p>
                <h2 id="form-materi-title" className="fs-4 fw-bold mb-0">{editingId ? "Ubah Materi" : "Tambah Materi"}</h2>
              </div>
              <button type="button" className="materi-modal-close" aria-label="Tutup formulir" onClick={() => setFormOpen(false)}><X size={19} /></button>
            </div>

            <form onSubmit={simpanMateri} noValidate>
              <div className="materi-modal-body">
                {formError && <div className="alert alert-danger py-2 fs-7" role="alert">{formError}</div>}

                <div className="mb-4">
                  <label htmlFor="nama-materi" className="form-label fw-semibold text-gray-800">Nama Materi <span className="text-danger">*</span></label>
                  <input
                    id="nama-materi"
                    className={`form-control${!nama.trim() && formError ? " is-invalid" : ""}`}
                    value={nama}
                    onChange={(event) => {
                      setNama(event.target.value);
                      setFormError("");
                    }}
                    placeholder="Contoh: Desain Grafis"
                    maxLength={120}
                    autoFocus
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="kategori-materi" className="form-label fw-semibold text-gray-800">Kategori Materi <span className="text-danger">*</span></label>
                  <select
                    id="kategori-materi"
                    className={`form-select${!kategori && formError ? " is-invalid" : ""}`}
                    value={kategori}
                    onChange={(event) => {
                      setKategori(event.target.value as KategoriMateri);
                      setFormError("");
                    }}
                    required
                  >
                    <option value="" disabled>Pilih kategori materi</option>
                    {KATEGORI_MATERI.map((item) => <option value={item} key={item}>{item}</option>)}
                  </select>
                </div>

                <fieldset>
                  <legend className="form-label fw-semibold text-gray-800">Per Pertemuan <span className="text-danger">*</span></legend>
                  <div className="materi-meeting-options">
                    {PILIHAN_PERTEMUAN.map((nomor) => {
                      const selected = pertemuan.includes(nomor);
                      return (
                        <label className={`materi-meeting-option${selected ? " selected" : ""}`} key={nomor}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selected}
                            onChange={() => togglePertemuan(nomor)}
                          />
                          <span>Pertemuan {nomor}</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-muted fs-8 mt-2 mb-0">Pilih satu atau beberapa pertemuan untuk materi ini.</p>
                </fieldset>
              </div>
              <div className="d-flex justify-content-end gap-3 px-4 pb-4">
                <button type="button" className="btn btn-light" onClick={() => setFormOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2"><CheckCircle2 size={17} /> Simpan</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="materi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
          <section className="materi-modal" style={{ maxWidth: 430 }} role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="materi-modal-body text-center pt-5">
              <span className="symbol symbol-55px mb-4">
                <span className="symbol-label bg-red-100 text-red-600"><Trash2 size={24} /></span>
              </span>
              <h2 id="delete-title" className="fs-5 fw-bold text-gray-900 mb-2">Hapus materi ini?</h2>
              <p className="text-muted mb-0">Materi <strong className="text-gray-800">“{deleteTarget.nama}”</strong> beserta pilihan pertemuannya akan dihapus.</p>
            </div>
            <div className="d-flex justify-content-center gap-3 px-4 pb-5">
              <button type="button" className="btn btn-light" onClick={() => setDeleteTarget(null)}>Batal</button>
              <button type="button" className="btn btn-danger d-flex align-items-center gap-2" onClick={hapusMateri}><Trash2 size={17} /> Hapus</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
