"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
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

export default function UbahUjianPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const awal = UJIAN[id];
  const [saving, setSaving] = useState(false);

  if (!awal) {
    return (
      <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-orange-200 bg-white p-10 text-center shadow-xl shadow-orange-300/40">
          <p className="mb-1 font-medium text-slate-800">Ujian tidak ditemukan</p>
          <p className="mb-5 text-sm text-slate-500">Nomor ujian tidak ada dalam data.</p>
          <Link href="/instruktur/master_ujian" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 hover:bg-orange-600"><ArrowLeft size={16} /> Kembali ke daftar ujian</Link>
        </div>
      </main>
    );
  }

  const simpan = async (n: NilaiUjian) => {
    setSaving(true);
    try {
      // TODO: PUT /api/ujian/{id} dengan body `n`
      showNotification({ type: "success", title: "Ujian diperbarui", message: namaUjian(n.jenis, n.materi, n.pertemuan) });
      router.push("/instruktur/master_ujian");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <HeaderHalaman icon={PencilLine} judul="Ubah profil ujian" deskripsi={namaUjian(awal.jenis, awal.materi, awal.pertemuan)} kembali="/instruktur/master_ujian" />
        <FormUjian awal={awal} kembali="/instruktur/master_ujian" labelSimpan="Perbarui" saving={saving} onSimpan={simpan} />
      </div>
    </main>
  );
}
