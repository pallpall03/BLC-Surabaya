"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
import FormAktivitas, { validasiAktivitas, type Aktivitas, type NilaiAktivitas } from "../../components/formaktivitas";
import { useCrudNotification } from "@/components/CrudNotification";

// HARDCODE: satu aktivitas contoh (apa pun id-nya, yang tampil data ini).
// TODO (backend): ambil dari API memakai id dari URL, mis. GET /aktivitas/{id}
const CONTOH: Aktivitas = {
  id: 1,
  tanggal: "2026-07-23",
  sesi: [4, 5],
  lokasi: "Kelurahan Menur Pumpungan",
  keterangan: "koordinasi dengan kelurahan menur pumpungan terkait survey cekin warga",
  foto: [{ id: 101, url: "" }],
};

export default function UbahAktivitasPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [nilai, setNilai] = useState<NilaiAktivitas>({
    tanggal: CONTOH.tanggal, sesi: CONTOH.sesi, lokasi: CONTOH.lokasi, keterangan: CONTOH.keterangan,
    fotoLama: CONTOH.foto, fotoBaru: [],
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    const pesan = validasiAktivitas(nilai);
    if (pesan) return setError(pesan);
    setSaving(true);
    try {
      // TODO (backend): kirim ke API sebagai multipart/form-data, contoh:
      // const body = new FormData();
      // body.append("_method", "PUT");   // Laravel tidak membaca multipart lewat PUT, jadi pakai POST + _method
      // body.append("tanggal", nilai.tanggal);
      // nilai.sesi.forEach((s) => body.append("sesi[]", String(s)));
      // body.append("lokasi", nilai.lokasi);
      // body.append("keterangan", nilai.keterangan);
      // nilai.fotoLama.forEach((f) => body.append("foto_lama[]", String(f.id)));  // id foto lama yang DIPERTAHANKAN
      // nilai.fotoBaru.forEach((f) => body.append("foto[]", f));                  // foto baru
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aktivitas/${id}`, { method: "POST", body });
      showNotification({ type: "success", title: "Aktivitas diperbarui", message: "Perubahan aktivitas berhasil disimpan." });
      router.push("/instruktur/aktivitas");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <HeaderHalaman icon={PencilLine} judul="Ubah aktivitas" kembali="/instruktur/aktivitas" deskripsi={`Mengubah aktivitas nomor ${id}`} />
        <FormAktivitas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan} saving={saving} error={error} kembali="/instruktur/aktivitas" />
      </div>
    </main>
  );
}
