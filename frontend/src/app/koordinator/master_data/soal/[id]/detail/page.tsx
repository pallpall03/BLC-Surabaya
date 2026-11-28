"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Eye,
  Home,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";
import { bacaSoal, formatTanggal, PILIHAN_JAWABAN, type SoalPelatihan } from "../../data";

const LIST_PATH = "/koordinator/master_data/soal";

export default function DetailSoalPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [item, setItem] = useState<SoalPelatihan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const target = bacaSoal().find((entry) => entry.id === params.id);
    if (!target) {
      showNotification({ type: "error", title: "Soal tidak ditemukan", message: "Data soal yang ingin dilihat sudah tidak tersedia." });
      router.replace(LIST_PATH);
      return;
    }
    setItem(target);
    setLoading(false);
  }, [params.id, router, showNotification]);

  return (
    <main className="soal-page">
      <section className="materi-page-header">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div>
            <div className="materi-breadcrumb d-flex align-items-center gap-2 fs-7 fw-semibold mb-2">
              <Home size={14} /><span>Master Data</span><ChevronRight size={14} /><span>Soal</span><ChevronRight size={14} /><span>Detail</span>
            </div>
            <h1 className="fs-2 fw-bolder mb-2">Detail Soal</h1>
            <p className="mb-0 text-white text-opacity-75">Tinjau pertanyaan, pilihan jawaban, dan kunci jawaban.</p>
          </div>
          {item && (
            <Link href={`${LIST_PATH}/${encodeURIComponent(item.id)}/ubah`} className="btn btn-light d-inline-flex align-items-center justify-content-center gap-2">
              <Pencil size={17} /> Ubah Soal
            </Link>
          )}
        </div>
      </section>

      {loading ? (
        <div className="card kategori-form-card p-5 text-muted mt-4">Memuat detail soal...</div>
      ) : item ? (
        <div className="row g-4 mt-1">
          <div className="col-12 col-xl-8">
            <section className="card kategori-table-card soal-detail-card" aria-labelledby="detail-soal-title">
              <div className="card-header py-4 px-4 px-lg-5">
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="symbol symbol-40px"><span className="symbol-label bg-blue-100 text-blue-600"><Eye size={20} /></span></span>
                    <div>
                      <h2 id="detail-soal-title" className="fs-5 fw-bold text-gray-900 mb-1">Pertanyaan</h2>
                      <p className="text-muted fs-7 mb-0">{item.materi} · Pertemuan {item.pertemuan}</p>
                    </div>
                  </div>
                  <span className="badge bg-blue-100 text-blue-700 px-3 py-2">Bobot {item.bobotNilai}</span>
                </div>
              </div>
              <div className="card-body p-4 p-lg-5">
                <div className="soal-detail-question">
                  <span className="soal-detail-label">Soal</span>
                  <p>{item.teks}</p>
                  {item.gambarSoal ? (
                    <div className="soal-detail-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.gambarSoal} alt="Gambar soal" />
                    </div>
                  ) : (
                    <div className="soal-detail-image-empty"><ImageIcon size={22} /> Tanpa gambar soal</div>
                  )}
                </div>

                <div className="soal-detail-divider" />

                <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                  <h3 className="fs-6 fw-bold text-gray-900 mb-0">Pilihan Jawaban</h3>
                  <span className="text-muted fs-7">Kunci: <strong className="text-blue-700">Jawaban {item.kunciJawaban}</strong></span>
                </div>
                <div className="soal-detail-answers">
                  {PILIHAN_JAWABAN.map((huruf, index) => {
                    const entry = item.jawaban[index];
                    const correct = item.kunciJawaban === huruf;
                    return (
                      <div className={`soal-detail-answer${correct ? " soal-detail-answer--correct" : ""}`} key={huruf}>
                        <span className="soal-detail-answer__letter">{huruf}</span>
                        <div className="soal-detail-answer__content">
                          {entry.gambar && (
                            <div className="soal-detail-answer__image">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={entry.gambar} alt={`Gambar jawaban ${huruf}`} />
                            </div>
                          )}
                          <p>{entry.teks}</p>
                        </div>
                        {correct && <span className="soal-detail-answer__key"><CheckCircle2 size={16} /> Kunci jawaban</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <div className="col-12 col-xl-4">
            <aside className="soal-detail-sidebar">
              <div className="card kategori-form-card">
                <div className="card-header py-4 px-4">
                  <h2 className="fs-6 fw-bold text-gray-900 mb-0">Informasi soal</h2>
                </div>
                <div className="card-body p-4">
                  <dl className="soal-detail-meta">
                    <div><dt><BookOpenCheck size={15} /> Materi</dt><dd>{item.materi}</dd></div>
                    <div><dt><CalendarClock size={15} /> Pertemuan</dt><dd>Pertemuan {item.pertemuan}</dd></div>
                    <div><dt><CheckCircle2 size={15} /> Kunci jawaban</dt><dd><span className="badge bg-blue-100 text-blue-700">Jawaban {item.kunciJawaban}</span></dd></div>
                    <div><dt><CalendarClock size={15} /> Dibuat pada</dt><dd>{formatTanggal(item.dibuatPada)}</dd></div>
                    <div><dt><CalendarClock size={15} /> Diperbarui</dt><dd>{formatTanggal(item.diperbaruiPada)}</dd></div>
                  </dl>
                </div>
              </div>
              <Link href={LIST_PATH} className="btn btn-light w-100 mt-3 d-inline-flex align-items-center justify-content-center gap-2"><ArrowLeft size={16} /> Kembali ke daftar</Link>
            </aside>
          </div>
        </div>
      ) : null}
    </main>
  );
}
