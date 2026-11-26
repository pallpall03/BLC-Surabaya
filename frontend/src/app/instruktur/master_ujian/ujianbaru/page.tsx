"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2 } from "lucide-react";
import HeaderHalaman from "../components/headerhalaman";
<<<<<<< HEAD
import FormUjian, { type NilaiUjian } from "../components/formujian";
import { saveUjian } from "@/lib/api";
=======
import FormUjian, { namaUjian, type NilaiUjian } from "../components/formujian";
import { useCrudNotification } from "@/components/CrudNotification";
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

export default function UjianBaruPage() {
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [saving, setSaving] = useState(false);
<<<<<<< HEAD
  const [error, setError] = useState("");
=======
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

  const simpan = async (nilai: NilaiUjian) => {
    setSaving(true); setError("");
    try {
<<<<<<< HEAD
      await saveUjian(null, nilai);
      router.push("/instruktur/master_ujian");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan ujian.");
=======
      // TODO: POST /api/ujian dengan body `n`, lalu ambil id ujian baru dari respons.
      const idBaru = 1; // sementara hardcode. Ganti dengan id dari respons API.
      showNotification({
        type: "success",
        title: "Ujian dibuat",
        message: namaUjian(n.jenis, n.materi, n.pertemuan),
        action: { label: "Isi peserta sekarang", onClick: () => router.push(`/instruktur/master_ujian/${idBaru}/peserta`) },
      });
    } finally {
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <HeaderHalaman icon={FilePlus2} judul="Buat ujian baru" deskripsi="Atur pretest atau posttest, isi soal, lalu jadwalkan untuk kelas." kembali="/instruktur/master_ujian" />
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <FormUjian kembali="/instruktur/master_ujian" saving={saving} onSimpan={simpan} />
      </div>
    </main>
  );
}
