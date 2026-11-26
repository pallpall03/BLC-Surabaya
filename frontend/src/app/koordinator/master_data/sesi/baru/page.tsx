"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Clock3, Home, Save } from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";
import { bacaSesi, simpanSesi } from "../data";

const LIST_PATH = "/koordinator/master_data/sesi";

export default function SesiBaruPage() {
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [nomor, setNomor] = useState("");
  const [jam, setJam] = useState("");
  const [formError, setFormError] = useState("");

  const simpanSesiBaru = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nomorSesi = Number(nomor);
    const jamBersih = jam.trim();

    if (!Number.isInteger(nomorSesi) || nomorSesi < 1 || nomorSesi > 999) {
      setFormError("Nomor sesi harus berupa angka 1 sampai 999.");
      showNotification({ type: "error", title: "Sesi gagal disimpan", message: "Nomor sesi harus berupa angka 1 sampai 999." });
      return;
    }
    if (!jamBersih) {
      setFormError("Jam sesi wajib diisi.");
      showNotification({ type: "error", title: "Sesi gagal disimpan", message: "Jam sesi wajib diisi." });
      return;
    }

    const dataTerbaru = bacaSesi();
    if (dataTerbaru.some((item) => item.nomor === nomorSesi)) {
      setFormError(`Sesi ${nomorSesi} sudah tersedia.`);
      showNotification({ type: "error", title: "Sesi gagal disimpan", message: `Sesi ${nomorSesi} sudah tersedia.` });
      return;
    }

    const id = `sesi-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
    const nextItems = [...dataTerbaru, { id, nomor: nomorSesi, jam: jamBersih }];
    if (!simpanSesi(nextItems)) {
      setFormError("Data sesi tidak dapat disimpan di browser.");
      showNotification({ type: "error", title: "Sesi gagal disimpan", message: "Data sesi tidak dapat disimpan di browser." });
      return;
    }

    showNotification({
      type: "success",
      title: "Sesi ditambahkan",
      message: `Sesi ${nomorSesi} dengan jam ${jamBersih} berhasil ditambahkan.`,
    });
    router.push(LIST_PATH);
  };

  return (
    <main className="sesi-page">
      <section className="materi-page-header">
        <div className="materi-breadcrumb d-flex align-items-center gap-2 fs-7 fw-semibold mb-2">
          <Home size={14} /><span>Master Data</span><ChevronRight size={14} /><span>Sesi</span><ChevronRight size={14} /><span>Baru</span>
        </div>
        <h1 className="fs-2 fw-bolder mb-0">Sesi Pelatihan BLC Baru</h1>
      </section>

      <section className="row g-4 mt-1">
        <div className="col-12 col-xl-8">
          <div className="card kategori-form-card">
            <div className="card-header d-flex align-items-center gap-3 py-4 px-4 px-lg-5">
              <span className="symbol symbol-40px">
                <span className="symbol-label bg-blue-100 text-blue-600"><Clock3 size={20} /></span>
              </span>
              <h2 className="fs-5 fw-bold text-gray-900 mb-0">Buat Sesi Pelatihan BLC Baru</h2>
            </div>
            <div className="card-body p-4 p-lg-5">
              <form onSubmit={simpanSesiBaru} noValidate>
                <div className="row g-4">
                  <div className="col-12 col-md-4">
                    <label htmlFor="sesi-nomor" className="form-label fw-semibold">Sesi</label>
                    <input
                      id="sesi-nomor"
                      type="number"
                      className="form-control"
                      value={nomor}
                      onChange={(event) => {
                        setNomor(event.target.value);
                        setFormError("");
                      }}
                      placeholder="Contoh: 1"
                      min={1}
                      max={999}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="col-12 col-md-8">
                    <label htmlFor="sesi-jam" className="form-label fw-semibold">Jam</label>
                    <input
                      id="sesi-jam"
                      type="text"
                      className="form-control"
                      value={jam}
                      onChange={(event) => {
                        setJam(event.target.value);
                        setFormError("");
                      }}
                      placeholder="Contoh: 08.00-10.00"
                      maxLength={50}
                      required
                    />
                  </div>
                </div>
                {formError && <div className="alert alert-danger mt-4 mb-0 py-3" role="alert">{formError}</div>}
                <div className="d-flex justify-content-end gap-3 mt-5">
                  <Link href={LIST_PATH} className="btn btn-light">Batal</Link>
                  <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2"><Save size={16} /> Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
