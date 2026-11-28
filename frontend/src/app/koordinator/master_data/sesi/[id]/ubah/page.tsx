"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Clock3, Home, Save } from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";
import { bacaSesi, simpanSesi, type SesiPelatihan } from "../../data";

const LIST_PATH = "/koordinator/master_data/sesi";

export default function UbahSesiPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [item, setItem] = useState<SesiPelatihan | null>(null);
  const [nomor, setNomor] = useState("");
  const [jam, setJam] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const target = bacaSesi().find((entry) => entry.id === params.id);
    if (!target) {
      showNotification({
        type: "error",
        title: "Sesi tidak ditemukan",
        message: "Data sesi yang ingin diubah sudah tidak tersedia.",
      });
      router.replace(LIST_PATH);
      return;
    }
    setItem(target);
    setNomor(String(target.nomor));
    setJam(target.jam);
    setLoading(false);
  }, [params.id, router, showNotification]);

  const simpanPerubahan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!item) return;

    const nomorSesi = Number(nomor);
    const jamBersih = jam.trim();
    if (!Number.isInteger(nomorSesi) || nomorSesi < 1 || nomorSesi > 999) {
      setFormError("Nomor sesi harus berupa angka 1 sampai 999.");
      showNotification({ type: "error", title: "Sesi gagal diperbarui", message: "Nomor sesi harus berupa angka 1 sampai 999." });
      return;
    }
    if (!jamBersih) {
      setFormError("Jam sesi wajib diisi.");
      showNotification({ type: "error", title: "Sesi gagal diperbarui", message: "Jam sesi wajib diisi." });
      return;
    }

    const dataTerbaru = bacaSesi();
    if (!dataTerbaru.some((entry) => entry.id === item.id)) {
      setFormError("Data sesi sudah tidak tersedia.");
      showNotification({ type: "error", title: "Sesi gagal diperbarui", message: "Data sesi sudah tidak tersedia." });
      router.replace(LIST_PATH);
      return;
    }
    if (dataTerbaru.some((entry) => entry.id !== item.id && entry.nomor === nomorSesi)) {
      setFormError(`Sesi ${nomorSesi} sudah tersedia.`);
      showNotification({ type: "error", title: "Sesi gagal diperbarui", message: `Sesi ${nomorSesi} sudah tersedia.` });
      return;
    }

    const nextItems = dataTerbaru.map((entry) =>
      entry.id === item.id ? { ...entry, nomor: nomorSesi, jam: jamBersih } : entry);
    if (!simpanSesi(nextItems)) {
      setFormError("Data sesi tidak dapat disimpan di browser.");
      showNotification({ type: "error", title: "Sesi gagal diperbarui", message: "Data sesi tidak dapat disimpan di browser." });
      return;
    }

    setItem({ ...item, nomor: nomorSesi, jam: jamBersih });
    showNotification({
      type: "success",
      title: "Sesi diperbarui",
      message: `Sesi ${nomorSesi} dengan jam ${jamBersih} berhasil diperbarui.`,
    });
    router.push(LIST_PATH);
  };

  return (
    <main className="sesi-page">
      <section className="materi-page-header">
        <div className="materi-breadcrumb d-flex align-items-center gap-2 fs-7 fw-semibold mb-2">
          <Home size={14} /><span>Master Data</span><ChevronRight size={14} /><span>Sesi</span><ChevronRight size={14} /><span>Ubah</span>
        </div>
        <h1 className="fs-2 fw-bolder mb-0">Ubah Sesi Pelatihan BLC</h1>
      </section>

      <section className="row g-4 mt-1">
        <div className="col-12 col-xl-8">
          <div className="card kategori-form-card">
            <div className="card-header d-flex align-items-center gap-3 py-4 px-4 px-lg-5">
              <span className="symbol symbol-40px">
                <span className="symbol-label bg-blue-100 text-blue-600"><Clock3 size={20} /></span>
              </span>
              <h2 className="fs-5 fw-bold text-gray-900 mb-0">Ubah Sesi Pelatihan BLC</h2>
            </div>
            <div className="card-body p-4 p-lg-5">
              {loading ? (
                <p className="text-muted mb-0">Memuat data sesi...</p>
              ) : (
                <form onSubmit={simpanPerubahan} noValidate>
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
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
