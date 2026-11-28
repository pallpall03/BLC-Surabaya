"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
import FormUjian, { type NilaiUjian } from "../../components/formujian";
import { getUjianDetail, saveUjian, type Ujian } from "@/lib/api";
import { useCrudNotification } from "@/components/CrudNotification";

export default function UbahUjianPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [ujian, setUjian] = useState<Ujian | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let aktif = true;
    void Promise.resolve().then(async () => {
      try {
        const res = await getUjianDetail(Number(id));
        if (aktif) setUjian(res.data);
      } catch (e) {
        if (aktif) setError(e instanceof Error ? e.message : "Gagal memuat ujian.");
      } finally {
        if (aktif) setLoading(false);
      }
    });
    return () => { aktif = false; };
  }, [id]);

  const simpan = async (nilai: NilaiUjian) => {
    setSaving(true); setError("");
    try {
      await saveUjian(Number(id), nilai);
      showNotification({ type: "success", title: "Ujian diperbarui", message: nilai.judul });
      router.push("/instruktur/master_ujian");
    } catch (e) {
      const teks = e instanceof Error ? e.message : "Gagal memperbarui ujian.";
      setError(teks);
      showNotification({ type: "error", title: "Ujian gagal diperbarui", message: teks });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <HeaderHalaman icon={PencilLine} judul="Ubah ujian" deskripsi="Perbarui informasi, soal, atau kunci jawaban." kembali="/instruktur/master_ujian" />
        {loading ? <p className="rounded-2xl border border-orange-200 bg-white p-10 text-center text-sm text-slate-500">Memuat data ujian...</p> : ujian ? (
          <>
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <FormUjian awal={ujian} kembali="/instruktur/master_ujian" labelSimpan="Perbarui ujian" saving={saving} onSimpan={simpan} />
          </>
        ) : (
          <div className="rounded-2xl border border-orange-200 bg-white p-10 text-center">
            <p className="font-medium text-slate-800">Ujian tidak ditemukan</p>
            <p className="mt-1 text-sm text-slate-500">{error || "Data ujian telah dihapus."}</p>
            <Link href="/instruktur/master_ujian" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white"><ArrowLeft size={16} /> Kembali</Link>
          </div>
        )}
      </div>
    </main>
  );
}
