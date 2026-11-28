"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2 } from "lucide-react";
import HeaderHalaman from "../components/headerhalaman";
import FormUjian, { type NilaiUjian } from "../components/formujian";
import { saveUjian } from "@/lib/api";
import { useCrudNotification } from "@/components/CrudNotification";

export default function UjianBaruPage() {
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const simpan = async (nilai: NilaiUjian) => {
    setSaving(true); setError("");
    try {
      const res = await saveUjian(null, nilai);
      showNotification({
        type: "success",
        title: "Ujian dibuat",
        message: res.data.judul,
        action: { label: "Atur peserta", onClick: () => router.push(`/instruktur/master_ujian/${res.data.id}/peserta`) },
      });
      router.push("/instruktur/master_ujian");
    } catch (e) {
      const teks = e instanceof Error ? e.message : "Gagal menyimpan ujian.";
      setError(teks);
      showNotification({ type: "error", title: "Ujian gagal dibuat", message: teks });
    } finally {
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
