"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2 } from "lucide-react";
import HeaderHalaman from "../components/headerhalaman";
import FormUjian, { namaUjian, type NilaiUjian } from "../components/formujian";
import { useCrudNotification } from "@/components/CrudNotification";

export default function UjianBaruPage() {
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [saving, setSaving] = useState(false);

  const simpan = async (n: NilaiUjian) => {
    setSaving(true);
    try {
      // TODO: POST /api/ujian dengan body `n`, lalu ambil id ujian baru dari respons.
      const idBaru = 1; // sementara hardcode. Ganti dengan id dari respons API.
      showNotification({
        type: "success",
        title: "Ujian dibuat",
        message: namaUjian(n.jenis, n.materi, n.pertemuan),
        action: { label: "Isi peserta sekarang", onClick: () => router.push(`/instruktur/master_ujian/${idBaru}/peserta`) },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <HeaderHalaman icon={FilePlus2} judul="Buat ujian baru" deskripsi="Pilih materi dan atur jadwal ujian." kembali="/instruktur/master_ujian" />
        <FormUjian kembali="/instruktur/master_ujian" saving={saving} onSimpan={simpan} />
      </div>
    </main>
  );
}
