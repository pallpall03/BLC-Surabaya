"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { kirimBukuTamu } from "@/app/administrator/buku_tamu/data";

export default function HalamanBukuTamu() {
  const [nama, setNama] = useState("");
  const [instansi, setInstansi] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [pesan, setPesan] = useState("");
  const [jebakan, setJebakan] = useState(""); // kolom tersembunyi untuk menjebak bot
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState<boolean>(false);
  const [sukses, setSukses] = useState<boolean>(false);

  async function handleKirim() {
    // bot biasanya mengisi semua kolom, termasuk yang tersembunyi: pura-pura berhasil
    if (jebakan) {
      setSukses(true);
      return;
    }

    if (!nama.trim()) return setGalat("Nama wajib diisi.");
    if (pesan.trim().length < 10) return setGalat("Pesan minimal 10 karakter.");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return setGalat("Format email belum benar.");

    setGalat("");
    setProses(true);
    try {
      await kirimBukuTamu({ nama, instansi, email, telepon, pesan });
      setSukses(true);
    } catch {
      setGalat("Pesan gagal dikirim. Coba lagi beberapa saat.");
    } finally {
      setProses(false);
    }
  }

  function isiLagi() {
    setNama("");
    setInstansi("");
    setEmail("");
    setTelepon("");
    setPesan("");
    setSukses(false);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-orange-50 px-6 pb-16 pt-32">
      <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-2">
        {/* KIRI: pengantar */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Buku Tamu
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
            Tinggalkan pesan untuk kami
          </h1>
          <p className="mt-4 text-slate-500">
            Pernah berkunjung atau punya pertanyaan seputar BLC Surabaya? Tulis kesan,
            saran, atau pertanyaanmu di sini. Tidak perlu login.
          </p>
        </div>

        {/* KANAN: form / pesan sukses */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-sky-100 sm:p-8">
          {sukses ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 size={36} />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-slate-800">Terima kasih!</h2>
              <p className="mt-1 text-sm text-slate-500">Pesanmu sudah kami terima.</p>
              <button
                onClick={isiLagi}
                className="mt-6 rounded-xl bg-orange-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Isi lagi
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  maxLength={100}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Asal (instansi / sekolah / kota)
                </label>
                <input
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
                  maxLength={100}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={100}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    No. telepon
                  </label>
                  <input
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    maxLength={20}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  rows={5}
                  maxLength={1000}
                  className={inputClass}
                />
                <p className="mt-1 text-right text-xs text-slate-400">{pesan.length}/1000</p>
              </div>

              {/* kolom jebakan bot: tidak terlihat oleh manusia */}
              <input
                value={jebakan}
                onChange={(e) => setJebakan(e.target.value)}
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              {galat && <p className="text-sm text-red-600">{galat}</p>}

              <button
                onClick={handleKirim}
                disabled={proses}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:opacity-60"
              >
                <Send size={16} /> {proses ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}