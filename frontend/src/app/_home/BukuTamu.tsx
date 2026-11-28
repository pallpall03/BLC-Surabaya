"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import SectionWrap from "./SectionWrap";
import {
  ambilBukuTamu, ambilOpsiBukuTamu, kirimBukuTamu,
  type BukuTamu as Pesan, type FormTamu,
} from "../administrator/buku_tamu/data";
import type { PengunjungOpsi } from "@/lib/api";

const kosong: FormTamu = {
  nama: "", instansi: "", email: "", telepon: "", pesan: "",
  lokasi_blc_id: undefined, sesi_id: undefined, jenis_kelamin: "",
  tanggal_lahir: "", alamat: "", kategori: "",
};

export default function BukuTamu() {
  const [daftar, setDaftar] = useState<Pesan[]>([]);
  const [form, setForm] = useState<FormTamu>(kosong);
  const [opsi, setOpsi] = useState<PengunjungOpsi>({ blc: [], sesi: [], kategori: [] });
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState<boolean>(false);
  const [sukses, setSukses] = useState<boolean>(false);

  useEffect(() => {
    void Promise.allSettled([ambilBukuTamu(), ambilOpsiBukuTamu()]).then(([pesan, pilihan]) => {
      if (pesan.status === "fulfilled") setDaftar(pesan.value);
      if (pilihan.status === "fulfilled") {
        const data = pilihan.value;
        setOpsi(data);
        setForm((f) => ({
          ...f,
          lokasi_blc_id: f.lokasi_blc_id ?? data.blc[0]?.id,
          sesi_id: f.sesi_id ?? data.sesi[0]?.id,
        }));
      }
    });
  }, []);

  function ubah(kolom: keyof FormTamu, nilai: string) {
    setForm((f) => ({
      ...f,
      [kolom]: kolom === "lokasi_blc_id" || kolom === "sesi_id" ? Number(nilai) || undefined : nilai,
    }));
  }

  async function handleKirim() {
    if (!form.nama.trim() || !form.pesan.trim()) return setGalat("Nama dan pesan wajib diisi.");
    if (!form.lokasi_blc_id || !form.sesi_id) return setGalat("Pilih BLC dan sesi kunjungan.");
    setGalat("");
    setProses(true);
    try {
      const baru = await kirimBukuTamu({
        nama: form.nama.trim(),
        instansi: form.instansi.trim(),
        email: form.email.trim(),
        telepon: form.telepon.trim(),
        pesan: form.pesan.trim(),
        lokasi_blc_id: form.lokasi_blc_id,
        sesi_id: form.sesi_id,
        jenis_kelamin: form.jenis_kelamin,
        tanggal_lahir: form.tanggal_lahir,
        alamat: form.alamat?.trim(),
        kategori: form.kategori,
      });
      setDaftar((lama) => [baru, ...lama]);
      setForm((f) => ({ ...kosong, lokasi_blc_id: f.lokasi_blc_id, sesi_id: f.sesi_id }));
      setSukses(true);
      setTimeout(() => setSukses(false), 3000);
    } catch {
      setGalat("Gagal mengirim pesan. Coba lagi.");
    } finally {
      setProses(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";
  const catatan = <span className="font-normal text-slate-400">(opsional, tidak ditampilkan)</span>;

  return (
    <SectionWrap id="buku-tamu" judul="Buku Tamu" deskripsi="Tinggalkan kesan dan pesanmu untuk BLC Surabaya.">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className={labelClass}>Nama</label>
            <input value={form.nama} onChange={(e) => ubah("nama", e.target.value)} className={inputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>BLC kunjungan</label>
              <select value={form.lokasi_blc_id ?? ""} onChange={(e) => ubah("lokasi_blc_id", e.target.value)} className={inputClass}>
                <option value="">Pilih BLC</option>
                {opsi.blc.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Sesi kunjungan</label>
              <select value={form.sesi_id ?? ""} onChange={(e) => ubah("sesi_id", e.target.value)} className={inputClass}>
                <option value="">Pilih sesi</option>
                {opsi.sesi.map((s) => <option key={s.id} value={s.id}>Sesi {s.sesi} · {s.jam}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Asal (instansi, sekolah, atau kota)</label>
            <input value={form.instansi} onChange={(e) => ubah("instansi", e.target.value)} className={inputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Email {catatan}</label>
              <input type="email" value={form.email} onChange={(e) => ubah("email", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Telepon {catatan}</label>
              <input type="tel" value={form.telepon} onChange={(e) => ubah("telepon", e.target.value)} className={inputClass} />
            </div>
          </div>
          <details className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <summary className="cursor-pointer text-sm font-medium text-slate-700">Lengkapi data kunjungan (opsional)</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Jenis kelamin</label>
                <select value={form.jenis_kelamin ?? ""} onChange={(e) => ubah("jenis_kelamin", e.target.value)} className={inputClass}>
                  <option value="">Pilih</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tanggal lahir</label>
                <input type="date" value={form.tanggal_lahir ?? ""} onChange={(e) => ubah("tanggal_lahir", e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Alamat</label>
                <input value={form.alamat ?? ""} onChange={(e) => ubah("alamat", e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Kategori pengunjung</label>
                <select value={form.kategori ?? ""} onChange={(e) => ubah("kategori", e.target.value)} className={inputClass}>
                  <option value="">Pilih kategori</option>
                  {opsi.kategori.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
          </details>
          <div>
            <label className={labelClass}>Pesan</label>
            <textarea
              value={form.pesan}
              onChange={(e) => ubah("pesan", e.target.value)}
              rows={4}
              maxLength={300}
              className={inputClass}
            />
          </div>
          {galat && <p className="text-sm text-red-600">{galat}</p>}
          {sukses && (
            <p className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 size={16} /> Terima kasih, pesanmu terkirim.
            </p>
          )}
          <button
            onClick={handleKirim}
            disabled={proses}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600 disabled:opacity-60"
          >
            <Send size={16} /> {proses ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </div>

        <div className="max-h-[480px] space-y-3 overflow-y-auto pr-1">
          {(!Array.isArray(daftar) || daftar.length === 0) ? (
            <p className="py-8 text-center text-sm text-slate-400">Belum ada pesan.</p>
          ) : (
            daftar.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                    {p.nama.charAt(0).toUpperCase()}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-800">{p.nama}</p>
                    <p className="text-xs text-slate-400">
                      {p.instansi ? `${p.instansi} · ` : ""}
                      {p.blc ? `${p.blc} · ` : ""}
                      {p.tanggal}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{p.pesan}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </SectionWrap>
  );
}