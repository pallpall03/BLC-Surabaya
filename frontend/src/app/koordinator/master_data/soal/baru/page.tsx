"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Home, ListChecks } from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";
import FormSoal from "../form-soal";
import {
  bacaSoal,
  simpanSoal,
  type KunciJawaban,
  type SoalFormValue,
  type SoalPelatihan,
} from "../data";

const LIST_PATH = "/koordinator/master_data/soal";

export default function SoalBaruPage() {
  const router = useRouter();
  const { showNotification } = useCrudNotification();

  const simpan = (value: SoalFormValue) => {
    const sekarang = new Date().toISOString();
    const item: SoalPelatihan = {
      id: `soal-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`,
      materi: value.materi,
      pertemuan: Number(value.pertemuan),
      teks: value.teks,
      gambarSoal: value.gambarSoal,
      jawaban: value.jawaban,
      kunciJawaban: value.kunciJawaban as KunciJawaban,
      bobotNilai: Number(value.bobotNilai),
      dibuatPada: sekarang,
      diperbaruiPada: sekarang,
    };

    const nextItems = [...bacaSoal(), item];
    if (!simpanSoal(nextItems)) {
      showNotification({ type: "error", title: "Soal gagal disimpan", message: "Data soal tidak dapat disimpan di browser." });
      return false;
    }

    showNotification({ type: "success", title: "Soal ditambahkan", message: "Soal pelatihan baru berhasil ditambahkan." });
    router.push(LIST_PATH);
    return true;
  };

  return (
    <main className="soal-page">
      <section className="materi-page-header">
        <div className="materi-breadcrumb d-flex align-items-center gap-2 fs-7 fw-semibold mb-2">
          <Home size={14} /><span>Master Data</span><ChevronRight size={14} /><span>Soal</span><ChevronRight size={14} /><span>Baru</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="symbol symbol-50px flex-shrink-0"><span className="symbol-label bg-white bg-opacity-15 text-white"><ListChecks size={24} /></span></span>
          <h1 className="fs-2 fw-bolder mb-0">Soal Pelatihan BLC Baru</h1>
        </div>
      </section>
      <div className="mt-4">
        <FormSoal mode="baru" onSimpan={simpan} />
      </div>
    </main>
  );
}
