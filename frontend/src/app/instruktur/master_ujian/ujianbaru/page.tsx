"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2, UserPlus } from "lucide-react";
import HeaderHalaman from "../components/headerhalaman";
import FormUjian, { namaUjian, type NilaiUjian } from "../components/formujian";
import PopupSukses from "../components/popupsukses";

export default function UjianBaruPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [sukses, setSukses] = useState<{ id: number; nama: string } | null>(null);

  const simpan = async (n: NilaiUjian) => {
    setSaving(true);
    try {
      // TODO: POST /api/ujian dengan body `n`, lalu ambil id ujian baru dari respons.
      const idBaru = 1; // sementara hardcode. Ganti dengan id dari respons API.
      setSukses({ id: idBaru, nama: namaUjian(n.jenis, n.materi, n.pertemuan) });
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

      {sukses && (
        <PopupSukses judul="Ujian dibuat" detail={sukses.nama} otomatis={0} onTutup={() => router.push("/instruktur/master_ujian")}>
          <button type="button" onClick={() => router.push(`/instruktur/master_ujian/${sukses.id}/peserta`)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-700">
            <UserPlus size={18} /> Isi peserta sekarang
          </button>
          <button type="button" onClick={() => router.push("/instruktur/master_ujian")}
            className="w-full rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50">Nanti saja</button>
        </PopupSukses>
      )}
    </main>
  );
}
