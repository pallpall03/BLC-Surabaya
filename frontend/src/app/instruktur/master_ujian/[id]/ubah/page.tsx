"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
<<<<<<< HEAD
import FormUjian, { type NilaiUjian } from "../../components/formujian";
import { getUjianDetail, saveUjian, type Ujian } from "@/lib/api";
=======
import FormUjian, { namaUjian, type NilaiUjian } from "../../components/formujian";
import { useCrudNotification } from "@/components/CrudNotification";

const APK = "APLIKASI PERKANTORAN";
const u = (jenis: NilaiUjian["jenis"], pertemuan: number, mulai: string, sampai: string, acak: NilaiUjian["acak"] = "acak"): NilaiUjian => ({
  materi: APK, pertemuan: String(pertemuan), jenis, jumlahSoal: "5", mulai, sampai, waktu: "60", acak,
});

// TODO: ganti dengan GET /api/ujian/{id}
const UJIAN: Record<string, NilaiUjian> = {
  "1": u("Pre Test", 1, "2026-06-03T09:24", "2026-06-04T11:24"),
  "2": u("Post Test", 1, "2026-06-09T11:35", "2026-06-10T11:35"),
  "3": u("Post Test", 2, "2026-06-09T11:39", "2026-06-10T11:39"),
  "4": u("Post Test", 2, "2026-06-25T08:29", "2026-06-26T08:29", "urut"),
  "5": u("Post Test", 3, "2026-07-03T08:35", "2026-07-04T08:35"),
  "6": u("Pre Test", 4, "2026-07-24T09:57", "2026-07-25T09:57"),
  "7": u("Post Test", 5, "2026-07-24T10:01", "2026-07-25T10:01"),
};
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

export default function UbahUjianPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
<<<<<<< HEAD
  const [ujian, setUjian] = useState<Ujian | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
=======
  const { showNotification } = useCrudNotification();
  const awal = UJIAN[id];
  const [saving, setSaving] = useState(false);
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

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
<<<<<<< HEAD
      await saveUjian(Number(id), nilai);
      router.push("/instruktur/master_ujian");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memperbarui ujian.");
=======
      // TODO: PUT /api/ujian/{id} dengan body `n`
      showNotification({ type: "success", title: "Ujian diperbarui", message: namaUjian(n.jenis, n.materi, n.pertemuan) });
      router.push("/instruktur/master_ujian");
    } finally {
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
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
