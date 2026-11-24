"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import HeaderHalaman from "../components/headerhalaman";
import FormAktivitas, { hariIni, NILAI_KOSONG, validasiAktivitas, type NilaiAktivitas } from "../components/formaktivitas";

export default function EntryAktivitasPage() {
  const router = useRouter();
  const [nilai, setNilai] = useState<NilaiAktivitas>(NILAI_KOSONG);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Isi tanggal setelah hydration agar tanggal server dan browser tidak berbeda.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNilai((n) => (n.tanggal ? n : { ...n, tanggal: hariIni() }));
  }, []);

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    const pesan = validasiAktivitas(nilai);
    if (pesan) return setError(pesan);
    setSaving(true);
    try {
      // TODO (backend): kirim ke API sebagai multipart/form-data, contoh:
      // const body = new FormData();
      // body.append("tanggal", nilai.tanggal);                          // "2026-11-19"
      // nilai.sesi.forEach((s) => body.append("sesi[]", String(s)));     // sesi[]=4&sesi[]=5
      // body.append("lokasi", nilai.lokasi);
      // body.append("keterangan", nilai.keterangan);
      // nilai.fotoBaru.forEach((f) => body.append("foto[]", f));         // file foto (boleh banyak)
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aktivitas`, { method: "POST", body });
      router.push("/instruktur/aktivitas");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <HeaderHalaman icon={CalendarPlus} judul="Entry aktivitas baru" kembali="/instruktur/aktivitas" deskripsi="Catat kegiatan yang sudah kamu lakukan." />
        <FormAktivitas nilai={nilai} onChange={(n) => { setError(""); setNilai(n); }} onSubmit={simpan} saving={saving} error={error} kembali="/instruktur/aktivitas" />
      </div>
    </main>
  );
}
