"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Home, ListChecks } from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";
import FormSoal from "../../form-soal";
import {
  bacaSoal,
  simpanSoal,
  type KunciJawaban,
  type SoalFormValue,
  type SoalPelatihan,
} from "../../data";

const LIST_PATH = "/koordinator/master_data/soal";

export default function UbahSoalPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [item, setItem] = useState<SoalPelatihan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const target = bacaSoal().find((entry) => entry.id === params.id);
    if (!target) {
      showNotification({ type: "error", title: "Soal tidak ditemukan", message: "Data soal yang ingin diubah sudah tidak tersedia." });
      router.replace(LIST_PATH);
      return;
    }
    setItem(target);
    setLoading(false);
  }, [params.id, router, showNotification]);

  const simpan = (value: SoalFormValue) => {
    if (!item) return false;
    const dataTerbaru = bacaSoal();
    if (!dataTerbaru.some((entry) => entry.id === item.id)) {
      showNotification({ type: "error", title: "Soal gagal diperbarui", message: "Data soal sudah tidak tersedia." });
      router.replace(LIST_PATH);
      return false;
    }

    const nextItems = dataTerbaru.map((entry) => entry.id === item.id
      ? {
          ...entry,
          materi: value.materi,
          pertemuan: Number(value.pertemuan),
          teks: value.teks,
          gambarSoal: value.gambarSoal,
          jawaban: value.jawaban,
          kunciJawaban: value.kunciJawaban as KunciJawaban,
          bobotNilai: Number(value.bobotNilai),
          diperbaruiPada: new Date().toISOString(),
        }
      : entry);

    if (!simpanSoal(nextItems)) {
      showNotification({ type: "error", title: "Soal gagal diperbarui", message: "Data soal tidak dapat disimpan di browser." });
      return false;
    }

    showNotification({ type: "success", title: "Soal diperbarui", message: "Perubahan soal pelatihan berhasil disimpan." });
    router.push(LIST_PATH);
    return true;
  };

  return (
    <main className="soal-page">
      <section className="materi-page-header">
        <div className="materi-breadcrumb d-flex align-items-center gap-2 fs-7 fw-semibold mb-2">
          <Home size={14} /><span>Master Data</span><ChevronRight size={14} /><span>Soal</span><ChevronRight size={14} /><span>Ubah</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="symbol symbol-50px flex-shrink-0"><span className="symbol-label bg-white bg-opacity-15 text-white"><ListChecks size={24} /></span></span>
          <h1 className="fs-2 fw-bolder mb-0">Ubah Soal Pelatihan BLC</h1>
        </div>
      </section>
      <div className="mt-4">
        {loading ? (
          <div className="card kategori-form-card p-5 text-muted">Memuat data soal...</div>
        ) : item ? (
          <FormSoal key={item.id} mode="ubah" awal={item} onSimpan={simpan} />
        ) : null}
      </div>
    </main>
  );
}
