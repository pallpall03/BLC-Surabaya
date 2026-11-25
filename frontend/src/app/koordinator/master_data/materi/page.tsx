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

type Tab = "materi" | "pertemuan";

type MateriItem = {
  id: string;
  nama: string;
  deskripsi: string;
};

type PertemuanItem = {
  id: string;
  materiId: string;
  nomor: number;
};

const INITIAL_MATERI: MateriItem[] = [
  { id: "materi-1", nama: "Pengenalan Komputer", deskripsi: "Dasar perangkat keras, perangkat lunak, dan penggunaan komputer." },
  { id: "materi-2", nama: "Aplikasi Perkantoran", deskripsi: "Pengolahan dokumen, tabel, dan presentasi untuk kebutuhan pekerjaan." },
  { id: "materi-3", nama: "Desain Grafis", deskripsi: "Prinsip warna, tipografi, komposisi, dan pembuatan visual." },
  { id: "materi-4", nama: "Internet dan Email", deskripsi: "Mencari informasi, berkomunikasi, dan mengirim email dengan aman." },
  { id: "materi-5", nama: "Kewirausahaan Digital", deskripsi: "Dasar promosi online dan pengembangan usaha berbasis digital." },
];

const INITIAL_PERTEMUAN: PertemuanItem[] = [
  { id: "pertemuan-1", materiId: "materi-1", nomor: 1 },
  { id: "pertemuan-2", materiId: "materi-1", nomor: 2 },
  { id: "pertemuan-3", materiId: "materi-2", nomor: 1 },
  { id: "pertemuan-4", materiId: "materi-2", nomor: 2 },
  { id: "pertemuan-5", materiId: "materi-2", nomor: 3 },
  { id: "pertemuan-6", materiId: "materi-3", nomor: 1 },
  { id: "pertemuan-7", materiId: "materi-3", nomor: 2 },
];

function newId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

export default function MateriPage() {
  const [tab, setTab] = useState<Tab>("materi");
  const [materiList, setMateriList] = useState<MateriItem[]>(INITIAL_MATERI);
  const [pertemuanList, setPertemuanList] = useState<PertemuanItem[]>(INITIAL_PERTEMUAN);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [materiId, setMateriId] = useState("");
  const [nomorPertemuan, setNomorPertemuan] = useState("1");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ tab: Tab; id: string } | null>(null);

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
    return materiList.filter((item) => `${item.nama} ${item.deskripsi}`.toLocaleLowerCase("id").includes(keyword));
  }, [materiList, query]);

  const filteredPertemuan = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("id");
    if (!keyword) return pertemuanList;
    return pertemuanList.filter((item) => {
      const namaMateri = materiList.find((materi) => materi.id === item.materiId)?.nama ?? "";
      return `${namaMateri} pertemuan ${item.nomor}`.toLocaleLowerCase("id").includes(keyword);
    });
  }, [materiList, pertemuanList, query]);

  const totalMateriTerpetakan = new Set(pertemuanList.map((item) => item.materiId)).size;
  const deleteName = deleteTarget?.tab === "materi"
    ? materiList.find((item) => item.id === deleteTarget.id)?.nama
    : pertemuanList.find((item) => item.id === deleteTarget?.id)?.nomor;

  const changeTab = (nextTab: Tab) => {
    setTab(nextTab);
    setQuery("");
    setFormError("");
  };

  const openCreate = () => {
    setEditingId(null);
    setFormError("");
    setNama("");
    setDeskripsi("");
    setMateriId(materiList[0]?.id ?? "");
    setNomorPertemuan("1");
    setFormOpen(true);
  };

  const openEditMateri = (item: MateriItem) => {
    setTab("materi");
    setEditingId(item.id);
    setFormError("");
    setNama(item.nama);
    setDeskripsi(item.deskripsi);
    setFormOpen(true);
  };

  const openEditPertemuan = (item: PertemuanItem) => {
    setTab("pertemuan");
    setEditingId(item.id);
    setFormError("");
    setMateriId(item.materiId);
    setNomorPertemuan(String(item.nomor));
    setFormOpen(true);
  };

  const simpanMateri = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const namaBersih = nama.trim();
    if (!namaBersih) {
      setFormError("Nama materi wajib diisi.");
      return;
    }
    const duplikat = materiList.some((item) => item.nama.toLocaleLowerCase("id") === namaBersih.toLocaleLowerCase("id") && item.id !== editingId);
    if (duplikat) {
      setFormError("Nama materi sudah digunakan. Pilih nama lain.");
      return;
    }
    if (editingId) {
      setMateriList((items) => items.map((item) => item.id === editingId ? { ...item, nama: namaBersih, deskripsi: deskripsi.trim() } : item));
      setNotice("Materi pelatihan berhasil diperbarui.");
    } else {
      setMateriList((items) => [...items, { id: newId("materi"), nama: namaBersih, deskripsi: deskripsi.trim() }]);
      setNotice("Materi pelatihan berhasil ditambahkan.");
    }
    setFormOpen(false);
  };

  const simpanPertemuan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nomor = Number(nomorPertemuan);
    if (!materiId) {
      setFormError("Pilih materi terlebih dahulu.");
      return;
    }
    if (!Number.isInteger(nomor) || nomor < 1 || nomor > 999) {
      setFormError("Nomor pertemuan harus berupa angka 1 sampai 999.");
      return;
    }
    const duplikat = pertemuanList.some((item) => item.materiId === materiId && item.nomor === nomor && item.id !== editingId);
    if (duplikat) {
      setFormError("Materi ini sudah dipetakan ke pertemuan tersebut.");
      return;
    }
    if (editingId) {
      setPertemuanList((items) => items.map((item) => item.id === editingId ? { ...item, materiId, nomor } : item));
      setNotice("Materi per pertemuan berhasil diperbarui.");
    } else {
      setPertemuanList((items) => [...items, { id: newId("pertemuan"), materiId, nomor }]);
      setNotice("Materi per pertemuan berhasil ditambahkan.");
    }
    setFormOpen(false);
  };

  const hapusData = () => {
    if (!deleteTarget) return;
    if (deleteTarget.tab === "materi") {
      setMateriList((items) => items.filter((item) => item.id !== deleteTarget.id));
      setPertemuanList((items) => items.filter((item) => item.materiId !== deleteTarget.id));
      setNotice("Materi dan pemetaan pertemuannya berhasil dihapus.");
    } else {
      setPertemuanList((items) => items.filter((item) => item.id !== deleteTarget.id));
      setNotice("Materi per pertemuan berhasil dihapus.");
    }
    setDeleteTarget(null);
  };

  const activeList = tab === "materi" ? filteredMateri : filteredPertemuan;

  return (
    <main className="materi-page">
      <section className="materi-page-header text-white" aria-labelledby="materi-title">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div>
            <div className="d-flex align-items-center gap-2 text-white text-opacity-75 fs-7 fw-semibold mb-2">
              <span>Master Data</span><ChevronRight size={14} /><span>Materi</span>
            </div>
            <h1 id="materi-title" className="fs-2 fw-bolder mb-2">Kelola Materi Pelatihan</h1>
            <p className="mb-0 text-white text-opacity-75">Satu halaman untuk mengelola materi dan pemetaan materi per pertemuan.</p>
          </div>
          <span className="symbol symbol-55px flex-shrink-0" aria-hidden="true">
            <span className="symbol-label bg-white bg-opacity-15 text-white"><Layers3 size={27} /></span>
          </span>
        </div>
      </section>

      <section className="row g-4 mt-1" aria-label="Ringkasan materi">
        <div className="col-12 col-md-6">
          <div className="card materi-stat-card">
            <div className="card-body d-flex align-items-center gap-4 p-4">
              <span className="symbol symbol-45px flex-shrink-0">
                <span className="symbol-label bg-orange-100 text-orange-600"><BookOpen size={22} /></span>
              </span>
              <div>
                <span className="text-muted fs-7 fw-semibold d-block mb-1">Total materi pelatihan</span>
                <strong className="text-gray-900 fs-2 fw-bolder">{materiList.length}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card materi-stat-card">
            <div className="card-body d-flex align-items-center gap-4 p-4">
              <span className="symbol symbol-45px flex-shrink-0">
                <span className="symbol-label bg-blue-100 text-blue-600"><CalendarDays size={22} /></span>
              </span>
              <div>
                <span className="text-muted fs-7 fw-semibold d-block mb-1">Materi terpetakan ke pertemuan</span>
                <strong className="text-gray-900 fs-2 fw-bolder">{totalMateriTerpetakan}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card materi-table-card mt-4" aria-label="Data materi">
        <div className="card-header py-4 px-4 px-lg-5">
          <div className="d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-4">
            <div className="w-100" style={{ maxWidth: 590 }}>
              <ul className="nav nav-pills materi-tabs" role="tablist" aria-label="Jenis data materi">
                <li className="nav-item flex-fill" role="presentation">
                  <button
                    type="button"
                    id="tab-materi"
                    className="nav-link d-flex align-items-center justify-content-center gap-2"
                    role="tab"
                    aria-selected={tab === "materi"}
                    aria-controls="panel-materi"
                    onClick={() => changeTab("materi")}
                  >
                    <BookOpen size={17} /> Materi Pelatihan
                  </button>
                </li>
                <li className="nav-item flex-fill" role="presentation">
                  <button
                    type="button"
                    id="tab-pertemuan"
                    className="nav-link d-flex align-items-center justify-content-center gap-2"
                    role="tab"
                    aria-selected={tab === "pertemuan"}
                    aria-controls="panel-pertemuan"
                    onClick={() => changeTab("pertemuan")}
                  >
                    <CalendarDays size={17} /> Materi per Pertemuan
                  </button>
                </li>
              </ul>
            </div>

            <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3 w-100 w-xl-auto">
              <div className="position-relative materi-search flex-grow-1" style={{ minWidth: 250 }}>
                <Search size={18} className="position-absolute text-gray-400" style={{ left: 15, top: 13, zIndex: 2 }} />
                <input
                  type="search"
                  className="form-control"
                  placeholder={tab === "materi" ? "Cari nama atau deskripsi materi…" : "Cari materi atau nomor pertemuan…"}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Cari data materi"
                />
              </div>
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center justify-content-center gap-2 flex-shrink-0"
                onClick={openCreate}
                disabled={tab === "pertemuan" && materiList.length === 0}
              >
                <Plus size={18} /> {tab === "materi" ? "Tambah Materi" : "Tambah Pemetaan"}
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div
            id={tab === "materi" ? "panel-materi" : "panel-pertemuan"}
            role="tabpanel"
            aria-labelledby={tab === "materi" ? "tab-materi" : "tab-pertemuan"}
          >
            <div className="table-responsive">
              <table className="table align-middle materi-table">
                <caption className="visually-hidden">
                  {tab === "materi" ? "Daftar materi pelatihan" : "Daftar pemetaan materi ke pertemuan"}
                </caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ width: 80 }}>No</th>
                    <th scope="col">{tab === "materi" ? "Nama Materi" : "Materi"}</th>
                    {tab === "materi" ? <th scope="col">Deskripsi</th> : <th scope="col" style={{ width: 210 }}>Pertemuan</th>}
                    <th scope="col" style={{ width: 130 }} className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tab === "materi" ? (
                    filteredMateri.map((item, index) => (
                      <tr key={item.id}>
                        <td><span className="materi-number">{index + 1}</span></td>
                        <td className="materi-name">{item.nama}</td>
                        <td>{item.deskripsi || <span className="text-muted">Belum ada deskripsi</span>}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <button type="button" className="materi-action-btn edit" aria-label={`Ubah ${item.nama}`} title="Ubah materi" onClick={() => openEditMateri(item)}><Pencil size={16} /></button>
                            <button type="button" className="materi-action-btn delete" aria-label={`Hapus ${item.nama}`} title="Hapus materi" onClick={() => setDeleteTarget({ tab: "materi", id: item.id })}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredPertemuan.map((item, index) => {
                      const namaMateri = materiList.find((materi) => materi.id === item.materiId)?.nama ?? "Materi tidak ditemukan";
                      return (
                        <tr key={item.id}>
                          <td><span className="materi-number">{index + 1}</span></td>
                          <td className="materi-name">{namaMateri}</td>
                          <td><span className="materi-meeting-badge"><CalendarDays size={14} /> Pertemuan ke-{item.nomor}</span></td>
                          <td>
                            <div className="d-flex justify-content-end gap-2">
                              <button type="button" className="materi-action-btn edit" aria-label={`Ubah pemetaan ${namaMateri} pertemuan ${item.nomor}`} title="Ubah pemetaan" onClick={() => openEditPertemuan(item)}><Pencil size={16} /></button>
                              <button type="button" className="materi-action-btn delete" aria-label={`Hapus pemetaan ${namaMateri} pertemuan ${item.nomor}`} title="Hapus pemetaan" onClick={() => setDeleteTarget({ tab: "pertemuan", id: item.id })}><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {activeList.length === 0 && (
              <div className="d-flex flex-column align-items-center text-center px-4 py-8">
                <span className="symbol symbol-55px mb-4">
                  <span className="symbol-label bg-orange-100 text-orange-600">{tab === "materi" ? <BookOpen size={25} /> : <CalendarDays size={25} />}</span>
                </span>
                <h3 className="fs-6 fw-bold text-gray-900 mb-2">{query ? "Data tidak ditemukan" : "Belum ada data"}</h3>
                <p className="text-muted mb-0">{query ? "Coba gunakan kata kunci lain." : tab === "materi" ? "Tambahkan materi pelatihan pertama." : "Tambahkan pemetaan materi ke pertemuan."}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card-footer bg-orange-50 border-0 px-4 px-lg-5 py-3">
          <div className="d-flex align-items-start gap-2 text-orange-800 fs-7">
            <Info size={16} className="flex-shrink-0 mt-1" />
            <p className="mb-0">Satu navigasi, dua logika data: materi pelatihan mengelola daftar materi, sedangkan materi per pertemuan mengelola relasinya.</p>
          </div>
        </div>
      </section>

      {formOpen && (
        <div className="materi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}>
          <section className="materi-modal" role="dialog" aria-modal="true" aria-labelledby="form-materi-title">
            <div className="materi-modal-header d-flex align-items-start justify-content-between gap-3">
              <div>
                <p className="text-white text-opacity-75 fs-7 mb-1">{tab === "materi" ? "Materi Pelatihan" : "Materi per Pertemuan"}</p>
                <h2 id="form-materi-title" className="fs-4 fw-bold mb-0">{editingId ? "Ubah Data" : "Tambah Data"}</h2>
              </div>
              <button type="button" className="materi-modal-close" aria-label="Tutup formulir" onClick={() => setFormOpen(false)}><X size={19} /></button>
            </div>

            <form onSubmit={tab === "materi" ? simpanMateri : simpanPertemuan}>
              <div className="materi-modal-body">
                {formError && <div className="alert alert-danger py-2 fs-7" role="alert">{formError}</div>}
                {tab === "materi" ? (
                  <>
                    <div className="mb-4">
                      <label htmlFor="nama-materi" className="form-label fw-semibold text-gray-800">Nama materi</label>
                      <input id="nama-materi" className="form-control" value={nama} onChange={(event) => setNama(event.target.value)} placeholder="Contoh: Desain Grafis" maxLength={120} autoFocus required />
                    </div>
                    <div>
                      <label htmlFor="deskripsi-materi" className="form-label fw-semibold text-gray-800">Deskripsi</label>
                      <textarea id="deskripsi-materi" className="form-control" value={deskripsi} onChange={(event) => setDeskripsi(event.target.value)} placeholder="Jelaskan isi materi secara singkat…" maxLength={500} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label htmlFor="pilih-materi" className="form-label fw-semibold text-gray-800">Pilih materi</label>
                      <select id="pilih-materi" className="form-select" value={materiId} onChange={(event) => setMateriId(event.target.value)} autoFocus required>
                        <option value="" disabled>Pilih materi pelatihan</option>
                        {materiList.map((item) => <option value={item.id} key={item.id}>{item.nama}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="nomor-pertemuan" className="form-label fw-semibold text-gray-800">Nomor pertemuan</label>
                      <input id="nomor-pertemuan" type="number" min={1} max={999} className="form-control" value={nomorPertemuan} onChange={(event) => setNomorPertemuan(event.target.value)} required />
                    </div>
                    <div className="d-flex align-items-start gap-2 mt-4 p-3 rounded-3 bg-blue-50 text-blue-800 fs-7">
                      <Info size={16} className="flex-shrink-0 mt-1" />
                      <span>Pemetaan ini terpisah dari daftar materi, sehingga satu materi dapat digunakan pada beberapa pertemuan.</span>
                    </div>
                  </>
                )}
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
              <h2 id="delete-title" className="fs-5 fw-bold text-gray-900 mb-2">Hapus data ini?</h2>
              <p className="text-muted mb-0">
                {deleteTarget.tab === "materi"
                  ? `Materi “${deleteName}” beserta seluruh pemetaan pertemuannya akan dihapus.`
                  : `Pemetaan pertemuan ke-${deleteName} akan dihapus.`}
              </p>
            </div>
            <div className="d-flex justify-content-center gap-3 px-4 pb-5">
              <button type="button" className="btn btn-light" onClick={() => setDeleteTarget(null)}>Batal</button>
              <button type="button" className="btn btn-danger d-flex align-items-center gap-2" onClick={hapusData}><Trash2 size={17} /> Hapus</button>
            </div>
          </section>
        </div>
      )}

      {notice && (
        <div className="materi-toast" role="status">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <span className="flex-grow-1 fs-7 fw-semibold">{notice}</span>
          <button type="button" className="btn btn-sm p-0 text-green-700" aria-label="Tutup notifikasi" onClick={() => setNotice("")}><X size={17} /></button>
        </div>
      )}
    </main>
  );
}
